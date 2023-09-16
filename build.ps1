param(
    $target = "default", 
    $buildNumber = 1,
    $nodeEnv = "local",
    $apiTitle = "TXDOT Adopt A Highway REST API",
    $apiDescription = "REST Service for data access",
    $apiPort = 3000,
    $apiAllowedOrigins = "*",
    $appDbUser = "aahuser",
    $appDbPassword = "aahuser123!",
    $appDbHost = "localhost\SQLEXPRESS",
    $appDbPort = 1433,    
    $appDbName = "aah",
    $appSaUser = "aahadmin",
    $appSaPassword = "P@55w0rd!",
    $testDbUser = "aahuser",
    $testDbPassword = "aahuser123!",
    $testDbHost = "localhost",
    $testDbInstance = "SQLEXPRESS",    
    $testDbName = "aah_test",
    $testSaUser = "aahadmin",
    $testSaPassword = "P@55w0rd!",    
    $apiEndpoint = "localhost:3000",
    $jwtSecretKey = "jWt5ecret123",
    $userName = $null,
    $roleType = $null,
    $roleLocation = $null
)

Import-Module "$PSScriptRoot/build-helpers.psm1" -Force  -DisableNameChecking

<#
.SYNOPSIS
    Builds Adopt-A-Highway.
.DESCRIPTION
    Ensures the default settings for .env exist. Theb, creates and builds the Adopt-A-Highway database.
    If the NODE_ENV is production, it skips creating a test database, and it skips creating sample data.
    It builds the API and WEB applications using the Initialize-Project command.
    Initialize-Project command executes npm install, then runs the build task.
.NOTES
    General notes
#>

$ErrorActionPreference = "Stop"

$buildprops = @{
    "buildNumber"       = $buildNumber
    "nodeEnv"           = $nodeEnv;
    "apiTitle"          = $apiTitle;
    "apiDescription"    = $apiDescription;
    "apiPort"           = $apiPort;
    "apiAllowedOrigins" = $apiAllowedOrigins;
    "appDbUser"         = $appDbUser;
    "appDbPassword"     = $appDbPassword;
    "appDbHost"         = $appDbHost;
    "appDbPort"         = $appDbPort;    
    "appDbName"         = $appDbName;
    "appSaUser"         = $appSaUser;
    "appSaPassword"     = $appSaPassword;
    "testDbUser"        = $testDbUser;
    "testDbPassword"    = $testDbPassword;
    "testDbHost"        = $testDbHost;
    "testDbInstance"    = $testDbInstance;
    "testDbName"        = $testDbName;
    "testSaUser"        = $testSaUser;
    "testSaPassword"    = $testSaPassword;    
    "apiEndpoint"       = $apiEndpoint;
    "jwtSecretKey"      = $jwtSecretKey;
}

run-build {
    validate-target $target "build" "help" "default" "rebuild" "ci" "publish" "build-only" "new-envs" "set-role" "rebuildlocal"

    if ($target -eq "help") {
        help "build (default)" "Optimized for local development"
        help "rebuild" "Recreates database and builds projects"
        help "publish" "Creates build artifact zip archive (without building first)"
        help "ci" "Creates a build for DevOps build an deployment pipeline (REQUIRES PROPERTIES)"
        help "build-only" "Runs builds without tests"
        help "new-envs" "Replaces .env files with example.env files for all projects"
        help "set-role" "Replaces all existing roles for @roletype at @location for @username"
        help "rebuildlocal" "Recreates the local database"
        return
    }
        
    if ($target -eq "ci") {
        task "Continuous integration build for DevOps" {  
            ci-task @buildprops 
            return
        } .
    }

    if (@("default", "build").contains($target)) {
        task "Migrate dev database to latest, rebuild test database with sample data, build api and web, and test" {  
            default-task
            return
        } .
    }    
    
    if ($target -eq "rebuild") {
        task "Replaces env files with current example.env, drops and re-creates dev and test databases, applies sample data to test database, builds api and web and tests" {  
            replace-envs
            rebuild-task
            return
        } .
    }
    
    if ($target -eq "publish") {
        task "Create a publish artifact for testing" {  
            publish-task -buildNumber $buildNumber
            return
        } .
    }    
    
    if ($target -eq "build-only") {
        task "Runs builds without tests" {  
            build-only
            return
        } .
    }    

    if ($target -eq "new-envs") {
        task "Creates new environment files" {
            replace-envs
            return
        } .
    }

    if ($target -eq "set-role") {
        execute-task "Assigns single role for user" {
            set-role -userName $userName -roleType $roleType -roleLocation $roleLocation
            return
        } .
    }
    if ($target -eq "rebuildlocal") {
        task "Rebuild local database" {  
            rebuild-local-database @buildprops 
            return
        } .
    }
}

