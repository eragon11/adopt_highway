#Requires -version 5

<#
.SYNOPSIS
    Ensure that the parameter matches expected targets that have tasks for which we build.
.DESCRIPTION
    Validates the parameter is in our list of supported build targets
#>
function validate-target([string] $target, [Parameter(ValueFromRemainingArguments)]$expectedTargets) {
    if ( ($expectedTargets -eq $null) -or (!$expectedTargets.Contains($target)) ) {
        throw "Invalid Target: $target`r`nValid Targets: $expectedTargets"
    }
}

<#
.SYNOPSIS
    Provides a simple help description for tasks
#>
function help($example, $description) {
    write-host
    write-host "$example" -foregroundcolor GREEN
    write-host "    $description"
}

<#
.SYNOPSIS
    Wrapper function for creating composable build tasks
.DESCRIPTION
    Allows you to create a block of code that is a unit of work for building. When path is passed, it will change locations into that path first and exit when complete.
#>
function task($heading, $command, $path) {
    write-host
    write-host $heading -fore CYAN
    execute $command $path
}

<#
.SYNOPSIS
    Executes a code block on a path
.DESCRIPTION
    Executes commands passed. Will first change to the path, when passed in. Throws any exception and then returns to the original location.
#>
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

function execute-task ($task, $mainBlock, $path) {

    $stopwatch = [System.Diagnostics.Stopwatch]::new()
    $stopwatch.Start()
    $seconds = $stopwatch.Elapsed.Seconds

    try {
        write-host
        write-host "$task starting..." -fore GREEN
        execute -command $mainBlock -path $path
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
    Wrapper function specifically created for including a set of commands to run our build
.DESCRIPTION
    Provides a try-catch block to look for any errors, runs the mainBlock, and then reports the result.
#>
function run-build($mainBlock) {
    try {
        &$mainBlock
        write-host
        write-host "Build Succeeded" -fore GREEN
        exit 0
    }
    catch [Exception] {
        write-host
        write-host $_.Exception.Message -fore RED
        write-host
        write-host "Build Failed" -fore RED
        exit 1
    }
}

<#
.SYNOPSIS
    Verifies that the .env file exists.
.DESCRIPTION
    Copies the example env file with default values when the .env file does not exist.
.EXAMPLE
    PS C:\> Test-EnvFile
    Copies the .env.example to .env when the .env file does not exist.
.NOTES
    It simply tests for existence. This function does not verify any settings, or content of the file. 
#>
function Test-EnvFile {
    $cwd = Join-Path (Resolve-Path $PWD) ".env"
    if ((Test-Path -Path $cwd )) {
        return
    }

    Write-Host "$cwd file is missing Run setup again to copy the .env.example file in that directory to create a .env file" - -foregroundcolor DarkRed
}

<#
.SYNOPSIS
    Verifies that all dependencies are present in order to build
.DESCRIPTION
    Checks for the existence of commands on the PATH and Node.JS packaged installed globally.
.NOTES
    Needs SQLCMD, Node.JS, NPM, Angular and Nest.JS CLI tools
#>
function Test-BuildMachineConfiguration {

    # check for Node JS version >= 14.16.0
    if (-not (Test-Command "node")) {
        throw "Adopt-A-Highway requires Node.JS  LTS (Long term support) version >= 14.16.0. (https://nodejs.org/dist/v14.16.1/node-v14.16.1-x64.msi)"
    }

    # check for sqlcmd for use in db migrations
    if (-not (Test-Command "sqlcmd")) {
        throw "Adopt-A-Highway requires Microsoft Command Line Utilities 15 for SQL Server (x64). (https://go.microsoft.com/fwlink/?linkid=2142258)"
    }

    # require NPM >= version 7.9.0 
    $npmVersion = npm -v
    if ($npmVersion -ne "7.9.0") {
        throw "Adopt-A-Highway requires NPM version >= 7.9.0. (npm install -g npm@^7.9.0)"
    }

    # check for Nest.JS CLI version >= 7.6.0
    if (-not (Test-Command "nest")) {
        throw "Adopt-A-Highway requires Nest.JS command line. (npm install -g @nestjs/cli@^7.6.0)"
    }

    # check for Angular CLI
    if (-not (Test-Command "ng")) {
        throw "Adopt-A-Highway requires Angular command line. (npm install -g @angular/cli@^11.2.8)"
    }

    $chromeVersion = [version](choco list googlechrome -lo)[1].Split(' ')[1]
    if (90 -ne $chromeVersion.Major) {
        throw "Adopt-A-Highway requires Google Chrome version 90+ for web testing."
    }
}

function Get-GitVersion {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $path
    )
    
    # Read the version file for our 
    $split = (Get-Content -Path $path).Trim()
    $results = $split | Select-String '\d\.\d\.\d[\-]{0,1}[\w]{0,30}' -AllMatches
    return $results.Matches.Value
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

<#
.SYNOPSIS
    Ensure that the database has all SQL schema and control changes to the latest version, with any needed data
.DESCRIPTION
    Migrates the SQL database defined in the .env file to the latest version.
.EXAMPLE
    PS C:\> Initialize-Database
    Creates the Adopt-A-Highway database if it does not exist, migrated the database to the latest version, and applies scripts to insert sample data if the NODE_ENVIRONMENT variable is local or development.
#>
function Initialize-Database {
    # Create the AdoptAHighway database and migrate as needed
    execute {
        Test-EnvFile
        $nodeEnv = ([string](Get-EnvSetting -setting "NODE_ENV")).ToLowerInvariant()        
        npm install
        npm run create:db
        npm run migrate:up:db
        if (@("local", "development").contains($nodeEnv)) {
            Write-Host "Loading any needed sample data for $nodeEnv environment"
            npm run sample-data    
        }
    } ./database
}

<#
.SYNOPSIS
    Initializes a project for the path provided.
.DESCRIPTION
    Initializes a project by running NPM install to load all dependencies, and then executing a build.
.EXAMPLE
    PS C:\> Initialize-Project -path .\web
    Moves the location to the path. Executes npm install. Executes npm run build. Then restores the original directory location.
.INPUTS
    path (required) is a filesystem path to the project to be initalized.
.NOTES
    The projects must use NPM for package management, and have a build task defined in package.json.
#>
function Initialize-Project {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $path
    )
    execute {
        Write-Host "Building $path..."
        Test-EnvFile
        npm install 
        npm run build
    } $path
}

<#
.SYNOPSIS
    Builds the Api project
.DESCRIPTION
    Performs the NPM install, builds and then runs tests for the API project
#>
function Initialize-Api {
    execute-task "Initialize-Api" {
        Write-Host "Building $path..."
        Test-EnvFile
        npm install 
        npm run build
    } ./apps/api
}

<#
.SYNOPSIS
    Builds the web project
.DESCRIPTION
    Performs the NPM install, builds and then runs tests for the web project
#>
function Initialize-Web {
    execute-task "Initialize-Web" {
        Write-Host "Building $path..."
        Test-EnvFile
        npm install 
        npm run build
    } ./apps/web
}

<#
.SYNOPSIS
    Creates ZIP archives for the database, web and api folders
.DESCRIPTION
    Zips up the web and API. Packages entire database directory for deployment.
.NOTES
    Requires that build is run, requires that .env exists
    Creates a staging folder $ENV:TEMP\tmp-aah-zip for the files used in the task.
#>

function publish-task {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [int]
        $buildNumber
    )

    # Remove any existing zips in the deploy directory
    Get-ChildItem -Path .\deploy -Filter "*.zip" | Remove-Item

    # Read the version file for our 
    $version = Get-GitVersion -path ./version.txt

    $tmp = "$($ENV:TEMP)\publish-aah-zip"
    Remove-Item $tmp -Recurse -Force -ErrorAction Ignore
    New-Item -Path $tmp -ItemType Directory -ErrorAction Ignore | Out-Null
    
    $zip = "aah.$($version).$('{0:d4}' -f $buildNumber).zip"

    $publishDir = Join-Path $PSScriptRoot "deploy"
    Write-Host "Creating the $publishDir directory"

    New-Item -Path $publishDir -ItemType Directory -ErrorAction Ignore | Out-Null
    Remove-Item "$publishDir/$zip" -Force -ErrorAction Ignore

    $apps = @("api", "web")
    foreach ($app in $apps) {
        execute {
            New-Item $tmp/$app -ItemType Directory -Force -ErrorAction Ignore | Out-Null
            Copy-Item -Path (Get-Item -Path ".\$app\*" -Exclude ('.env', 'node_modules')).FullName -Destination $tmp/$app -Recurse -Force
        } ./apps
    }    

    $apps = @("deploy", "database", "www")
    foreach ($app in $apps) {
        New-Item "$tmp/$app" -ItemType Directory -Force -ErrorAction Ignore | Out-Null
        Copy-Item -Path (Get-Item -Path ".\$app\*" -Exclude ('*.zip', '.env', 'node_modules')).FullName -Destination $tmp/$app -Recurse -Force
    }

    execute {
        Write-Host "Packaging files $zip..."
        Compress-Archive -Path .\* -Destination "$publishDir/$zip" -Force
    } $tmp

    Write-Host "Publish task complete" -ForegroundColor Green
}

