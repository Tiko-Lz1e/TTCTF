$().ready(function() {
// 在键盘按下并释放及提交后验证提交表单
    $("#changepwdbox").validate({

        rules: {
            oldpwd: "required",
            newpwd: {
                required: true,
                minlength: 5
            },
            passwordConfirmation:{
                required: true,
                equalTo: "#newpwd",
            },
        },
        messages: {
            oldpwd: "请输入您的原密码",
            newpwd: {
                required: "请输入您的新密码",
                minlength:"密码长度不能少于5位",
            },
            passwordConfirmation:{
                required:"请再次输入您的新密码",
                equalTo: "与第一次输入不同"
            },

        }
    })
});
