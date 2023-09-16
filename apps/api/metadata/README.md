# Ping Federation

TxDOT Adopt a Highway uses Ping for external and internal authentication.

Each environment - sandbox for developers, development, testing, staging and production - requires a client configuration for Ping.

Ping will need callback URLs for the login and logout return. These include the return to the API /[login|logout]/callback URLs.

Ping will also send a certificate to be used for client identification in a metadata XML file. This x509 certificate needs to be provided when contacting Ping.

## Certificate renewals

When the service provides a new certificate for an environment, you will need to update the crt file in the /cert folder with the certificate value that they send. Copy the certificate value and override the *idp-signing.crt file for the target environment's machine name.

Next, you will want to ensure that the Azure DevOps Library has the path to the new crt file logged in the new environment.