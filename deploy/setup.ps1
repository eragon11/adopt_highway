#Requires -Version 5.1
#Requires -RunAsAdministrator

function Test-Command {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $CommandName
    )
    return (Get-Command $CommandName -ErrorAction Ignore)
}

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

Write-Host "Checking deployment target for required software to run AdoptAHighway" -ForegroundColor Cyan

# install chocolatey
if (-not (Test-Command "choco")) {
    Write-Host "Installing Chocolatey"
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))    
    refreshenv
}

# Install dotnetcore for winsw, and for using System.Version
choco install dotnetcore --version=3.1.15 -y --allow-downgrade

# install Node JS
if (-not (Test-Command "node")) {
    choco install nodejs-lts -y --ignore-detected-reboot
    refreshenv
}

# install sqlcmd for use in db migrations
if (-not (Test-Command "sqlcmd")) {
    choco install sqlserver-cmdlineutils -y
    refreshenv
}

if (-not (Test-Command "copyfiles")) {
    npm install -g copyfiles
}

# Install Google Chrome v90.0.4430.93; forced ignore checksums to get proper version
choco install googlechrome --version=90.0.4430.93 -y --allow-downgrade --ignore-checksums

# MS IIS Web Platform Installer helps maintain IIS components
choco install webpi -y

# Application Request Routing 3.0 allows us to re-route incoming requests to the API
choco install iis-arr -y 

# URL Rewrite allows us to write 
choco install urlrewrite -y

Write-Host "This machine configured successfully to run Adopt-A-Highway" -ForegroundColor Green    
exit 0
