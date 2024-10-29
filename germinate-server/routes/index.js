var express = require('express');
var router = express.Router();
var db = require('../config/mysql');
var conn = db.init();
const url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var sql = "select * from item";
  conn.query(sql, function (err, result) {
    if (err) console.log("query is not excuted: " + err);
    else res.send(result);
  });
  redirect("/home");
});

router.get('/get', function(req, res, next) {
  res.render('index', {title: "title"});
});

function isAuthenticated(req,res,next){
  if(req.session.user){
    next();
  } else{
    req.session.returnTo=req.originalUrl;
    res.redirect('/login')
  }
}

router.get( "/v_list", function(req, res, next) {
  var sql = "select * from item";
  loggedOn = req.session.user !== undefined;
  conn.query(sql, function (err, result) {
    console.log(result);
    if (err) console.log("query is not excuted: " + err);
    else res.render("v_list", {results : result, logged: loggedOn});
  });
  console.log("meow");
});



router.get("/applyvolunteer/:id", function(req, res, next){
  console.log(req.query);
  const it = req.params.id;
  const sql0 = "select * from item where v_id = ?";
  let params = [it];

  var param = {};
  var addr = "";

  conn.query(sql0,params,function(err,result){
    if(err) console.log("query is not execute:"+err);
    else{
      console.log(result[0]);
      param.name = result[0].c_name;
      param.addr = result[0].c_address;
      param.phone = result[0].c_phone;
      param.date = req.query.date;
      const user = req.session.user;

      console.log(user);
      var sql = "insert into apply  (user_id, v_id, location, date, user_name, user_phone) values (?, ?, ?, ?, ?, ?)";
      params = [user.uid, it, param.addr, req.query.date, user.name, user.phone];
      conn.query(sql, params, function(err, result){
        console.log(param.addr);
        console.log(user.name)
        if(err) console.log("query is not execute: "+err);
        else {
          res.render("apply",{results : param, user: user});
        }
      });
    }
  })
  console.log("okokokok");
});




router.get("/detail/:id", function(req, res) {
  let id = req.params.id
  let sql = "SELECT * FROM item WHERE v_id = ?";
  let params = [id];
  conn.query(sql, params, (err, result) => {
    if(err) {
      console.log("error: "+err.message);
      res.send("can't query");
    } else {
      console.log(result[0]);
      res.send(result[0]);
    }
  });
});

router.get( "/checkmyvolunteer", function(req, res, next) {
 // let id = req.param.id;
  var sql_item = "select * from item";
  var sql_apply = "select * from apply WHERE user_id=?"
  loggedOn = req.session.user !== undefined;
  conn.query(sql, function (err, result) {
    console.log(result);
    if (err) console.log("query is not excuted: " + err);
    else res.render("checkvol", {results : result, logged: loggedOn});
  });
  console.log("meow~");
});

router.get("/home", function(req, res, next){
  res.cookie('server', "my home server", {
    maxAge: 900000,
    httpOnly: true,
    myCookie: "very very good information",
  });
  res.render('mainpage',{title: "title"});
});

router.get('/signup', function(req, res, next) {
  res.render('sign_up', {title: "title"});
});

router.get('/menu', function(req, res, next) {
  loggedOn = req.session.user !== undefined;
  res.render('menu', {title: "title", logged: loggedOn});
});

router.get("/login", (req, res) => {
  req.session.redirect = req.query.redirect;
  res.render('login');
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
})

module.exports = router;
