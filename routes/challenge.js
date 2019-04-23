var express = require('express');
var router = express.Router();
var session = require('express-session');
var url = require('url');
var pool = require('./mysqlpool');

/* GET challenge page. */
router.use(session({
    secret: 'twxtql',
    resave: false, // 是否每次请求都重新设置session
    saveUninitialized: true // 无论有没有session，每次都请求设置一个session
}));

router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');// 验证是否已经登录，若登录则进入，否则进入登陆界面
    } else {
        var ip = req.header('x-real-ip');
        var user = req.session.user;
        var time = new Date();
        var mytime = time.toLocaleString();
        console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> challenge');
        res.render('challenge', { title: 'TTCTF challenges', iflogin: 'logout', loginmessage: '注销', qesid:3});
    }
});

var cansend=1;
router.get('/question', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var ip = req.header('x-real-ip');
    var user = req.session.user;
    var time = new Date();
    var mytime = time.toLocaleString();
    var params = url.parse(req.url, true).query;//url解析

    var id = + params.id;
    var findQuestion = "select * from `mydata`.`question` where id = '"+ id + "'";//sql查询语句
    cansend=1;
    console.log('[' + ip + ']   ' + mytime + ' | ' + user + '-----> question?id=' + id);
    if(id<=0||id>99){
        res.send('喵喵喵？');
    }else {
        try {
            findQ(findQuestion, (err) => {
                if (err) {
                    res.redrect("/error");
                } else {
                    console.log("success");
                }
            })
        } catch (err) {
            res.redirect("/error");
        }
    }

    function findQ(findQuestion, callback){
        pool.con(function(connect){
            connect.query(findQuestion,function (err,rs) {
                if (err){
                    callback(err);
                }else {
                    if (rs.length>0) {
                        var str = rs[0].text;
                        var title = rs[0].title;
                        var point = rs[0].point;
                        var link = rs[0].link;
                        var qes = {
                            "title": title,
                            "text": str,
                            "link": link,
                            "point": point,
                            "answer": '把得到的flag输入上面的框框里再点右下角send flag按钮就好啦(๑• . •๑)'
                        };//创建一个object储存题目信息
                        res.write(JSON.stringify(qes));//将题目和题的内容以string的形似发送给前端
                        res.end();
                        return;
                    } else {
                        var sry = {
                            "title": "这里本应该有一道题",
                            "text": "然鹅还没有想出来_(:з」∠)_",
                            "link": "./challenge",
                            "point": '0',
                            "answer": '虽然没有flag可以拿但这里仍然有个输入框呢，可以输进去点什么试试，嘿嘿嘿'
                        };
                        res.write(JSON.stringify(sry));
                        res.end();
                        return;
                    }
                }
            });
        })
    }
});

var params;
var id;
var user;
var flag;

router.get('/sendflag', function(req, res, next) {

    params = url.parse(req.url, true).query;
    id = params.flagid;
    id = + id;
    user = req.session.user;
    flag = params.flagtext;
    flag = flag.replace('#','');
    flag = flag.replace('/','');
    flag = flag.replace('=','');
    flag = flag.replace(')','');
    flag = flag.replace('\'','');
    if (!req.session.user) {
        res.send('你还没登录呢');
    }else {
        if(id<=2&&id>=1) {
            if(cansend===1) {
                findifdeal(user, id).then(setflag);//异步操作，保证先查做题记录，再提交flag
                cansend=0;
            }
            else{
                res.send('哇，大佬你提交得太频繁了，休息会儿再交叭～');
            }
        }
        else{
            res.send('you are a bad boy!');
        }
    }
    /*查询该用户是否已经提交过过这道题的flag*/
    function findifdeal(user, id){
        return new Promise(function(resolve){
            var finddeal ="select ifdeal from `mydata`.`deallist` where user = '"+  user +"' and qesid = '"+ id +"'";
            pool.con(function(connect){
                connect.query(finddeal,[], function (err, rs) {
                    if (err) throw  err;

                    if (rs.length === 1) {
                        console.log('           做过');
                        resolve(1);
                    }
                    else {
                        console.log('           没做过');
                        resolve(0);
                    }
                });
            })
        });
    }

    function setflag(rows){
        var findflag = "select * from `mydata`.`question` where id = '"+  id +"' and flag = '"+ flag +"'";
        if(rows===0) {
            pool.con(function(connect){
                connect.query(findflag, function (err, rs) {
                    if (err) throw  err;

                    if (rs.length === 1) {
                        res.send('          (o゜▽゜)o☆[BINGO!]');
                        var p = rs[0].point;
                        var str1 = "UPDATE `mydata`.`userlist` SET point=point+? WHERE number = ? ";
                        var str2 = "UPDATE `mydata`.`question` SET deal_num=deal_num+1 WHERE id = ? ";
                        var str3 = "INSERT INTO `mydata`.`deallist`(id,user,qesid,ifdeal) VALUES(0,?,?,?) ";
                        pool.con(function(connect){
                            connect.query(str1 + ';' + str2 + ';' + str3,[p,user,id,user,id,1], function (err, rs) {
                                if (err) throw  err;
                                console.log("           point+");
                                console.log("           deal_num+1");
                                console.log("           deal+");
                                console.log('          (o゜▽゜)o☆[BINGO!]');
                                return;
                            });
                            return;
                        })
                    }
                    else {
                        console.log('           error');
                        res.send('好像不太对呢，再试试别的叭_(:з」∠)_');
                        return;
                    }
                });
            })
        }
        else {
            res.send('您已经提交过这道题的flag啦，多次提交是不能刷分的(゜ロ゜)');
            return;
        }
    }
});


module.exports = router;