<#
.SYNOPSIS
    Default task for build
.DESCRIPTION
    Gets the current NODE_ENV, rebuilds the test database, migrates the test database.
.EXAMPLE
    default-task
#>
function default-task {
    execute {
        Initialize-Api
        Initialize-Web
    }    
}

<#
.SYNOPSIS
    Rebuild task
.DESCRIPTION
    Gets the current NODE_ENV, drops and recreates dev and test databases, builds projects
.EXAMPLE
    default-task
#>
function rebuild-task {
    rebuild-local-database
    Initialize-Api
    Initialize-web
}

function build-only {
    execute-task "database: test for env file" { Test-EnvFile } ./database
    execute-task "database: npm install" { npm install } ./database
    execute-task "database: create aah database if needed" { npm run create:db } ./database
    execute-task "database: migrate aah database" { npm run migrate:up:db } ./database
    Initialize-Project -path "./apps/api"
    Initialize-Project -path "./apps/web"
}

function replace-envs {
    $apps = @("./database", "./apps/web", "./apps/api")
    foreach ($app in $apps) {
        Push-Location $app
        $env = Join-Path (Resolve-Path $PWD) ".env"
        $envExample = Join-Path (Resolve-Path $PWD) ".env.example"
        Copy-Item -Path $envExample -destination $env -Force
        Pop-Location
    }
}


