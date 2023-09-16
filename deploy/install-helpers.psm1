#Requires -version 5

function execute-task ($task, $mainBlock) {

    $stopwatch = [System.Diagnostics.Stopwatch]::new()
    $stopwatch.Start()
    $seconds = $stopwatch.Elapsed.Seconds

    try {
        write-host
        write-host "$task starting..." -fore GREEN
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
        throw "$task failed"
    }
    finally {
        $stopwatch.Stop()
        $stopwatch = $null
    }
}

<#
.SYNOPSIS
    Parses a zip archive's file name from a given URL
.DESCRIPTION
    Returns the zip's file name from within a URL
.EXAMPLE
    PS C:\> Get-ZipFromUrl https://example.org/test.zip

    test.zip

    Returns the file name from the URL
.INPUTS
    Url is required
.OUTPUTS
    Returns the name of the zip without the extension of zip.
.NOTES
    General notes
#>
function Get-ZipFromUrl {
    param(
        [string]
        $Url
    )

    execute-task "Get-ZipFromUrl" {
        if (($Url -match "([a-zA-Z0-9\.\-]+)\.zip")) {
            return $Matches[1];
        }
      
        throw "Unable to parse zip name from $Url"
    }    
}

<#
.SYNOPSIS
    Downloads a helper app as a zip file
.DESCRIPTION
    Downloads a file from the URL passed in
.INPUTS
    Url - The Uri to the zip for downloading
    installPath - 
#>
function Get-App {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]
        $Url,
        [Parameter(Mandatory = $true)]
        [string]
        $installPath
    )

    execute-task "Get-App" {
        $version = Get-ZipFromUrl -Url $Url
  
        if (-not (Test-Path -Path "$installPath")) {
            $outFile = "$env:TEMP\$version.zip"
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-WebRequest -Uri $Url -OutFile $outFile
            Expand-Archive -Path $outFile -Destination $installPath -Force -ErrorAction Ignore      
        }
        Write-Host "Winsw already downloaded for $installPath"      
        return
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

function Update-File {
    param(
        [string] $appPath,
        [Hashtable] $replacements
    )
    $fileContents = Get-Content -Path "$appPath" -Encoding UTF8

    # Update file contents with all replacements hash table
    $replacements.Keys | ForEach-Object {
        $fileContents = $fileContents.Replace($_, $replacements.Item($_))
    }

    $fileContents | Set-Content "$appPath"
}

<#
.SYNOPSIS
    Update the web.config with new rewrite rules
.DESCRIPTION
    Copy the www/web.config to c:/inetpub/wwwroot and overwrite the existing file. 
     The web.config contains the URL Rewrite Rules required to redirect incoming requests on port 443 to the proper application. 
     We are using a single web site and configuration file to handle all incoming requests to this server.  
     It becomes problematic to support multiple internal redirect applications from different web sites on IIS. 
.INPUTS
    webSiteDir - path to the hosting web site
    apiEndPoint - URL endpoint for the Adopt-A-Highway API 
    hostSiteUrl - URL for Adopt-A-Highway host site
#>
function Update-WebConfig {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $stagingDir,
        [Parameter(Mandatory = $true)]
        [string]
        $apiEndpoint,
        [Parameter(Mandatory = $true)]
        [string]
        $hostSiteUrl,
        [Parameter(Mandatory = $true)]
        [string]
        $webSiteDir
    )

    execute-task "Update-WebConfig" {
        # Replace the tokens in the web.config with this environment specific variables        
        $replacements = @{
            "__API_ENDPOINT__"  = $apiEndpoint
            "__HOST_SITE_URL__" = $hostSiteUrl
        }
    
        # Move the web.config
        New-Item $webSiteDir -ItemType Directory -Force  -ErrorAction Ignore | Out-Null
        Move-Item -Path "$stagingDir\www\web.config" -Destination $webSiteDir -Force -ErrorAction SilentlyContinue
        Update-File -appPath "$webSiteDir\web.config" -replacements $replacements
        Pop-Location
    }
}

<#
.SYNOPSIS
    Prepare the target install directory where Adopt-A-Highway is to be installed
.DESCRIPTION
    Clears out all files in the target install directory.
.INPUTS
    installDir - the install directory
#>
function Prepare-InstallDir {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $installDir
    )
    execute-task "Prepare-InstallDir" {
        # Ensure the target install directory is empty and ready for new files
        # Create the target deployment directory with force and ignore the error action.
        New-Item $installDir -ItemType Directory -Force -ErrorAction Ignore | Out-Null
        Push-Location $installDir
    
        # Remove any existing files in the D:\apps\ sub-directories – database, api, and web. 
        if (([string](Get-Location)).ToLowerInvariant() -ne (Resolve-Path $installDir.ToLowerInvariant())) {
            throw "Failed to change location to $installDir"
        }
        
        # Clear out any exiting files
        Remove-Item -Path $installDir -Recurse -Force -ErrorAction Ignore | Out-Null
        Pop-Location
    }
}

function Install-NodeService {
    [CmdletBinding()]
    param (
        [string] $stagingDir,
        [string] $installDir,
        [string] $serviceId,
        [string] $serviceName,
        [string] $serviceDescription,
        [string] $serviceEnv,
        [string] $serviceExeCommand,
        [string] $serviceExeArgs,
        [string] $workingDir
    )

    execute-task "Install Node-Service" {
        # If service already exists, stop and remove it so that new settings
        # will be applied.
        $exists = Get-Service -Name $serviceId -ErrorAction SilentlyContinue

        if ($exists) {
            Stop-Service -Name $serviceId -ErrorAction SilentlyContinue
            &sc.exe delete $serviceId
        }

        $serviceInstallPath = "$installDir\$serviceId"
        $logPath            = "$serviceInstallPath\logs"

        New-Item -Path $serviceInstallPath -ItemType Directory -Force -ErrorAction Ignore | Out-Null
        New-Item -Path $logPath -ItemType Directory -Force -ErrorAction Ignore | Out-Null
        Copy-Item -Path "$stagingDir\winsw\*" -Destination $serviceInstallPath -Recurse -Force

        $winServiceExe = "$stagingDir\winsw\WinSW.exe"
        $serviceExe = "$serviceInstallPath\$serviceId.exe"
        Copy-Item -Path $winServiceExe -Destination "$serviceExe" -Force

        # Copy the config XML file to install directory
        $xmlFile = "$serviceInstallPath\$serviceId.xml"
   
        @"
<service>
    <id>$serviceId</id>
    <name>$serviceName</name>
    <description>$serviceDescription</description>
    <workingdirectory>$workingDir</workingdirectory>
    <executable>$serviceExeCommand</executable>
    <arguments>$serviceExeArgs</arguments>
    <logpath>$installDir\$serviceId\logs</logpath>
    <onfailure action="restart" delay="10 sec"/>
    <resetfailure>1 hour</resetfailure>
    <logmode>rotate</logmode>
</service>
"@ | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

        # Create and start the service
        &$serviceExe install
        &$serviceExe start    
    }
}

$functions = @(
    "execute-task",
    "Get-ZipFromUrl",
    "Get-App",
    "Test-Command",
    "Test-DeployMachineConfiguration",
    "Update-File",
    "Update-WebConfig",
    "Prepare-InstallDir",
    "Install-NodeService"
)    

Export-ModuleMember $functions