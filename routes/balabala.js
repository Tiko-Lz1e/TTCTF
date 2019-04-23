var express = require('express');
var router = express.Router();
var session = require('express-session');
var url = require('url');
var xss = require('xss');
var pool = require('./mysqlpool');

/* GET balabala page. */
router.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));

var str='';
var canbb=1;

router.get('/', function(req, res, next) {
    canbb=1;

    var seaSQL = "select * from balabala WHERE ifgood = ?";
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();

    if (!req.session.user) {
        res.redirect('/login');// 验证是否已经登录，若登录则进入，否则进入登陆界面
    } else {
        console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> balabala');

        try {
            findbala(seaSQL, (err) =>{
                if(err){
                    res.redirect("/error");
                }else{
                    console.log("success");
                }
            })
        }catch(err){
            res.redirect("/error");
        }

        function findbala(seaSQL, callback){
            pool.con(function (connect) {
                connect.query(seaSQL, ['01'], function (err,rs) {
                    if (err){
                        callback(err);
                    }else{
                        if(rs.length > 0){
                            var i = 1;
                            str='';
                            for(;i<=rs.length;i++){
                                var balauser = 'admin';
                                if(rs[i-1].user!=='admin')
                                    balauser = rs[i-1].user;
                                str += '<tr>' +
                                    '<th>' + rs[i - 1].time + '</th>' +
                                    '<th>' + balauser + '</th>' +
                                    '<th>' + rs[i - 1].text + '</th>' +
                                    '</tr>';
                            }
                            res.render('balabala', { title: 'bala墙', iflogin: 'logout', loginmessage: '注销'});
                            console.log('           balalist OK');
                        }
                    }
                })
            })
        }
    }
});

router.get('/list', function(req, res, next) {
    res.send(str);
});

router.get('/sendbala', function(req, res, next) {
    var params = url.parse(req.url, true).query;
    var bala = params.balatext;
    var username = req.session.name;
    var f = + bala.length;

    bala = bala.replace(/</g,'&lt;');
    bala = bala.replace(/>/g, '&gt;');
    bala = bala.replace(/"/g, '&quot;');
    bala = bala.replace(/&/g, '&amp;');

    var ip = req.header('x-real-ip');
    var time = new Date();
    var mytime = time.toLocaleString();

    var str3 = "INSERT INTO `mydata`.`balabala`(id,time,user,text,ifgood) VALUES(0,?,?,?,?) ";
    var newbala = [mytime, username, bala, '01'];

    if (!req.session.user) {
        res.send('你还没登录呢');
    }else {
        if(f>=2&&f<=200) {
            if (canbb === 1) {
                try {
                    balabalabu(str3, newbala, (err) => {
                        if (err) {
                            res.redirect("/error");
                        } else {
                            console.log('bala success');
                        }
                    })
                } catch (err) {
                    res.redirect("/error");
                }
            }
            else {
                res.send('你刚刚已经bala过了丫');
            }
        }else{
            res.send('length error');
        }
    }

    function balabalabu(sendtext, newtext, callback){
        pool.con(function (connect) {
            connect.query(sendtext, newtext, function (err,rs) {
                if (err){
                    console.log(err);
                }else{
                    res.send('(o゜▽゜)o☆[bala发射]');
                    console.log('[' + ip + ']   ' + mytime + ' / ' + username + ': sendbala -> ' + bala.length + ' -> ' + bala);
                    canbb=0;
                    return;
                }
            })
        })
    }
});
module.exports = router;
