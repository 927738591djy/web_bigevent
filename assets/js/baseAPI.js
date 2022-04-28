//注意：每次调用$.get(),$.post(),$.ajax()的时候会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象options
$.ajaxPrefilter(function(options){
//在发起真正的Ajax请求之前，统一拼接请求的路径。
options.url = 'http://www.liulongbin.top:3007' + options.url
// 统一为有权限的接口，设置headers请求头
if(options.url.indexOf('/my/') !== -1){
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
    }
}
console.log(options.url);
})