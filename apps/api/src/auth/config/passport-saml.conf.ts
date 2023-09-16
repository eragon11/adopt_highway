import * as fs from 'fs';

/**
 *  https://github.com/bergie/passport-saml
 */
export const samlPassportConf = {
    forceAuthn: false,
    issuer: process.env.SAML_ISSUER, // match metadata entityID
    identifierFormat: null,
    protocol: process.env.SAML_PROTOCOL,
    callbackUrl: process.env.SAML_CALLBACK_URL,
    entryPoint: process.env.SAML_ENTRY_POINT,
    logoutUrl: process.env.SAML_LOGOUT_URL,
    logoutCallback: process.env.SAML_LOGOUT_CALLBACK_URL,
    cert: fs.readFileSync(process.env.SAML_CERT, 'utf-8'),
    successRedirect: process.env.SAML_AAH_LOGIN_SUCCESS_URL,
    failureRedirect: process.env.SAML_AAH_LOGIN_FAILURE_URL,
    failureFlash: true,
    privateKey: fs.readFileSync(process.env.SAML_PRIVATE_KEY, 'utf-8'),
};
