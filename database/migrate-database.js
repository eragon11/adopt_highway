var path = require('path');
var dotenv = require('dotenv');
var findConfig = require('find-config');

dotenv.config({ path: findConfig('.env') });

module.exports = {
    dev: {
        appName: `${process.env.appName}-DB`,
        server: process.env.APP_DB_HOST,
        database: process.env.APP_DB_NAME,
        schema: process.env.DB_SCHEMA,
        requestTimeout: 120000,
        authentication: {
            type: 'default',
            options: {
                userName: process.env.APP_SA_LOGIN,
                password: process.env.APP_SA_PASSWORD,
            },
        },
        driver: 'mssql',
        options: {
            enableArithAbort: true,
            fallbackToDefaultDb: true,
            port: Number(process.env.APP_DB_PORT),
        },
    },
};

