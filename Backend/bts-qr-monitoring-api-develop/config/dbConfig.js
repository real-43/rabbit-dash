// var database = {
//     user: 'azureadm',
//     password: 'Bsspaymenttest@2018',
//     server: 'bssgatewaytest.database.windows.net',
//     database: 'gateway',
//     encrypt: true
// };

var database = {
    user: 'webmonitoring',
    password: '@22rXy2c@rW$J8',
    server: 'bssgatewaytest.database.windows.net',
    database: 'gateway',
    encrypt: true
};

var prod_dms_main = {
    host: '159.138.230.25',
    port: 25432,
    user: 'root',
    password: '@h^7MLq4Zd@yU*',
    database: 'dms-main',
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
};

var testDBuser = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Sarayut029299908',
    port: 5432,
}

module.exports = { database, prod_dms_main, testDBuser };