const mysql = require('mysql');

var pool = mysql.createPool({
    "user"     :    "b95f0d916ff53b",
    "password" :    "90e668d5",
    "database" :    "heroku_9e7cb4e3b72c115",
    "host"     :    "us-cdbr-east-05.cleardb.net",
    "port"     :    3306
});

exports.pool = pool;