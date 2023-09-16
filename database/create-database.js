var sqlcmd = require('sqlcmd-runner');
var path = require('path');
var dotenv = require('dotenv');
var findConfig = require('find-config');

dotenv.config({ path: findConfig('.env') });

sqlcmd({
    variables: {
        APP_DB_NAME: process.env.APP_DB_NAME,
        APP_DB_USER: process.env.APP_DB_USER,
        APP_DB_PASSWORD: process.env.APP_DB_PASSWORD,
    },
    inputFiles: [
        './mssql/createdb-setup.sql',
        './mssql/create-schema.sql',
        './mssql/create-admin-login.sql',
        './mssql/create-admin-user.sql',
        './mssql/deny-dbo-to-admin.sql',
        './mssql/grant-admin-user.sql',
        './mssql/alter-sa-schema.sql',
        './mssql/create-admin-user-aah_legacy.sql',
        './mssql/create-login.sql',
        './mssql/create-user.sql',
    ],
    server: {
        name: process.env.APP_DB_HOST,
        protocol: 'tcp',
        instance: 'default',
        port: Number(process.env.APP_DB_PORT),
    },
    database: 'master',
    enableArithAbort: true,
    trustedConnection: true,
})
    .catch(function (error) {
        console.log('Failed: ' + error.message);
    })
    .done(function () {
        console.log('Done.');
    });
