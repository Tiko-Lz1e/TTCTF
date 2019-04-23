var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cookie = require('cookie-parser');
var url = require('url');


var connection = mysql.createConnection({
    host : 'localhost',
    user : 'web2',
    password : 'admin',
    database : 'web2'
});

/* GET login page. */
router.get('/', function(req, res, next) {
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web2');
    res.render('web2/web2', { title: 'login web2' });

});

connection.connect();

router.post('/',function(req,res,next){

    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web2');

    var name = req.body.uname;
    console.log('           web2nameputin: ' + name);
    var pwd = req.body.upass;
    console.log('           web2pwdputin: ' + pwd);
    /*name = name.replace('or','');
    name = name.replace(/ /g,'');
    name = name.replace(/#/,'');
    pwd = pwd.replace('or','');
    pwd = pwd.replace(/ /g,'');
    pwd = pwd.replace('#','');*/
    console.log('           web2nnameputin: ' + name);
    console.log('           web2npwdputin: ' + pwd);
    var selectSQL = "select * from `web2`.`user` where name = '"+ name +"' and pass = '"+ pwd +"'";
    console.log(selectSQL);
    function finduser(selectsql, callback){
        connection.query(selectsql,function (err,rs) {
            if (err){
                callback(err);
            }else{
                if(rs.length===1){
                    console.log('OK');
                    console.log(rs);
                    res.cookie('level', rs[0].level, {httpOnly:true});
                    res.cookie('user', rs[0].name, {httpOnly:true});
                    res.redirect('/web2/index');
                }
                else{
                    res.send("账号系统还没弄好呢，想点别的方法登录吧" );//验证是否登陆成功
                }
            }
        })
    }

    try {
        finduser(selectSQL, (err) =>{
            if(err){
                res.send("用户 " + name + " 登录失败" );
            }else{
                console.log("success");
            }
        })
    }catch(err){
        res.redirect("/error");
    }
});

router.get('/index', function(req, res, next) {
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web2/index');
    var level = req.cookies.level;
    var name = req.cookies.user;
    if(name==='admin'){
        if(level==='admin')
            res.render('web2/index', { title: 'login web2' });
        else{
            res.send('对不起，您不是本网站的管理员');
        }
    }else{
        res.send('对不起，您不是本网站的管理员');
    }
});


router.get('/index/sendnum',function(req,res,next){
    var params = url.parse(req.url,true).query;
    var num = params.num;
    num = num.replace('or','');
    num = num.replace(/ /g,'');
    num = num.replace(/#/,'');
    var selectSQL = "select * from `web2`.`805` where num = '"+ num +"'";
    console.log(num);
    function finduser(selectsql, callback){
        connection.query(selectsql,function (err,rs) {
            if (err){
                callback(err);
            }else{
                if(rs.length>0){
                    res.send(rs[0].name+ ", 欢迎你！");
                }
                else{
                    res.send("你不是805班的小可爱！" );//验证是否登陆成功
                }
            }
        })
    }

    try {
        finduser(selectSQL, (err) =>{
            if(err){
                res.send(err.sqlMessage);
            }else{
                console.log("success");
            }
        })
    }catch(err){
        res.redirect("/error");
    }
});

module.exports = router;
