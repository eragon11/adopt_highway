const mockedConfigService = {
    get(key: string) {
        switch (key) {
            case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
                return '3600s';
            case 'SAML_CERT':
                return 'cert/localhost-idp-signing.crt';
        }
    },
};

export default mockedConfigService;