<#
.SYNOPSIS
    Creates .env files when missing
.DESCRIPTION
    Uses a properties to populate all missing .env files
.NOTES
    This is executed during the ci build. Requires Azure DevOps to pass in a PSObject containing all required properties.
#>
function Create-Envs {
    param (
        [Parameter(Mandatory = $true)] 
        [string] 
        $nodeEnv,
        [Parameter(Mandatory = $true)]
        [string] 
        $apiTitle,
        [Parameter(Mandatory = $true)] 
        [string] 
        $apiDescription,
        [Parameter(Mandatory = $true)] 
        [string] 
        $apiPort,
        [Parameter(Mandatory = $true)]
        [string] 
        $apiAllowedOrigins,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbHost,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbPort,    
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbName,
        [Parameter(Mandatory = $true)]
        [string] 
        $appSaUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $appSaPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $apiEndpoint,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbHost,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbInstance,    
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbName,
        [Parameter(Mandatory = $true)]
        [string] 
        $testSaUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $testSaPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $jwtSecretKey
    )
    if (-Not (Test-Path ./database/.env)) {
        Write-Host "Creating a .env file for the database" -ForegroundColor Yellow
        @"
NODE_ENV=$nodeEnv
APP_DB_HOST=$appDbHost
APP_DB_NAME=$appDbName
APP_DB_USER=$appDbUser
APP_DB_PASSWORD=$appDbPassword
APP_DB_PORT=$appDbPort
APP_SA_USER=$appSaUser
APP_SA_PASSWORD=$appSaPassword
TEST_DB_HOST=$testDbHost
TEST_DB_NAME=$testDbName
TEST_DB_USER=$testDbUser
TEST_DB_PASSWORD=$testDbPassword
TEST_DB_INSTANCE=$testDbInstance
TEST_SA_USER=$testSaUser
TEST_SA_PASSWORD=$testSaPassword
"@ | Out-File -FilePath ./database/.env -Force -Encoding Default -ErrorAction Ignore | Out-Null
    }

    if (-Not (Test-Path ./apps/api/.env)) {
        Write-Host "Creating a .env file for the api" -ForegroundColor Yellow
        @"
NODE_ENV=$nodeEnv
API_TITLE=$apiTitle
API_DESCRIPTION=$apiDescription
API_PORT=$apiPort
API_ALLOWED_ORIGINS=$apiAllowedOrigins
APP_DB_HOST=$appDbHost
APP_DB_NAME=$appDbName
APP_DB_USER=$appDbUser
APP_DB_PASSWORD=$appDbPassword
APP_DB_PORT=$appDbPort
APP_SA_USER=$appSaUser
APP_SA_PASSWORD=$appSaPassword
SECRETKEY=$jwtSecretKey
EXPIRES_IN=3600s
LOG_SQL=true

"@ | Out-File -FilePath ./apps/api/.env -Force -Encoding Default -ErrorAction Ignore | Out-Null
    }
    
    if (-Not (Test-Path ./apps/web/.env)) {
        Write-Host "Creating a .env file for the web" -ForegroundColor Yellow
        @"
NODE_ENV=$script:nodeEnv        
"@ | Out-File -FilePath ./apps/web/.env -Force -Encoding Default -ErrorAction Ignore | Out-Null
    }    
}

