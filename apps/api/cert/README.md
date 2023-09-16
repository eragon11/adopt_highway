## CERT FILES

# OVERVIEW

This document describes commands that were used to export x509 certificates from localhost.pfx that are stored in this folder. When complete you will have a private and public key file.

# File contents

## dev-idp-ext-signing.crt

Used to connect to the Ping1AS DEV environment for all machines. Current machines are as follows:

- localhost (developer sandboxes)
- TXDOT4AWTAAH01.dot.state.tx.us (SIT, development)
- TXDOT4AWTAAH02.dot.state.tx.us (UAT, user-acceptance testing)
- TXDOT4WVRAAH01.dot.state.tx.us (PREPROD, staging, temporary, data-cleanup)

## prod-idp-ext-signing.crt

Used to connect to the Ping1AS Production environment for all machines. Current machines are as follows:

- TXDOT4WVPAAH01.dot.state.tx.us (production)

# Creating SSL certificates for API

This article assumed you have installed [`openssl`](https://www.openssl.org/). Also, the AAH web on IIS should be configured to provide an SSL certificate. Export this certificate with a password that is stored in the environment Excel file on SharePoint for Adopt A Highway. We will use this pfx file and openssl to generate a crt and key file to secure the API.

All files for this process are stored in a C:\certs folder on the host machine.

Using with the pfx file. We will first extract the private key. This certificate will be used in the SAML_PRIVATE_KEY path. Usually, we install this certificate to C:\certs. The .env.production file will point to the path using the server name with a `.key` file name extension.

> NOTE: Change <machinename> to your machine name, or localhost on your own machine

```bash
openssl pkcs12 -in <machinename>.pfx -nocerts -nodes | openssl rsa -out <machinename>.key
```

You will be prompted for a password. For localhost, use `P@55w0rd!` as our password for the `Import password` and the `PEM pass phrase`. Use the environment Excel file value for all other environments.

IMPORTANT!: Ping will also need any trust chain certificates from which the PFX certificate is derived trusted on their servers. Send them the TxDOT PKI Issuing Sentinel certificate, or other, as needed.

Create a public certificate with this command:

```bash
openssl pkcs12 -in <machinename>.pfx -clcerts -nokeys -out <machinename>.crt
```

NOTE: The public certificate is not currently in use. This is for information only.

# Reference

[IBM Architectural Room - Extracting the certificate and keys from a .pfx file](https://www.ibm.com/docs/en/arl/9.7?topic=certification-extracting-certificate-keys-from-pfx-file)
