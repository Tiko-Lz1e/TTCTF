/*ws://127.0.0.1:8025/fc673400-3b4b-4546-97d4-74eb6e86bb5b*/
var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');

/* GET challenge page. */

router.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));


router.get('/', function(req, res, next) {
    var ip = req.header('x-real-ip');
    var time = new Date();
    var mytime = time.toLocaleString();
    var user = req.session.user;
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> admin');
    if (req.session.level==='admin') {
        res.render('admin', { title: '管理员您好', level: 'admin'});// 验证是否已经登录，若登录则进入，否则进入登陆界面
    } else {
        res.render('admin', { title: '对不起，您不是本站的管理员', level: 'guest'});
    }
});


module.exports = router;
