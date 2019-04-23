var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web3');
    res.render('web3/web3', { title: 'login web1' });

});

router.get('/web3son', function(req, res, next) {
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web3');
    res.render('web3/web3son', { title: 'login web1' });

});

connection.connect();

router.get('/sendnum',function(req,res,next){
    var params = url.parse(req.url,true).query;
    var num = params.num;
    console.log(num);
    var flag = "这是一个“高端”的alert劫持操作;-)";
    num = num.replace('or','');
    num = num.replace(/ /g,'');
    num = num.replace(/_/,'');
    num = num.replace(/alert/g,'');
    num = num.replace(/#/,'');
    num = num.replace(/script/g,'');
    num = num.replace(/script/g,'');
    num = num.replace(/script/g,'');
    var selectSQL = "select * from `web2`.`805` where num = '"+ num +"'";
    console.log(num);
    if(num.indexOf("flag")>=0){
        flag = '你需要弹窗\'_flag\'哦';
    }
    if(num.indexOf("_flag")>=0){
        flag = 'TTCTF{XSS_is_rea11y_fvnny}';
    }

    function finduser(selectsql, callback){
        connection.query(selectsql,function (err,rs) {
            if (err){
                callback(err);
            }else{
                if(rs.length>0){
                    var qes = {
                        "text": num + ", 欢迎你！",
                        "flag": flag
                    };
                    res.write(JSON.stringify(qes));
                    res.end();
                }
                else{
                    var qes1 = {
                        "text": num + "不是公认的的小可爱！",
                        "flag": flag
                    };
                    res.write(JSON.stringify(qes1));
                    res.end();
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
