var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const obj = {
  connectionLimit: 100, //최대 동시접속자 수
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test'
};

const pool = mysql.createPool(obj);

/* GET home page. */
//http://localhost:3000/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//http://localhost:3000/writeform
router.get('/writeform', function (req, res, next) { //REST방식으로 get
  res.render('writeform', { title: '게시판 글 쓰기' }); //파일명만 기재
});

//event driven
router.post('/write', (req, res, next) => { //next가 있으면 서버가 안죽어요.
  console.log('req.body= ', req.body); //dependency bady parser , 값이 할당되는지 테스트
  const writer = req.body.writer;  //name ="writer"  , name 기준
  const pwd = req.body.pwd;
  const subject = req.body.subject;
  const content = req.body.content;

  //DB로
  const sql = "insert into board(writer,pwd,subject,content) values(?,?,?,?)";
  const arr = [writer, pwd, subject, content];
  pool.getConnection((err, conn) => {

    if (err) { return next(err); } //방어적코드, express가 숨겨논 에러처리 방법, 에러메시지를 브라우저에 보여줌, 서버는 죽지않음
    //console.log('conn', conn);
    conn.query(sql, arr, (err, row) => { //여기서 저장이 됨
      if (err) { return next(err); }
      console.log('저장 완료');
      conn.release();
      res.send('ok'); //callback이니까 안쪽으로 넣자
    });
  });
});

//http://localhost:3000/list  :  get 방식
router.get('/list', (req, res, next) => {
  //res.send('여기는 list입니다.!!');
  pool.getConnection( (err, conn) => {
    if(err) { return next(err); }
    const sql = 
      `SELECT 	num, 
                subject, 
                writer, 
                DATE_FORMAT( now(), '%Y-%c-%d %T' ) as regdate, 
                hit
        FROM board 
        ORDER BY num DESC`; //백쿼트를 사용해서 멀티라인으로 값 설정

    const arr = [];
    conn.query(sql, arr, (err, rows) => {  //결과가 많을 때 rows로 적어주는 것이 가독성이 좋다
      console.log('rows= ', rows);
      conn. release();
      var obj = { "title": "게시판", "rows": rows };
      //res.json(obj);  //모바일서버에서 이렇게 보낸다
      res.render('list', obj);  //웹서버로 처리할 때 
    });
  });
});

router.get('/read/:num', (req, res, next) => { // 콜론(:) + 변수명 -> url에서 /read/뒤에 글번호 붙일 때(약속) 
  let num = req.params.num; //get으로 :num을 가져옴
  console.log('num= ', num);
  //res.json({ num : num }); 자원손실때문에 한번만 요청해야 함
  pool.getConnection((err, conn) => {
    if(err) { return next(err); }
    let update_sql = "UPDATE board SET hit = hit + 1 WHERE num=?";    //조회수증가
    let arr = [num];
    conn.query(update_sql, arr, (err, result) => {
      if (err) { return next(err); }
      console.log('result= ', result);
      let sql = "SELECT * FROM board WHERE num=?";
      conn.query(sql, arr, (err, rows) => {
        if (err) { return next(err); }
        console.log('rows= ', rows);
        conn.release();

        let obj = {
          title: '게시판 글 읽기',
          row: rows[0]
        };
        res.render('read', obj);

      });
    });
  });
});

router.get('/updateform/:num', (req, res, next) => {
  let num = req.params.num;
  //res.json({num : num});
  
  //1. SELECT -> 보여준다.
  pool.getConnection((err, conn) => {
    if (err) { return next(err); }
    let sql ="SELECT * FROM board WHERE num=?";
    let arr= [num];
    conn.query(sql, arr, (err, rows) => {
      if (err) { return next(err); }
      console.log('rows= ', rows);
      let obj = {
        title: '게시판 수정',
        row: rows[0]
      };
      res.render('updateform', obj);
    });
  });
});

router.post('/update', (req, res, next) => {
  console.log('req.body=', req.body);
  const num = req.body.num;  
  //writeform.ejs 에서 정의한
  //<input type="hidden" name="num" ...> 에 글번호 받기
  const writer = req.body.writer;  //name ="writer"  , name 기준
  const pwd = req.body.pwd;
  const subject = req.body.subject;
  const content = req.body.content;
  pool.getConnection((err, conn) => {
    if (err) { return next(err); }
    const sql = "UPDATE board SET writer=?, subject=?, content=? WHERE num=? and pwd=?";
    const arr = [writer, subject, content, num, pwd];
    conn.query(sql, arr, (err, result) => {
      if (err) { return next(err); }
      console.log("result= ", result);
      conn.release();
      if(result.affectedRows == 1) {
        res.redirect('/list');  //리스트로 이동
      } else {
        res.send("<script>alert('비밀번호가 틀려서 되돌아갑니다!'); history.back();</script>");
      }
    });
  });
});

module.exports = router;

// CREATE TABLE board(
//   num INT NOT NULL AUTO_INCREMENT,
//   pwd VARCHAR(20) NOT NULL,
//   subject VARCHAR(100) NOT NULL,
//   content TEXT NOT NULL,
//   writer VARCHAR(20) NOT NULL,
//   regdate DATETIME NOT NULL DEFAULT '',
//   hit INT NOT NULL DEFAULT '0',
//   PRIMARY KEY(`num`)
// )
