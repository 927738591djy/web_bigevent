$(function () {
    //点击“去注册账号”的链接
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击“去登录”的链接
    $('#link-login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取form对象
    var form = layui.form
    //从layui中获取layer对象
    var layer = layui.layer
    //通过form.verify()函数自定义校验规则。
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过value形参拿到的是确认密码框的内容
            // 还需要拿到密码框的值，
            let pwd = $('.reg-box [name = password]').val()
            // 然后进行一次等于的判断
            if (pwd != value) {
                // 如果判断失败，则return一个判断的消息
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起ajax的post请求
        var data = {username:$('#form-reg [name=username]').val(),password:$('#form-reg [name=password]').val() }
        $.post('/api/reguser',data,function(res){
            if(res.status !== 0){
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            // console.log('注册成功！');
            layer.msg('注册成功，请登录')
            // 模拟人的点击行为注册成功之后自动跳转到登录页面
           $('#link-login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form-login').submit(function(e){
         //阻止表单的默认提交行为
         e.preventDefault()
          $.ajax(
              {
                  url:'/api/login',
                  method:'post',
                  //快速获取表单里面的数据
                  data:$(this).serialize(),
                  success:function(res){
                      if(res.status !== 0){
                          return layer.msg('登录失败')
                      }
                      layer.msg('登录成功！')
                      //将登录成功得到的token字符串保存到localStroage中
                      localStorage.setItem('token',res.token)
                      //跳转到后台主页
                      location.href = '/index.html'
                  }
              }

          )

    })
})