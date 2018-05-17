const mysql = require('mysql');
const obj = {
    connectionLimit: 100, //최대 동시접속자 수
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
};

const pool = mysql.createPool(obj);

const sql = "update member set name=?, email=?, tel=? where id=?";
const arr = ['홍길순', 'soon@aaa.com', '010-1111-2222','hong'];
pool.getConnection((err, conn) => {

    if (err) { return console.log('err= ', err); }
    //console.log('conn', conn);
    conn.query(sql, arr, (err, row) => { //여기서 저장이 됨
        console.log('수정 완료');
        conn.release();
    });
});