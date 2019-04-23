var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var pool = require('./mysqlpool');

function cryptPwd(password, salt){
    var pwd = password + ':' + salt;
    console.log('           pwdputin:   ' + password);
    var md5 = crypto.createHash('md5');
    var rasult = md5.update(pwd).digest('hex');
    console.log('                       '+rasult);
    return rasult;
}

/* GET login page. */
router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');// 验证是否已经登录，若登录则进入，否则进入登陆界面
    } else {
        res.render('changepwd', {title: 'register TTCTF', iflogin: 'logout', loginmessage: '注销'});// 验证是否已经登录，若登录则进入index，否则进入登陆界面
    }
});

var name;
/*接收post过来的注册信息，并判断用户名是否重复*/
router.post('/', function(req,res,next){

    name = req.session.user;
    var oldpwd = req.body.oldpwd;
    var pwd = req.body.newpwd;
    var oldipwd = cryptPwd(oldpwd,name);
    var ip = req.header('x-real-ip');
    var checkpwd = req.body.passwordConfirmation;
    var ipwd = cryptPwd(pwd, name);

    var selectSQL = "SELECT * FROM userlist WHERE number = ? AND password = ? ";
    var changepwd = "UPDATE userlist SET password = ? WHERE number = ? ";
    if(name>2017999999 ||name<2016000000 ||pwd.length<5) {
        res.send('emmmm,you are a bad boy!');
    } else {
        if (checkpwd !== pwd) {
            res.send("两次新密码输入不同，请返回后重新填写");
            return;//防止报错，回调后要加return；
        }
        else {
            try {
                finuser(selectSQL, changepwd, (err) =>{
                    if(err){
                        res.redrect("/error");
                    }else{
                        console.log("success");
                    }
                })
            }catch(err){
                res.redirect("/error");
            }
        }
    }

    function change(changes, callback){
        pool.con(function(connect){
            connect.query(changes, [ipwd,name], function (err, rs) {
                if (err){
                    callback(err);
                }else{
                    if (Object.keys(rs).length > 0) {
                        var time = new Date();
                        var mytime = time.toLocaleString();
                        console.log('[' + ip + ']   ' + mytime + ' | ' + name + "-----> changepwd：" + oldpwd + '----->' + pwd);
                        res.redirect('/logout');
                    }
                }
            });
        })
    }
    function finuser(seasql, changepwd, callback){
        pool.con(function(connect){
            connect.query(seasql,[name,oldipwd], function (err, rs) {
                if (err){
                    callback(err);
                }else{
                    if (rs.length === 1) {
                        try {
                            change(changepwd, (err) =>{
                                if(err){
                                    console.log('           changepwd error');
                                    res.redirect("/error");
                                }else{
                                    console.log("success");
                                }
                            })
                        }catch(err){

                            console.log('        ooooo   changepwd error');
                            res.redirect("/error");
                        }
                    }
                    else {
                        res.send("用户名不存在或原密码错误，请返回后重新注册或联系管理员");
                        return;//防止报错，回调后要加return；
                    }
                }
            });
        })
    }
});

module.exports = router;
