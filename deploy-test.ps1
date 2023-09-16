$properties = @{
    "installDir"        = "c:\aah";
    "nodeEnv"           = "development";
    "buildNumber"       = 1;
    "apiTitle"          = "TEXAS DOT TEST ADOPT-A-HIGHWAY REST API";
    "apiDescription"    = "API SERVICE FOR ADOPT-A-HIGHWAY WEB APPLICATION (TEST)";    
    "apiPort"           = "3000";
    "apiAllowedOrigins" = "https://localhost";
    "appDbUser"         = "aahUser";
    "appDbPassword"     = "aahuser123!";
    "appDbHost"         = "localhost";
    "appDbPort"         = 1433;
    "appDbName"         = "aah";
    "appSaUser"         = "aah";
    "appSaLogin"        = "aah_dataowner_local";
    "appSaPassword"     = "P@55w0rd!";
    "webSiteDir"        = "c:\inetpub\wwwroot";
    "hostSiteUrl"       = "localhost";
    "apiEndpoint"       = "localhost:3000";
    "testDbUser"        = "aahUser";
    "testDbPassword"    = "aahuser123!";
    "testDbHost"        = ".";
    "testDbInstance"    = "SQLEXPRESS";
    "testDbName"        = "aah_test";
    "testSaUser"        = "sa";
    "testSaPassword"    = "P@55w0rd!";
    "jwtSecretKey"      = "jWt5ecret123";
    "appDbSchema"       = "aah";
    "version"           = "0.1.0-dev";
}

.\build.ps1 ci @properties
.\build.ps1 publish
Clear-Host

# Simulate an Azure DevOps step that expands the publish artifact on the target machine
$stagingDir = "$env:temp\staging-aah-zip"
Remove-Item -path $properties.installDir -Recurse -Force -ErrorAction Ignore
Remove-Item -path $stagingDir -Recurse -Force -ErrorAction Ignore
Remove-Item -path $properties.webSiteDir -Recurse -Force -ErrorAction Ignore
$split = (Get-Content -Path .\version.txt).Trim()
$version = $split | Select-String '\d\.\d\.\d[\-]{0,1}[\w]{0,30}' -AllMatches
$zip = "aah.$($version).$('{0:d4}' -f $properties.buildNumber).zip"
Expand-Archive -Path ".\deploy\$zip" -DestinationPath $stagingDir -Force -ErrorAction Ignore


Import-Module .\deploy\install.psm1 -DisableNameChecking -Force

# On the target machine and inside the target folder, change to the ./deploy folder to run the install
Push-Location "$stagingDir\deploy"

# Install Adopt-A-Highway

$deployProperties = @{
    "stagingDir" = $stagingDir
}

Get-AahWinSW @deployProperties

$deployProperties = @{
    "stagingDir" = $stagingDir
    "installDir" = $properties.installDir
}

Copy-AahFiles @deployProperties

$deployProperties = @{
    "stagingDir"  = $stagingDir
    "webSiteDir"  = $properties.webSiteDir
    "hostSiteUrl" = $properties.hostSiteUrl
    "apiEndpoint" = $properties.apiEndpoint
}

New-AahWebConfig @deployProperties

$deployProperties = @{
    "installDir"    = $properties.installDir
    "nodeEnv"       = $properties.nodeEnv
    "appDbUser"     = $properties.appDbUser
    "appDbPassword" = $properties.appDbPassword
    "appDbHost"     = $properties.appDbHost
    "appDbPort"     = $properties.appDbPort
    "appDbName"     = $properties.appDbName
    "appSaUser"     = $properties.appSaUser
    "appSaLogin"    = $properties.appSaLogin
    "appSaPassword" = $properties.appSaPassword
}

Install-AahDatabase @deployProperties

$deployProperties = @{
    "installDir"             = $properties.installDir
    "nodeEnv"                = $properties.nodeEnv
}

Install-AahApi @deployProperties

$deployProperties = @{
    "installDir" = $properties.installDir
    "stagingDir" = $stagingDir
}

Install-ApiWinService @deployProperties

$deployProperties = @{
    "stagingDir" = $stagingDir
    "nodeEnv"    = $properties.nodeEnv
    "webSiteDir" = $properties.webSiteDir
}

Install-AahWeb @deployProperties
Pop-Location
