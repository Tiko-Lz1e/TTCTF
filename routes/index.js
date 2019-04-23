var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');

/* GET home page. */
router.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));

const options = {
    basedir: path.join(__dirname, 'views')
};

router.get('/', function(req, res, next) {
    var ip = req.header('x-real-ip');
    var time = new Date();
    var mytime = time.toLocaleString();
    if (!req.session.user) {
        console.log('[' + ip + ']   ' + mytime + ' | null' +  '-----> index');
        res.render('index', {title: 'TTCTF 2018', iflogin: 'login', loginmessage: '登录'});
    } else {

        var user = req.session.user;
        console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> index');
        res.render('index', {title: 'TTCTF 2018', iflogin: 'logout', loginmessage: '注销'});
    }
});

router.get('/logout', function(req, res){
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> log out');
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
