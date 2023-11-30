var mysql = require('mysql2');
var dbConfig = require('../config/dbconfig')

var connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    port: dbConfig.DBPORT,

});

connection.getConnection(error => {
    if(error) throw error;
    console.log('🚦 kết nối database thành công!');
});

module.exports = connection;