<#
.SYNOPSIS
    Builds task for continuous integration
.DESCRIPTION
    Performs checks for required software, creates test database, runs builds, then creates zip archives of the results.
#>
function ci-task {
    param (
        [Parameter(Mandatory = $true)] 
        [string] 
        $buildNumber,
        [Parameter(Mandatory = $true)] 
        [string] 
        $nodeEnv,
        [Parameter(Mandatory = $true)]
        [string] 
        $apiTitle,
        [Parameter(Mandatory = $true)] 
        [string] 
        $apiDescription,
        [Parameter(Mandatory = $true)] 
        [string] 
        $apiPort,
        [Parameter(Mandatory = $true)]
        [string] 
        $apiAllowedOrigins,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbHost,
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbPort,    
        [Parameter(Mandatory = $true)]
        [string] 
        $appDbName,
        [Parameter(Mandatory = $true)]
        [string] 
        $appSaUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $appSaPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbPassword,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbHost,
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbInstance,        
        [Parameter(Mandatory = $true)]
        [string] 
        $testDbName,
        [Parameter(Mandatory = $true)]
        [string] 
        $testSaUser,
        [Parameter(Mandatory = $true)]
        [string] 
        $testSaPassword,        
        [Parameter(Mandatory = $true)]
        [string] 
        $apiEndpoint,
        [Parameter(Mandatory = $true)]
        [string] 
        $jwtSecretKey
    )

    $buildprops = @{
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

    execute-task "ci-task" {
        Create-Envs @buildprops
        Initialize-Api
        Initialize-Web
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

function Test-NpmPackage {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $PackageName
    )

    $result = (npm list -g $PackageName --depth 0 | findstr $PackageName)

    if ($result) {
        return $true
    }

    return $false
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

function set-role {
    [CmdletBinding()]
    param (
        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [string]
        $userName,
        [Parameter()][ValidateSet('Administrator', 'District Coordinator', 'Maintenance Coordinator')]
        [string]
        $roleType,
        [Parameter()]
        [string]
        $roleLocation
    )
    # Create SQL to remove a user from a role
    $removeRolesSql = @"
DELETE r 
FROM aah.[ROLE] r
INNER JOIN aah.[USER_PERSON] u on r.[USER_ID] = u.[USER_ID] 
WHERE u.[USERNAME] = '$userName'
"@

    $addRoleSql = @"
    exec aah.AddRoleToUser @username='$userName', @roleType='$roleType', @locationName='$roleLocation'
"@
    execute-task "Remove existing roles for $userName" { osql -s localhost -E -Q $removeRolesSql -r -d aah } .
    execute-task "Add role for $userName as $roleType" { osql -s localhost -E -Q $addRoleSql -r -d aah } .
}

function rebuild-local-database {
    execute-task "Rebuild the local database" {
        execute-task "database: .env file" { Test-EnvFile } .
        execute-task "database: npm install" { npm install } .
        execute-task "database: create local aah database" { npm run drop:create:local } .
        execute-task "database: create local GIS" { npm run create:gis:local } .
        execute-task "database: insert local GIS" { npm run insert:gis:local } .
        execute-task "database: migrate aah database" { npm run migrate:up:db } .
        execute-task "database: add sample data for aah" { npm run sample-data } .
        execute-task "database: migrate legacy database" { npm run migrate:legacy:db } .
    } .\database
}

$functions = @(
    "validate-target",
    "help",
    "task",
    "execute",
    "execute-task",
    "run-build",
    "Test-EnvFile",
    "Get-EnvSetting",
    "publish-task",
    "Create-Envs",
    "ci-task",
    "default-task",
    "rebuild-task",
    "build-only",
    "Test-Command",
    "Test-NpmPackage",
    "Test-SQLConnection",
    "Test-BuildMachineConfiguration",
    "replace-envs",
    "set-role",
    "rebuild-local-database"
)

Export-ModuleMember $functions
