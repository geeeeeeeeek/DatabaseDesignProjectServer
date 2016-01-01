/**
 * Created by Zhongyi on 1/1/16.
 */
"use strict";

let mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2j348z',
  database: 'DB_Project'
});

module.exports = connection;