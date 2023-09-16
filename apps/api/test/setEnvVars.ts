process.env.NODE_ENV = 'local';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '1433';
process.env.DB_NAME = 'aah';
process.env.DB_SCHEMA = 'aah';
process.env.DB_USER = 'aah_publisher';
process.env.DB_PASSWORD = 'aahpub123*';
process.env.API_TITLE = 'TxDOT Adopt-A-Highway API (Sandbox)';
process.env.API_DESCRIPTION =
    'Provides data access for the TxDOT Adopt-A-Highway application for local Sandbox';
process.env.API_PORT = '3000';
process.env.SECRETKEY = 'jWt5ecret123';
process.env.EXPIRES_IN = '3600s';
process.env.API_ALLOWED_ORIGINS =
    'https://localhost:4200,https://localhost:3000,https://sso.connect.pingidentity.com';
process.env.JWT_ACCESS_TOKEN_SECRET = 'jWt5ecret123';
process.env.JWT_REFRESH_TOKEN_SECRET = 'jWtR3fre5h123';
process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME = '3600s';
process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME = '3600s';
process.env.API_VERSION = '0.1.0';
process.env.LOG_SQL = 'query';
process.env.HTTPS_PFX_FILE = 'cert/localhost.pfx';
process.env.HTTPS_PASSPHRASE = 'P@55w0rd!';
process.env.SAML_ISSUER = 'aah.maps.txdot.gov';
process.env.SAML_PROTOCOL = 'https://';
process.env.SAML_CALLBACK_URL = 'https://localhost:3000/auth/login/callback';
process.env.SAML_ENTRY_POINT =
    'https://sso.connect.pingidentity.com/sso/idp/SSO.saml2?idpid=90bd91b0-6711-49a2-8ed4-b31fd8812ff4';
process.env.SAML_LOGOUT_URL =
    'https://sso.connect.pingidentity.com/sso/SLO.saml2';
process.env.SAML_CERT = 'cert/localhost-idp-signing.crt';
process.env.SAML_AAH_LOGIN_SUCCESS_URL = 'https://localhost:4200/login';
process.env.SAML_AAH_LOGIN_FAILURE_URL = 'https://localhost:4200/access-denied';
