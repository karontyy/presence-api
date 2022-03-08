const mysql = require('mysql');

var pool = mysql.createPool({
    "user"     :    "root",
    "password" :    "root",
    "database" :    "ecommerce",
    "host"     :    process.env.MYSQL_HOST,
    "port"     :    process.env.MYSQL_PORT
});

exports.pool = pool;