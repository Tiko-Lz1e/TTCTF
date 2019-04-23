$(document).ready(function(){
});

$(function() {
// 在键盘按下并释放及提交后验证提交表单
    $("#loginbox").validate({
        rules: {
            uname:{
                required: true,
                minlength:3
            },
            upass: {
                required: true,
                minlength:3
            }
        },
        messages: {
            uname: "请输入您的用户名",
            upass: "请输入您的密码",
        }

    })
});
