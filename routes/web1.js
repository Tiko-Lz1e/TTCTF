var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'web1',
    password : 'admin',
    database : 'web1'
});

/* GET login page. */
router.get('/', function(req, res, next) {
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web1');
    res.render('web1', { title: 'login web1' });

});

connection.connect();

router.post('/',function(req,res,next){

    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> web1');

    var name = req.body.uname;
    console.log('           web1nameputin: ' + name);
    var pwd = req.body.upass;
    console.log('           web1pwdputin: ' + pwd);
    //name = name.replace('or','');
    name = name.replace(/ /g,'');
    //name = name.replace(/#/,'');
    //pwd = pwd.replace('or','');
    pwd = pwd.replace(/ /g,'');
    //pwd = pwd.replace('#','');
    console.log('           web1nnameputin: ' + name);
    console.log('           web1npwdputin: ' + pwd);
    var selectSQL = "select * from `web1`.`web1` where name = '"+ name +"' and password = '"+ pwd +"'";

    //console.log('\n\n',selectSQL,'\n\n');
    function finduser(selectsql, callback){
        connection.query(selectsql,function (err,rs) {
            if (err){
                callback(err);
            }else{
                if(rs.length===1){
                    console.log('OK');
                    console.log(rs);
                    //res.send(rs);
                    res.send("TTCTF{Y0u_Have_Hacked_w3b1!}" );
                }
                else{
                    res.send("用户 " + name + " 不存在" );//验证是否登陆成功
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
module.exports = router;
