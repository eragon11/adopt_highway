var sqlcmd = require('sqlcmd-runner');
var path = require('path');
var dotenv = require('dotenv');
var findConfig = require('find-config');

dotenv.config(findConfig('.env'));

sqlcmd({
    inputFiles: [
        './mssql/migrate-legacy-data.sql',
    ],
    server: {
        name: process.env.APP_DB_HOST,
        port: Number(process.env.APP_DB_PORT),
    },
    database: process.env.APP_DB_NAME,
    enableArithAbort: true,
    username: process.env.APP_SA_LOGIN,
    password: process.env.APP_SA_PASSWORD,
})
    .catch(function (error) {
        console.log('Failed: ' + error.message);
    })
    .done(function () {
        console.log('Done.');
    });
