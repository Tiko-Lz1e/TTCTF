var express = require('express');
var router = express.Router();
var session = require('express-session');
var pool = require('./mysqlpool');

/* GET challenge page. */
router.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));

var str = '';

router.get('/', function(req, res, next) {
    var seaSQL = "select * from userlist ORDER by point DESC";
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();

    if (!req.session.user) {
        res.redirect('/login');// 验证是否已经登录，若登录则进入，否则进入登陆界面
    } else {
        user = req.session.user;
        console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> ranklist');
        try{
            showrank(seaSQL, (err)=>{
                if(err){
                    res.redirect('/error');
                }
                else{
                    console.log('           ranklist OK');
                }
            })
        }catch(err){
            res.redirect('/error');
        }
    }

    function showrank(searank, callback){
        pool.con(function(connect){//使用连接池
            connect.query(searank, [], function(err,rs){
                if(err) callback(err);

                if(rs.length>0){
                    var i = 1;
                    str='';
                    for(;i<=rs.length;i++){//组成ranklist
                        var user = rs[i-1].number;
                        if(rs[i-1].name) user = rs[i-1].name;
                        str += '<tr>' +
                            '<th>'+i+'</th>' +
                            '<th>'+user+'</th>' +
                            '<th>'+rs[i-1].point+'</th>' +
                            '</tr>';
                    }
                    res.render('ranklist', { title: '排行榜', iflogin: 'logout', loginmessage: '注销'});
                    console.log('           ranklist OK');
                }
            })
        })
    }
});

router.get('/list', function(req, res, next) {
    res.send(str);
});

module.exports = router;
