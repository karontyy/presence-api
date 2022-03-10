const mysql = require('mysql');

var pool = mysql.createPool({
    "user"     :    "b95f0d916ff53b",
    "password" :    "90e668d5",
    "database" :    "heroku_9e7cb4e3b72c115",
    "host"     :    process.env.MYSQL_HOST,
    "port"     :    process.env.MYSQL_PORT
});

exports.pool = pool;