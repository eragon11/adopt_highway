# IIS Web.config with URL Rewrite Rule for Adopt A Highway Web and API

## Overview

This web.config contains URL Rewrite Rules for hosting both the Angular SPA and Nest.JS REST API on a single server using Microsoft IIS web server with the Application Request Routing (ARR) and URL Rewrite modules installed.

## Dependencies

Microsoft IIS - web server
Web Platform Installer (WPI) - IIS managed installs of MS approved extensions
URL Rewrite module
Application Request Routing (ARR) module

## Configuration

Application Request Routing Configuration

In the Server Proxy Settings, Enable Proxy should be checked.

_IMPORTANT:_ Do not check `Reverse rewrite host in response headers`. This will inject ports into the URL which will break URL Rewrite rules.

After configuring IIS, the Default Web Site hosted at port 443 should be configured with an x.509 certificate and bound to port 443. The folder for the app will host a the web.config as a single file. The web.config's sole purpose is to route all incoming requests on port 443 to the proper application - Angular or REST API. Incoming request rules will inspect the requests to determine if the request is for the API. The remaining requests are then forwarded to the Angular application.

The Angular web will run as the Default Web Site in IIS. The REST API should be running in Node.JS. Nest.JS runs on port 3000. The API Node app should be running as a service in the Windows Service Host using the `winsw` wrapper executable.

## Token values

Tokens in the application should be replaced at install time with their actual values. Tokens take the form of two underscores surrounding a variable in all caps - e.g. `__API_ENDPOINT__`. The install.ps1 and install-helpers.psm1 module will replace tokens.

Here are the tokens for replacement:

- `__HOSTNAME__` - URL for the current machine
- `__API_ENDPOINT__` - internal URL route for the REST API; for example, http://localhost:3000
