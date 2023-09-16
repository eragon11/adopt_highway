var sqlcmd = require('sqlcmd-runner');
var dotenv = require('dotenv');
var findConfig = require('find-config');

dotenv.config({ path: findConfig('.env') });

sqlcmd({
        variables: {
            ENVIRONMENT: process.env.NODE_ENV,
            APP_DB_NAME: process.env.APP_DB_NAME,
            APP_DB_USER: process.env.APP_DB_USER,
            APP_DB_PASSWORD: process.env.APP_DB_PASSWORD,
            APP_SA_LOGIN: process.env.APP_SA_LOGIN,
            APP_SA_USER: process.env.APP_SA_USER,
            APP_SA_PASSWORD: process.env.APP_SA_PASSWORD,
            DB_SCHEMA: 'gis',
        },
    inputFiles: ['./mssql/create-schema.sql', './mssql/create-aah-gis.sql'],
        server: {
            name: process.env.APP_DB_HOST,
            instance: process.env.APP_DB_INSTANCE,
        },
        database: 'master',
        enableArithAbort: true,
        trustedConnection: true,
    })
    .catch(function(error) {
        console.log('Failed creating the GIS data: ' + error.message);
    })
    .done(function() {
        console.log('Done.');
    });