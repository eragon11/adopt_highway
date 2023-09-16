#Requires -Version 5.1
#Requires -RunAsAdministrator

<#
.SYNOPSIS
    Verifies this machine can build and run Adopt-A-Highway. Requires admin level access and PowerShell minimum version 5.1
.DESCRIPTION
    Tests the .env to ensure a SQL Server connection exists for the APP_SA_USER with password of APP_SA_PASSWORD.
    Ensures that Chocolatey is installed so we can install Node.JS LTS. 
    Ensures that jshint is installed for code-quality.
.EXAMPLE
    PS C:\> .\setup.ps1
.OUTPUTS
    When successfully configured, returns: "This machine configured successfully to run Adopt-A-Highway"
#>

function execute-task ($task, $mainBlock) {

    $stopwatch = [System.Diagnostics.Stopwatch]::new()
    $stopwatch.Start()
    $seconds = $stopwatch.Elapsed.Seconds

    try {
        &$mainBlock
        $seconds = $Stopwatch.Elapsed.TotalSeconds
        write-host
        write-host "$task complete in $seconds seconds" -fore GREEN
    }
    catch [Exception] {
        $seconds = $Stopwatch.Elapsed.TotalSeconds
        write-host
        write-host $_.Exception.Message -fore RED
        write-host
        write-host "$task failed after $seconds seconds" -fore RED
        exit $lastexitcode
    }
    finally {
        $stopwatch.Stop()
        $stopwatch = $null
    }
}

function execute($command, $path) {
    if ($null -eq $path) {
        $global:lastexitcode = 0
        & $command
    }
    else {
        Push-Location $path
        $global:lastexitcode = 0
        & $command
        Pop-Location
    }

    if ($lastexitcode -ne 0) {
        throw "Error executing command:$command"
        Pop-Location
    }
}

function Test-Command {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $CommandName
    )
    return (Get-Command $CommandName -ErrorAction Ignore)
}

<#
.SYNOPSIS
    Returns the variable of the setting passed from the .env file.
.DESCRIPTION
    Retrieves a string containing the value of an variable from a .env file, using the path. Uses this directory as a default.
.EXAMPLE
    PS C:\> Get-EnvSetting "MY_VARIABLE"
    Returns a string for MY_VARIABLE.
.INPUTS
    Path (optional is the relative path to the .env file.
    Setting (required) is the name of the setting to return.
.OUTPUTS
    A string of the value for Setting
.NOTES
    The method will return "No setting for <file path>" when the setting is not found.
    The search converts the setting to lower case for comparison.
#>
function Get-EnvSetting {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $false)]
        [string]
        $path = ".\\.env",
        [Parameter(Mandatory = $true)]
        [string]
        $setting
    )

    $content = Get-Content -Path $path

    #load the content to environment
    foreach ($line in $content) {
        if ($line.StartsWith("#")) { continue };
        if ($line.Trim()) {
            $line = $line.Replace("`"", "")
            $kvp = $line -split "=", 2
            if ($kvp[0] -eq $setting) {
                return $kvp[1].Trim()
            }
        }
    }
    throw "There is no $setting in $path "
} 

function Test-SQLConnection {    
    [OutputType([bool])]
    Param
    (
        [Parameter(Mandatory = $true,
            ValueFromPipelineByPropertyName = $true,
            Position = 0)]
        $ConnectionString
    )
    try {
        $sqlConnection = New-Object System.Data.SqlClient.SqlConnection $ConnectionString;
        $sqlConnection.Open();
        $sqlConnection.Close();

        return $null;
    }
    catch {
        return $_.Exception.Message;
    }
}

Write-Host "Test if machine is configured successfully to run Adopt-A-Highway" -ForegroundColor Green    

execute-task "Updating (or creating new) environment files from .env.example" {
    # Ensure we have our env files
    $apps = @("./database", "./apps/web", "./apps/api")
    foreach ($app in $apps) {
        Push-Location $app
        $env = Join-Path (Resolve-Path $PWD) ".env"
        $envExample = Join-Path (Resolve-Path $PWD) ".env.example"
        Copy-Item -Path $envExample -destination $env -Force
        Pop-Location
    }
}

execute-task "Check for required software" {
    # Install dotnetcore for winsw, and for using System.Version
    choco install dotnetcore --version=3.1.15 -y --allow-downgrade | Out-Null

    # install chocolatey
    if (-not (Test-Command "choco")) {
        Write-Host "Installing Chocolatey"
        Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))    
        refreshenv | Out-Null
    }

    # install Node JS
    if (-not (Test-Command "node")) {
        choco install nodejs-lts -y --ignore-detected-reboot | Out-Null
        refreshenv | Out-Null
    }

    # install sqlcmd for use in db migrations
    if (-not (Test-Command "sqlcmd")) {
        choco install sqlserver-cmdlineutils -y | Out-Null
        refreshenv | Out-Null
    }

    # Install Google Chrome v90.0.4430.93
    choco install googlechrome --version=90.0.4430.93 -y --allow-downgrade | Out-Null

    # Install SQL Local Db
    $sapwd = Get-EnvSetting -path .\database\.env -setting "TEST_SA_PASSWORD"

    # Make a configuration file
    @"
; Microsoft SQL Server Configuration file  
[OPTIONS]  
IACCEPTSQLSERVERLICENSETERMS=1
QUIET=1
ACTION="install"
INSTANCEID=SQLEXPRESS 
INSTANCENAME=SQLEXPRESS
UPDATEENABLED=0
SECURITYMODE=SQL
SAPWD=$sapwd
TCPENABLED=1
NPENABLED=1
"@ | Out-File .\sqlexpress-configuration.ini -Force -ErrorAction Ignore
    # install SQL Server Express local db with the config file we made
    choco install sql-server-express --version=2019.20200409 -o -ia "'/CONFIGURATIONFILE=sqlexpress-configuration.ini'" -y | Out-Null

    Remove-Item .\sqlexpress-configuration.ini -Force -ErrorAction Ignore

    # Install Microsoft Command Line Utilities for SQL server
    choco install sqlserver-cmdlineutils -y --version=15.0.2000.5 | Out-Null

    refreshenv | Out-Null

}

execute-task "Test the database connection settings" {

    execute {
        $testSaUser = Get-EnvSetting -setting "TEST_SA_USER"
        $testSaPassword = Get-EnvSetting -setting "TEST_SA_PASSWORD"
        $testDbHost = Get-EnvSetting -setting "TEST_DB_HOST"
        $testDbInstance = Get-EnvSetting -setting "TEST_DB_INSTANCE"
        $testDbName = "master"
        Test-SQLConnection -ConnectionString "Data Source=$testDbHost\$testDbInstance;database=$testDbName;User ID=$testSaUser;Password=$testSaPassword;"
    } ./database
    
}

Write-Host
Write-Host "This machine configured successfully to run Adopt-A-Highway" -ForegroundColor Green    
exit 0
