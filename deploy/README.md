# Azure DevOps Release Pipeline Release Deployment

## Overview

`deploy` contains PowerShell modules for installing Adopt-A-Highway on a deployment target machine.

## Assumptions

- The install.ps1 script will be used in a Release pipeline PowerShell task.
- The command that invokes install.ps1 will receive all parameters defined in the Release pipeline
- The SQL Server database is currently defined with SQL Authentication and has a sysadmin level user defined.
- The deployment will occur immediately after build has completed.
- The build is expected to be triggered by a merge to the development branch.
- Production builds are expected to occur by a manual process.
- Environments are assumed to be development, QA, pre-prod, and production.
- Target Machine will refer to the deployment target in the current environment.
- The target is assumed to be configured manually and ready for deployment with all dependencies resolved.

## Deploy Agent Variables for Release Pipeline

The following are the environment variables to create for the Release pipeline.

- INSTALL_DIR
  - Default value is $ENV:TEMP\aah
  - The directory into which the zip archive was expanded.
- TARGET_INSTALL_DIR
  - Default value is D:\aah
  - The directory to create on the deployment machine into which the expanded archive is copied.
- NODE_ENV
  - IMPORTANT: This value is used to determine when to drop and create the application database schema “development” for only the development/integration and QA environments where testing will occur. We will want to insert test data and re-create the database chema on each deployment. “production” for pre-prod and prod environments. We only want to migrate the schemas forward to the latest version.
- API_TITLE
  - Default value should be “TX DOT Adopt-A-Highway API”
  - Used by Swagger in the API to set the title of the API home page
- API_DESCRIPTION
  - Default value is “Provides data access for the TxDOT Adopt-A-Highway application”
  - Used by Swagger in the API to set the description on the API home page
- API_PORT
  - Default value is 3000
  - Local port for the API. Should match the route used on the Default Web Site’s web.config for the API_ENDPOINT.
- API_ALLOWED_ORIGINS
  - This is for the CORS Origin Policy. Lists the accepted origins for incoming requests.
  - Should match the localhost and port for the WEB_ENDPOINT.
- TEST_DB_NAME
  - Default value is AdoptAHighwayTest
  - Name of the SQL Server database created for test.
- APP_DB_USER
  - Default value is aahuser
  - SQL Server account used for database connections. Has the role of AahUserRole, and login is the same as the APP_DB_USER value.
- APP_DB_HOST
  - Microsoft SQL Server host for the Application Database; same as GeoDB.
- APP_DB_NAME
  - Name of the SQL Server database that houses spatial and non-spatial database
- APP_SA_USER
  - Sysadmin user that is used for running automated SQL scripts to update the database.
- SA PASSWORD
  - Password for APP_SA_USER
- HOST_SITE_URL
  - Default value is txdot4awdaah01 for the development environment.
  - Is used in a token replacement for the rewrite URL for external requests.
  - The URLs with the token are styled this way: https://**HOST_SITE_URL**/
  - This variable will replace the token with similar names and double underscores.
  - This value is used in the web.config to represent the external route clients will use to access Adopt-A-Highway.
- API_ENDPOINT
  - Default value should be <http://localhost:3000>, where 3000 can be replaced by the API_PORT value.
  - This is the internal URL where Angular is running locally on the deployment target
  - Will be configured in the web.config for URL Rewrite rules to redirect

## Target Machine Dependencies

- Microsoft Windows Server 2019
- Internet Access
  - Required for downloading packages from the NPM repository
  - Required for public environments – pre-prod and production
- PowerShell minimum version 5.1.0
  - For executing the script
- Access to Microsoft SQL Server, no defined minimum version, but assumes 2016.
  - For the purposes of creating a test database to run integration tests
  - Assumes an SA user credential – username and password – for creating a role, login, database, and assigning a user, with ability to create schema objects in the new database
- Microsoft Internet Information Services (IIS) web server, minimum version 7.5
- Web Platform Installer
- URL Rewrite Module version 2.1
- Application Request Routing (ARR) Module version 2.5
- Dotnet Core SDK version 3.1
  - Required for the Windows Service Wrapper (winsw)
- Service account aah_service_account
  - Administrator level privileges
  - Ability to configure IIS web sites
  - Ability to manage Windows Service Host services
- Access to TXDOT ArcGIS Services, Gateways and databases for the corresponding environment
- Default Web Site serving https port 443
- X.509 server certificate
  - public for pre-production, and production environments
  - internal certificate for developer and QA environments
- Logical disk D
  - Separate from system drive
- Node.JS version minimum version 14.16.0
  - For building the Node.JS applications, and running the database scripts
- NPM (Node Package Manager) minimum version 7.9.0
  - For downloading JavaScript libraries
- Microsoft Command Line Utilities 15 for SQL Server (x64)
  - Command line for executing database scripts using Node.JS
- db-migrate NPM package minimum version
  - Executes SQL scripts using Microsoft Command Line Utilities for SQL Server in a Node.JS process.
- Nest.JS CLI minimum version 7.6.0
  - Command line for building the REST API
- Angular CLI minimum version 11.2.8
  - Command line for building and running Angular
