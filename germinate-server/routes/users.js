var express = require('express');
var router = express.Router();
var db = require('../config/mysql');
var conn = db.init();
var bcrypt=require('bcrypt');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", (req, res) => {
  console.log("login 함수가 실행됩니다.");

  console.log(req.body.id);
  console.log(req.body.pw);

  console.log(req.session);
  console.log(req.session.redirect);

  const paramID = req.body.id || req.query.id;
  const pw = req.body.pw || req.query.pw;

  if (req.session.user) {
    console.log("이미 로그인이 되어 있습니다.");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
    res.write("<h1>already logged</h1>");
    res.write(`<div>[ID} : ${req.session.user.id} [PW] : ${req.session.user.name}</div>`);
    res.write('<a href="localhost:3000/menu"></a>');
    res.end();
  } else {
    // 사용자의 요청에 대한 session을 형성함.
    // 실질적으로는 id와 pw를 확인하고 성공을 한 경우에 session을 만들어야 함.
    // 사용자의 정보는 DB에서 읽어와서 처리함
    let sql = "SELECT * from user where user_id = ?";
    let params = [paramID];
    conn.query(sql, params, function (err, rslt) {
      if (err) console.log("SQL문을 실행할 수 없습니다. 이유: " + err);
      else {
        if (bcrypt.compareSync(pw, rslt[0].user_pw)) {
          req.session.user = {
            uid: rslt[0].id,
            id: paramID,
            name: rslt[0].user_name,
            phone: rslt[0].user_phonenum,
            authorized: true,
          };
          res.cookie("id", paramID, {
            maxAge: 60000,
            sameSite: "none",
            secure: true,
            httpOnly: true,
          });
          res.cookie("name", rslt[0].user_name, {
            maxAge: 60000,
            sameSite: "none",
            secure: true,
            httpOnly: true,
          });
    console.log("로그인하여 세션을 생성합니다.");
          
          const redirectUrl = req.session.redirect || '/home';
          res.redirect(redirectUrl);
        } else {
          res.send("사용자 아이디 또는 비밀번호가 틀립니다.");
        }
      }
    });
  }
});

router.post('/signup', function(req, res){
  const {id, phone_num,birth, name, pw} = req.body;
  let sql = "SELECT user_id AS cnt FROM user WHERE user_id = ?";
  let params = [id];
  conn.query(sql, params, function(err,rslt){
    if(err) console.log("SQL문을 실행할 수 없습니다. :"+err);
    else{
      if(rslt.length==0){
        const encrypted = bcrypt.hashSync(pw, 10);
        sql="INSERT INTO user (user_id, user_pw, user_name,user_phonenum, user_birth) VALUES (?,?,?,?,?)";
        params = [id, encrypted, name, phone_num, birth];
        conn.query(sql, params, function(err, result){
          if(err) console.log("SQL문을 실행할 수 없습니다.:"+err);
          else{
            res.redirect('/home');
          }
        })
      } else{
        res.send(id+" is already registered.");
      }
    }
  })
});

module.exports = router;
