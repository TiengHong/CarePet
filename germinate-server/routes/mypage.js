var express = require('express');
var router = express.Router();
var db = require('../config/mysql');
var conn = db.init();
var bcrypt=require('bcrypt');
const url = require('url');

function passwordCheck(pw_last,pw,pw_re){
    const sql = "SELECT * FROM volun.user"
    if(pw!=pw_re){
      alert("새 비밀번호가 서로 일치하지 않습니다");
    } else{
        const encrypted = bcrypt.hashSync(pw_last,10); //예전비번암호화
        conn.query(sql, function(err,rslt){
            if(err) console.log("SQL문을 실행할 수 없습니다. err:"+err);
            else{
                if(bcrypt.compareSync(pw,rslt[0].user_pw)){ //예전비번맞는지체크
                    const new_encrypted=bcrypt.hashSync(pw,10); //새비번암호화
                    sql="UPDATE user SET user_pw=? WHERE user_id=?";
                }
            }
        })
    }
}

router.get('/', function(req, res, next) {
    console.log(req.session.user);
    var sql = "select * from user where id = ?";
    var param = [req.session.user.uid];
    conn.query(sql, param, function(err, result){
        if(err) console.log("query is not executed:"+err);
        res.render("mypage",{results : result});
    }); 
});
router.post('/',function(req,res){
    var sql = "select * from user";
    const user = req.session.user;
    if(user === undefined) {
        res.redirect("/login");
        return;
    }
    const id = user.uid;
    const {phone_num, pw, pw_last, pw_re}=req.body;  //pw, pw_re 새 비번 pw_last 이전 비번

    console.log(phone_num, user);

    if(phone_num) {
        sql="UPDATE user SET user_phonenum=? WHERE id=?";
        let params=[phone_num, id];
        conn.query(sql, params,function(err,rslt){
            if(err) console.log("SQL ERR:"+err);
        });
    }
    if(pw&&pw_last&&pw_re) {
        
        if(pw!=pw_re){
            alert("새 비밀번호가 서로 일치하지 않습니다");
        } else{
            conn.query(sql, function(err,rslt){
                if(err) console.log("SQL Error! : "+err);
                else{
                    if(bcrypt.compareSync(pw_last,rslt[0].user_pw)){ //이전 비번 맞는지 체크
                        console.log("동일한 비밀번호 확인");
                        const new_encrypted=bcrypt.hashSync(pw,10); //새 비번 암호화
                        sql="UPDATE user SET user_pw=? WHERE id=?";
                        let params = [new_encrypted, id];
                        conn.query(sql, params, function(err,rslt){
                            if(err) console.log("SQL err :"+err);
                        });
                    } else{
                        console.log("비밀번호 틀려요");
                        //alert("기존 비밀번호를 다시 확인하세요");
                    }
                }
            });
        }
    }
    res.redirect("/menu");
/*
    if((pw&&pw_last&&pw_re)&&phone_num){
        if(pw!=pw_re){
        alert("새 비밀번호가 서로 일치하지 않습니다");
        } else{
            const encrypted_last = bcrypt.hashSync(pw,10);
            conn.query(sql, function(err,rslt){
                if(err) console.log("SQL Error! : "+err);
                else{
                    if(bcrypt.compareSync(pw_last,rslt[0].user_pw)){ //이전 비번 맞는지 체크
                        console.log("동일한 비밀번호 확인");
                        const new_encrypted=bcrypt.hashSync(pw,10); //새 비번 암호화
                        sql="UPDATE user SET user_phonenum=?, user_pw=? WHERE id=?";
                        let params = [phone_num, new_encrypted, id];
                        conn.query(sql, params, function(err,rslt){
                            if(err) console.log("SQL err :"+err);
                            else{
                                res.redirect("/menu");
                            }
                        });
                    } else{
                        console.log("비밀번호 틀려요");
                        //alert("기존 비밀번호를 다시 확인하세요");
                    }
                }
            });
        }
    } else if((pw&&pw_last&pw_re)&& !phone_num){
        if(pw!=pw_re){
            alert("새 비밀번호가 서로 일치하지 않습니다");
            } else{
                const encrypted_last = bcrypt.hashSync(pw,10);
                conn.query(sql, function(err,rslt){
                    if(err) console.log("SQL Error! : "+err);
                    else{
                        if(bcrypt.compareSync(pw_last,rslt[0].user_pw)){ //이전 비번 맞는지 체크
                            console.log("동일한 비밀번호 확인");
                            const new_encrypted=bcrypt.hashSync(pw,10); //새 비번 암호화
                            sql="UPDATE user SET user_pw=? WHERE id=?";
                            let params = [new_encrypted, id];
                            conn.query(sql, params, function(err,rslt){
                                if(err) console.log("SQL err :"+err);
                                else{
                                    res.redirect("/menu");
                                }
                            });
                        } else{
                            console.log("비밀번호 틀려요");
                            //alert("기존 비밀번호를 다시 확인하세요");
                        }
                    }
                });
        }
    } else if(phone_num && !(pw&&pw_last&&pw_re)){
        conn.query(sql, function(err,rslt){
            if(err) console.log("SQL ERR:"+err);
            else{
                sql="UPDATE user SET user_phonenum=? WHERE id=?";
                let params=[phone_num, id];
                conn.query(sql, params,function(err,rslt){
                    if(err) console.log("SQL ERR:"+err);
                    else{
                        res.redirect("/menu");
                    }
                });
            }
        });
    } else{
        redirect("/menu");
    }
*/    

    

    //let sql="UPDATE user SET user_phonenum=?, user_pw=? WHERE user_id = ?";
    //let params = [phone_num, encrypted, id];

    
});




module.exports = router;