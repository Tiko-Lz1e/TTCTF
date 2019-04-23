var express = require('express');
var router = express.Router();
var session = require('express-session');
var svgCaptcha = require('svg-captcha');
var crypto = require('crypto');
var pool = require('./mysqlpool');

function cryptPwd(password, salt){
    var pwd = password + ':' + salt;
    var md5 = crypto.createHash('md5');
    var rasult = md5.update(pwd).digest('hex');
    console.log('                               '+rasult);
    return rasult;
}

/* GET login page. */
router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.render('login', { title: 'login TTCTF' });// 验证是否已经登录，若登录则进入index，否则进入登陆界面
    } else {
        res.redirect('/');
    }
});

router.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));

router.post('/',function(req,res,next){
    var ip = req.header('x-real-ip');
    var time = new Date();
    var mytime = time.toLocaleString();
    var name = req.body.uname;
    var pwd = req.body.upass;
    console.log("           ip:                 " + ip);
    console.log('           loginnameputin:     ' + name);

    name = + name;

    pwd = cryptPwd(pwd, name);

    var selectSQL = "SELECT * FROM userlist WHERE number = ? AND password = ? ";
    var updateIP = "UPDATE userlist SET lastIP = ? WHERE number = ? ";
    if(name>2017999999 ||name<2016000000 ) res.send('emmmm,you are a bad boy!');
    else {
        try {
            finduser(selectSQL, updateIP, (err) => {
                if (err) {
                    res.redirect("/error");
                } else {
                    console.log('success');
                }
            });
        } catch (err) {
            res.redirect("/error");
        }
    }

    function finduser(selectSQL,updateSQL, callback){
        pool.con(function (connect) {
            connect.query(selectSQL, [name,pwd], function (err,rs) {
                if (err){
                    console.log(err);
                    callback(err);
                }else{
                    if(rs.length>0){
                        req.session.user = name;
                        req.session.name = rs[0].name;
                        req.session.level = rs[0].level;
                        req.session.userid =rs[0].id;
                        if(ip!=='10.112.195.94') {
                            pool.con(function (connect) {
                                connect.query(updateIP, [ip, name], function (err, rs) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        console.log('[' + ip + ']   ' + mytime + ' | ' + name + '-----> update last IP');
                                    }
                                });
                            });
                        }
                        console.log('[' + ip + ']   ' + mytime + ' | ' + name + '-----> log in');

                        res.redirect('/');
                    }
                    else{
                        res.send("用户名或密码错误，请尝试重新登录" );//验证是否登陆成功
                    }
                }
            })
        })
    }
});

// 获取验证码
/*router.post('/code', (req, res, next) => {
    var codeConfig = {
        size: 5,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    };
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    var codeData = {
        img:captcha.data
    };
    res.json({
        status: 1,
        result: codeData,
        msg: '验证码'
    });
    console.log(req.session.captcha);
});
*/
module.exports = router;
