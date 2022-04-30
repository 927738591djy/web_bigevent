$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义一个查询参数对象，将来请求数据时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章发布的状态
    }

    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                //使用模板引擎渲染页面的数据
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                console.log(htmlStr);
                $('tbody').html(htmlStr)
                layer.msg('获取文章列表数据成功')
                //调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                //调用模板引擎渲染分类的可选项
                layer.msg('获取分类数据成功')
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id]').html(htmlStr)
                // layui 的form的render(),通知layui重新渲染一次表单区域
                form.render()
            }

        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDafult()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //重新渲染文章表格的数据、
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laype的render方法渲染分页的结构
        laypage.render(
            {
                elem: 'pageBox',//分页容器的id
                count: total,//总数据条数
                limit: q.pagesize,//每页显示几条数据
                curr: q.pagenum,//设置默认选中的分页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5, 10],
                //分页发生切换时候触发jump回调
                //触发jump回调的方式有两种：1.点击页码时候 2.只要调用了laypage.render()方法就会触发
                jump: function (obj, first) {
                    //把最新的页码值，赋值到q这个查询参数对象中
                    q.pagenum = obj.curr
                    //把最新的条目数赋值到q的pagrsize里
                    q.pagesize = obj.limit
                    //根据最新的q获取对应的数据列表，并渲染表格
                    // initTable()
                    //可以通过first的值来判断是通过哪种方式触发的jump回调，如果first的值为true,证明是方式2触发的。否则是方式1
                    if (!first) {
                        initTable()
                    }
                }
            }
        )
    }

    //通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        //获取文章id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status !==0 ){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成后需要判断这一页中是否还有甚剩余的数据，如果没有剩余的数据了，则让页码之-1之后，重新调iniaTable()
                    if(len === 1){
                        //如果len的值等于1，证明删除完毕之后，页面上没有任何数据了
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1:q.pagenum - 1
                    }
                    initTable( )
                }
            })
            
            layer.close(index);
          });
    })


})