const svgCaptcha = require('svg-captcha');
var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1ilIO', // 验证码字符中排除 0o1ilIO
        noise: 2, // 干扰线条的数量
        height: 44
    };
    /*const cap = captcha.createMathExpr();
    req.session.captcha = cap.text; // session 存储
    res.type('svg'); // 响应的类型
    res.send(cap.data);*/
    const cap = svgCaptcha.create(codeConfig);
    //req.session["randomcode"] = code.text.toLowerCase();
    res.send({
        img: cap.data
    });
    console.log(cap);
});

module.exports = router;
