$().ready(function() {
// 在键盘按下并释放及提交后验证提交表单
    $("#registerbox").validate({
        rules: {
            newuname: "required",
            newupass: {
                required: true,
                minlength: 5
            },
            passwordConfirmation:{
                required: true,
                equalTo: "#newupass",
            },

        },
        messages: {
            newuname: "请输入您的用户名",
            newupass: {
                required: '请输入您的密码',
                minlength:"密码长度不能少于5位",
            },
            passwordConfirmation:{
                required: "请再次输入您的密码",
                equalTo: "与第一次输入不同"
            },

        }
        //errorPlacement:function(error,element){
        //    error.appendTo(element.parent().next());
        //}

    })
});
