var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var pool = require('./mysqlpool');

function cryptPwd(password, salt){
    var pwd = password + ':' + salt;
    var md5 = crypto.createHash('md5');
    var rasult = md5.update(pwd).digest('hex');
    console.log('                     '+rasult);
    return rasult;
}

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'register TTCTF' });// 验证是否已经登录，若登录则进入index，否则进入登陆界面
});

var name;
/*接收post过来的注册信息，并判断用户名是否重复*/
router.post('/', function(req,res,next){
    name = req.body.newuser;
    var num = req.body.newnum;
    var pwd = req.body.newupass;
    var ip = req.header('x-real-ip');
    var checkpwd = req.body.passwordConfirmation;


    name = name.replace(/</g,'&lt;');
    name = name.replace(/>/g, '&gt;');
    name = name.replace(/"/g, '&quot;');
    name = name.replace(/&/g, '&amp;');
    num = +num;
    var ipwd = cryptPwd(pwd, num);

    console.log('           nameputin:  ' + name);
    console.log('           numputin:  ' + num);

    var selectSQLname = "select * from `mydata`.`userlist` where name = ?";
    var selectSQLnum = "select * from `mydata`.`userlist` where number = '"+ num +"'";
    var selectSQLnum2 = "select * from `web2`.`805` where num = '"+ num +"'";
    var addUser = 'INSERT INTO `mydata`.`userlist`(id,name,number,password,level,point,lastIP) VALUES(0,?,?,?,?,0,?)';

    if(num>2018999999 ||num<2016000000 ) {
        res.send('emmmm,you are a bad boy!');
    } else {
        if (checkpwd !== pwd) {
            res.send("两次密码输入不同，请返回后重新注册");
            return;//防止报错，回调后要加return；
        }
        else {
            try {
                finuser(selectSQLname, selectSQLnum, selectSQLnum2, addUser, (err) =>{
                    if(err){
                        res.redirect("/error");
                    }else{
                        console.log("success");
                    }
                })
            }catch(err){
                res.redirect("/error");
            }
        }
    }

    function adduser(addsql, callback){
        pool.con(function(connect){

            connect.query(addUser, [name, num, ipwd, 'guest',ip], function (err, rs) {
                if (err){
                    callback(err);
                }else{
                    if (Object.keys(rs).length > 0) {
                        var time = new Date();
                        var mytime = time.toLocaleString();
                        console.log('[' + ip + ']   ' + mytime + ' | ' + "Id: " + num + " -> 新用户注册：" + name);
                        res.redirect('/login');
                    }
                }
            });
        })
    }
    function finuser(seasql1, seasql2, seasql3, addsql, callback){
        pool.con(function(connect){

            connect.query(seasql1+';'+seasql2+';'+seasql3,[name], function (err, rs) {
                if (err){
                    callback(err);
                }else{
                    if(rs[2].length<=0){
                        res.send("非805班同学暂时无法注册");
                        return;
                    }
                    else if (rs[0].length>0||rs[1].length>0) {
                        res.send("用户名已存在，请返回后重新注册");
                        return;//防止报错，回调后要加return；
                    }
                    else {
                        try {
                            adduser(addsql,(err) =>{
                                if(err){
                                    res.redirect("/error");
                                }else{
                                    console.log("success");
                                }
                            })
                        }catch(err){
                            res.redirect("/error");
                        }
                    }
                }
            });
        })
    }
});

module.exports = router;
