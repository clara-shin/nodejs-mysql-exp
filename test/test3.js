const mysql = require('mysql');
const obj ={
    connectionLimit: 100, //최대 동시접속자 수
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test'
};

const pool = mysql.createPool(obj);

pool.getConnection((err,conn) => {

    if(err) { return console.log('err= ', err); }
    console.log('conn', conn);
    conn.query('SELECT 1 + 1 as solution', 
    (err, rows) => 
    {
        if (err) { return console.log('err= ', err); }
        console.log('rows = ', rows);
        console.log('rows[0] = ', rows[0]);
        console.log('rows[0].solution = ', rows[0].solution);
        conn.release(); //연결했던 자원을 다시 DB에 반납, pool을 하면 반드시 release 해줘야 함
    });
});