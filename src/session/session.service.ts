/**
 * Necessary Import
 */

var session = require('express-session');
var mysql = require('mysql2/promise');
var MySQLStore = require('express-mysql-session')(session);

/**
 * Necessary Defines
 */
 const mysqlConfig = {
    host: process.env.SQL_HOST,
    port: parseInt(process.env.SQL_PORT),
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
}