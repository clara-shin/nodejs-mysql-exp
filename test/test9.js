const mysql = require('mysql');
const obj = {
    connectionLimit: 100, //최대 동시접속자 수
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
};

const pool = mysql.createPool(obj);

const sql = "SELECT id, name, email, tel FROM member";
const arr = [];
pool.getConnection((err, conn) => {

    if (err) { return console.log('err= ', err); }
    //console.log('conn', conn);
    conn.query(sql, arr, (err, rows) => { //여기서 저장이 됨 SELECT로 받는 데이터는 rows로 받는다
        console.log('rows= ',rows);
        conn.release();
    });
});