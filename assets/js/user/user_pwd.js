$(function () {
    var form = layui.form

    //自定义表单校验规则
    form.verify({
        //一个名为pwd的规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },

        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }

    })

    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功！')
                // 更新完密码之后重置表单重置表单
                $('.layui-form')[0].reset()
            }
        })
    })

})