const mysql = require('mysql');
const obj = {
    connectionLimit: 100, //최대 동시접속자 수
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
};

const pool = mysql.createPool(obj);

const sql = "DELETE FROM member WHERE id=?";
const arr = ['hong'];
pool.getConnection((err, conn) => {

    if (err) { return console.log('err= ', err); }
    //console.log('conn', conn);
    conn.query(sql, arr, (err, row) => { 
        console.log('삭제 완료');
        conn.release();
    });
});