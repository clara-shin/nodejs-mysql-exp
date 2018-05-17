const mysql = require('mysql');
const obj = {
    connectionLimit: 100, //최대 동시접속자 수
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
};

const pool = mysql.createPool(obj);

const sql = "insert into member(id,name,email,tel) values(?,?,?,?)";
const arr = ['hong','홍길동','hong@aaa.com','010-1234-5678'];
pool.getConnection((err, conn) => {

    if (err) { return console.log('err= ', err); }
    //console.log('conn', conn);
    conn.query(sql, arr, (err, row) => { //여기서 저장이 됨
        if (err) { return console.log('err= ', err); }
        console.log('저장 완료');
        conn.release();
    });
});