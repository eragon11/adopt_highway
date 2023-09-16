var sqlcmd = require('sqlcmd-runner');
var dotenv = require('dotenv');
var findConfig = require('find-config');

dotenv.config({ path: findConfig('.env') });

sqlcmd({
    variables: {
        APP_DB_NAME: process.env.APP_DB_NAME,
        APP_DB_USER: process.env.APP_DB_USER,
        APP_DB_PASSWORD: process.env.APP_DB_PASSWORD,
        APP_SA_LOGIN: process.env.APP_SA_LOGIN,
        APP_SA_USER: process.env.APP_SA_USER,
        APP_SA_PASSWORD: process.env.APP_SA_PASSWORD,
        DB_SCHEMA: process.env.DB_SCHEMA,
    },
    inputFiles: [
        './mssql/drop-and-createdb-setup.sql',
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
        instance: process.env.APP_DB_INSTANCE,
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
