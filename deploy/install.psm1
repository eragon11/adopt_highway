Import-Module $PSScriptRoot\install-helpers.psm1 -Force -DisableNameChecking

<#
.SYNOPSIS
    Installs the database
.DESCRIPTION
    In the D:\apps\database directory, perform the following actions:  
    Create a new .env file with update variables for this environment. 
    The NODE_ENV variable should be production for pre-prod and prod environments. 
    Execute the npm run migrate:up:db task to migrate the database to the latest version. 
    Confirm that we have a successful exit code, throw an error if not. 
.INPUTS
    Inputs (if any)
.NOTES
    General notes
#>
function Install-AahDatabase {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $installDir = $(throw "installDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $nodeEnv = $(throw "nodeEnv value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appDbHost = $(throw "appDbHost value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appDbName = $(throw "appDbName value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appDbUser = $(throw "appDbUser value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appDbPassword = $(throw "appDbPassword value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appDbPort = $(throw "appDbPort value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appSaLogin = $(throw "appSaLogin value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appSaUser = $(throw "appSaUser value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $appSaPassword = $(throw "appSaPassword value was missing, please provide a value"),
        [Parameter(
            ValueFromRemainingArguments = $true
        )]
        [Object[]]$MyArgs
    )

    # In the D:\apps\database directory, perform the following actions:  
    #     Create a new .env file with update variables for this environment. 
    #     The NODE_ENV variable should be production for pre-prod and prod environments. 
    #     execute the npm run migrate:up:db task to migrate the database to the latest version. 
    #     Confirm that we have a successful exit code, throw an error if not. 
    execute-task "Install-Database" {
        if (-not (Test-Path $installDir\database)) {
            throw "$installDir is not a valid path"
        }
        Push-Location $installDir\database
        @"
NODE_ENV=$nodeEnv
DB_SCHEMA=$appDbSchema
APP_DB_HOST=$appDbHost
APP_DB_NAME=$appDbName
APP_DB_USER=$appDbUser
APP_DB_PASSWORD=$appDbPassword
APP_DB_PORT=$appDbPort
APP_SA_USER=$appSaUser
APP_SA_PASSWORD=$appSaPassword
APP_SA_LOGIN=$appSaLogin
"@ | Out-File -FilePath ./.env -Force -Encoding Default -ErrorAction Ignore | Out-Null
        Write-Host "Installing database..." -ForegroundColor Cyan
        npm ci --production --silent
        npm run migrate:up:db

        if ((@("local", "development").Contains($nodeEnv))) {
            execute-task "Inserting sample data for $nodeEnv environment" {
                npm run sample-data
            }
        }

        Pop-Location
    }
}

<#
.SYNOPSIS
    Short description
.DESCRIPTION
    In the D:\apps\api directory, perform the following actions: 
    Create a new .env file with update variables for this environment. 
    The NODE_ENV variable should be production for pre-prod and prod environments 
    Execute npm ci to install all Node libraries. 
    Stop and remove the current AAH API service – aah_api_svc. 
    Create a copy of our Windows Service Wrapper executable, and move it to the new name of aah_api_svc.exe and save in the D:\apps\api\service folder. 
    Copy the api\deploy\service\aah_api_svc.xml file to the D:\apps\api\service folder 
    The XML file contains the Node.JS command that starts the application. 
    In D:\apps\api\service 
        Execute aah_api_svc.exe install to install the new service. 
        Execute aah_api_svc.exe install to start the service. 
        Confirm that the aah_api_svc.exe status remains running. 
.INPUTS
    
#>
function Install-AahApi {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $installDir = $(throw "installDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $nodeEnv = $(throw "nodeEnv value was missing, please provide a value"),
        [Object[]]$MyArgs
    )
    execute-task "Install-Api" {
        Push-Location $installDir\api

        Write-Host "Stopping the aah-api service..." -ForegroundColor Cyan
        Stop-Service aah-api -ErrorAction SilentlyContinue

        Write-Host "Installing Adopt-A-Highway API..." -ForegroundColor Cyan
        Copy-Item -Path ".\.env.production" -Destination ".env"
        npm ci
        npm run build
        Pop-Location
    }    
}

<#
.SYNOPSIS
    Installs the Adopt-A-Highway web application as a static web on IIS.
.DESCRIPTION
 This build enables the web to be executed statically from MS IIS.
 Runs npm ci and build in the staging directory.
 Copies all dist folder contents to the webSiteDir.
 Creates a .ENV file in the websiteDir directory.
#>
function Install-AahWeb {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $stagingDir = $(throw "stagingDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $webSiteDir = $(throw "webSiteDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $nodeEnv = $(throw "nodeEnv value was missing, please provide a value"),
        [Parameter(
            ValueFromRemainingArguments = $true
        )]
        [Object[]]$MyArgs
    )

    execute-task "Install-Web" {
        Write-Host "Installing Adopt-A-Highway Web..." -ForegroundColor Cyan
        Push-Location "$stagingDir\web"
        ng analytics off
        npm ci
        npm run build:prod
        Copy-Item -Path "$stagingDir/web/dist/*" -Destination "$webSiteDir" -Recurse -Force -ErrorAction Ignore
        # Apply parent permissions to all new files
        $acl = Get-Acl "$webSiteDir"
        $acl.SetAccessRuleProtection($true, $true)
        $acl | Set-Acl "$webSiteDir"
        @"
        NODE_ENV=$nodeEnv
"@  | Out-File -FilePath "$webSiteDir/.env" -Force -Encoding Default -ErrorAction Ignore | Out-Null        
        Pop-Location
    }    
}

<#
.SYNOPSIS
    Installs the Windows Service Host Wrapper (winsw)
.DESCRIPTION
    The REST API is a Node.JS application hosted in a Windows Service. 
    This function downloads the specific version of the winsw.exe to a staging directory where it can be installed later.
    It DOES NOT install or start the windows service. Files are later copied over to the install directory and installed there.
.INPUTS
    stagingDir is the location to where the zip is downloaded
.NOTES
    This is a function that can be executed on Azure DevOps manually
#>
function Get-AahWinSw {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $stagingDir = $(throw "stagingDir value was missing, please provide a value")
    )
    execute-task "Get-WinSw" {
        # Download winsw to temp location $ENV:TEMP\winsw
        Get-App -Url "https://github.com/winsw/winsw/releases/download/v2.10.3/WinSW.NETCore31.zip" -installPath "$stagingDir/winsw"
    }
}

function Copy-AahFiles {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $installDir = $(throw "installDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $stagingDir = $(throw "stagingDir value was missing, please provide a value")
    )
    
    Prepare-InstallDir -installDir $installDir
            
    # Copy expanded files to $installDir
    Copy-Item -Path $stagingDir\* -Destination $installDir -Recurse -Force
}

function New-AahWebConfig {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $stagingDir = $(throw "stagingDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $apiEndpoint = $(throw "apiEndpoint value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $hostSiteUrl = $(throw "hostSiteUrl value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $webSiteDir = $(throw "webSiteDir value was missing, please provide a value")
    )
    $uwcProperties = @{
        "apiEndpoint" = $apiEndpoint;
        "hostSiteUrl" = $hostSiteUrl;
        "webSiteDir"  = $webSiteDir;
        "stagingDir"  = $stagingDir;
    }

    Update-WebConfig @uwcProperties
}

function Install-ApiWinService {
    [CmdletBinding()]
    param (
        [Parameter()][ValidateNotNullOrEmpty()][string] $stagingDir = $(throw "stagingDir value was missing, please provide a value"),
        [Parameter()][ValidateNotNullOrEmpty()][string] $installDir = $(throw "installDir value was missing, please provide a value")
    )
    $serviceExeCommand = "dist/src/main"
    $nsProperties = @{
        "stagingDir"         = $stagingDir;
        "installDir"         = $installDir;
        "serviceId"          = "aah-api";
        "serviceName"        = "Adopt-A-Highway API";
        "serviceDescription" = "Node.JS Service Executable that runs Adopt-A-Highway REST API";
        "serviceEnv"         = "";
        "serviceExeCommand"  = "node";
        "serviceExeArgs"     = "$serviceExeCommand";
        "workingDir"         = "$installDir/api";
    }
    Install-NodeService @nsProperties
}

$functions = @(
    "Install-AahDatabase",
    "Install-AahApi",
    "Install-AahWeb",
    "Get-AahWinSw",
    "Copy-AahFiles",
    "New-AahWebConfig",
    "Install-ApiWinService"
)    

Export-ModuleMember $functions
