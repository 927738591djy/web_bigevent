$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateLit()
    //获取文章分类列表
    function initArtCateLit() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);文章列表数据都在res的data属性里面

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open(
            {
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            }
        )
    })

    //通过代理的形式把form表单绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateLit()
                layer.msg('新增分类成功')
                //根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }

        })
    })

    var indexEdit = null
    //通过代理的形式给编辑按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open(
            {
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            }
        )
        //点到那个编辑按钮，获取到哪个的id
        var id = $(this).attr('data-id')
        // console.log(id);
        // 根据 Id 获取文章分类数据
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
               form.val('form-edit',res.data)
            }

        })
    })

    //通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                 return layer.msg('更新表单数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateLit()
            }
        })
    })

    //通过代理的形式为每个删除按钮绑定点击事件
    $('body').on('click','.btn-delete',function(){
        var id = $(this).attr('data-id')
       //提示用户是否要删除，弹出层
       layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
        //根据 Id 删除文章分类
        $.ajax({
            method:'GET',
            url:'/my/article/deletecate/'+id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('删除分类失败')
                }
                layer.msg('删除分类成功')
                layer.close(index)
                initArtCateLit()

            }

        })
        
       
      });
    })
})