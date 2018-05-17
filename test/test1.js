var mysql = require('mysql');

var obj = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
};

var connection = mysql.createConnection(obj); //동기 방식

connection.connect();

//비동기 방식
connection.query('SELECT 1 + 1 AS solution',  (error, results) => {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
    //The solution is: 2
});

connection.end();