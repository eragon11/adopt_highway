# TxDOT Adopt-A-Highway

## Summary

TxDOT Adopt-A-Highway application.

## Build Status of development branch

[![Build Status](https://txdot.visualstudio.com/Adopt_A_Highway/_apis/build/status/AAH_Build_Pipeline?branchName=development)](https://txdot.visualstudio.com/Adopt_A_Highway/_build/latest?definitionId=329&branchName=development)

## Deployment Status

[![Deployment Status](https://txdot.vsrm.visualstudio.com/_apis/public/Release/badge/e3880fe0-9f72-4fa1-a3c4-a31532e701e7/1/1)](https://txdot.vsrm.visualstudio.com/_apis/public/Release/badge/e3880fe0-9f72-4fa1-a3c4-a31532e701e7/1/1)

## Prerequisites

- .env file - copied from .env.example, settings changed to match your local instance's port, `sa` user and their password
- SQL Server Developer Edition, mixed mode authentication (Windows and SQL Server, sa user configured with password to match the .env file)
- Administrator access and Execution Policy for RemoteSigned (process scope, at least), to allow for running of PowerShell scripts.
- Node.JS (LTS) - Javscript Platform software install (this will be installed, if missing)
- JSHint - NPM package for code quality at the project level (this will be installed, if missing)
- Google Chrome v90.0.4430.93 for Selenium WebDriver to run web tests

## Quick Start for development

- Make sure you have copied the .env.example and renamed it to .env. As in the following...

```powershell
Copy-Item -Path .\.env.example -Destination .\.env
```

- Launch a PowerShell console in administration mode. Minimum version is 5.
- Change the execution policy to allow running scripts for the current user.

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Confirm
```

- Run `setup.ps1` to verify dependencies. You should receive a confirmation when the machine is configured correctly.

```powershell
> .\setup.ps1
Checking for required software to run AdoptAHighway
This machine configured successfully to run Adopt-A-Highway
```

- Execute start-dev.ps1. This script will build the projects, create a local sandbox and test database, migrate and provide data for both databases, and start the web and api.

## setup.ps1

`setup.ps1` will install missing dependencies that are needed for Adopt-A-Highway to run successfully.

> IMPORTANT: You should have SQL Server installed with mixed mode authentication, and the SA user should have a password recorded in the .env file.

The following are required:
.env file with settings for your local instance of SQL Server hostname (localhost), port (1433), `sa` user and password
Node LTS Latest, to provide Node.JS and NPM
JSHint for code quality hints during development

## build.ps1

`build.ps1` is a PowerShell script that provides build tasks for local developer workflows and for CI\CD, DevOps processes. A `build-helpers.ps1` file provides helper functions for creating tasks.
To execute, call the build script and pass one of the defined build tasks

### Build tasks

Build tasks are defined in the `build.ps1` via the run-build script-block. The `target` command-line parameter is evaluated and the matching task is executed.

On Azure DevOp build pipelines, you will want to script a PSObject to pass in pipeline variables. These can then be passed to the ci as an argument.

```powershell
$properties = @{
    "target" = "default",
    "buildNumber" = "1234",
    "nodeEnv" = "development";
    "apiTitle" = "TEXAS DOT TEST ADOPT-A-HIGHWAY REST API";
    "apiDescription" = "API SERVICE FOR ADOPT-A-HIGHWAY WEB APPLICATION (TEST)";
    "apiPort" = "3000";
    "apiAllowedOrigins" = "http://localhost:4200";
    "appDbUser" = "aahUser";
    "appDbPassword" = "Y0u4p@55w0rd";
    "appDbHost" = "localhost";
    "appDbPort" = 1433;
    "appDbName" = "aah";
    "appSaUser" = "sa";
    "appSaPassword" = "5omePas5w0rd";
    "apiEndpoint" = "localhost:3000";
}

.\build.ps1 ci @properties
```

## Defined build tasks

- help - provides description of available tasks
- default - drop and re-creates the test database. Builds the API and WEB projects

| task            | description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| build (default) | Optimized for local development                                               |
| rebuild         | Recreates database and builds projects                                        |
| rebuildlocal    | Recreates local database                                                      |
| publish         | Creates build artifact zip archive (without building first)                   |
| ci              | Creates a build for DevOps build an deployment pipeline (REQUIRES PROPERTIES) |
| build-only      | Runs builds without tests                                                     |
| new-envs        | Replaces .env files with example.env files for all projects                   |
| set-role        | Replaces all existing roles for @roletype at @location for @username          |
