# ScrollLoad
一个jquery滚动加载插件，该插件会绑定当前窗口或者指定容器的滚动事件（scroll），当滚动条滚动到底部时，会触发动作并向指定的url请求数据，客户端拿到数据之后可以进行渲染添加到页面上。

### 一、使用方法
###### 注意，使用时必须放在web站点下，不然会因为ajax跨域的问题导致不能请求数据，进而也不能调用nextPage方法。

---

#### 1.0 默认参数
```js
 var defaults = {
        url: '/data.json?pageIndex={{pageIndex}}',
        param: {},                          //附带的参数
        scrollContainer: window,            //要监听滚动条事件的容器，默认为window
        pageIndex: 1,                       //初始化时要加载的是第几页，默认为第一页
        isInitLoad: true,                   //是否在页面一显示就加载第一页数据，默认为加载
        isMakeEmpty: true,                  //当重新加载数据到一个容器中时，是否清空以前的数据，默认清空
        distantToBottom: 0,                 //当滚动条距离底部多少像素时触发加载事件
        loading: "#loading",                //加载提示的选择器
        loadingTips: '数据正在加载中...',     //数据正在加载时的提示
        finishTips: '数据已经全部加载完毕',   //数据加载完毕时的提示
        noDataTips: '暂无数据',              //没有数据时的提示
        noDataCondition: function (data) {  //需要使用者根据个人情况给出没有数据时的条件，参数为异步请求返回来的数据
        //1.如果没有数据请返回true，否则返回false，插件根据返回值来控制加载信息的提示
            if (data.status ===0 && data.result.list.length === 0 )
                return true;
            return false;
        },
        finishCondition: function (data) {//需要使用者根据个人情况给出数据加载完毕时的条件，参数为异步请求返回来的数据
        //2.如果有数据且数据已经加载完毕请返回true，否则返回false，插件根据返回值来控制加载信息的提示
            if (data.status === 0 && data.result.list.length === 0)
                return true;
            return false;
        },
        nextPage: function (data,$wrapper,currentPage) {//触发加载事件调用的方法，插件内部发送异步请求返回数据
            //data:异步返回的json数据
            //$wrapper:选择的要插入数据的容器 
            //currentPage:当前页码
        }
};
```

#### 1.1 起步
- 先在页面上定义一段html代码，作为数据渲染的容器（注意：并不是要监听滚动事件的容器），插件本身会把该容器传给用户，让用户把渲染到该容器中。

```html
<!DOCTYPE html>
<html lang="en">
<head>  
    <title>Demo</title>
</head>
<body>
    ...
    <div id="myList">
    </div>
    ...
    <script src="jquery.js"></script> <!--引入jquery-->
    <script src="jquery.scrollLoad-1.4.0.js"></script> <!--引入scrollLoad插件-->
</body>
</html>
```
- 按照如下方式去调用scrollLoad（注意：nextPage函数中传回来的$wrapper其实就是$('#myList')，这里传回是为了开发者方法使用而已）


```js
var scroll = $("#myList").scrollLoad({
    url: '/data.json?pageIndex={{pageIndex}}',
   
    nextPage: function (data, $wrapper, currentPage) {
   //这里拿到$wrapper可以进行dom操作，渲染数据
        var list = data.result.list;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var $item = $('<li>' + item.name + '</li>');
           $wrapper.append($item);
        }

    }
})
```
- 设置div的高度，使窗口出现滚动条，然后滑动滚动条到底部，nextPage函数会自动被调用，参数 data：异步请求返回的数据；$wrapper:当前选择的div容器；currentPage：当前加载的第几页的数据（滚动加载实际上就是分页加载的另一种形式）。
 

---

#### 1.2 loading提示
- 为插件加上设置loading参数的值可以显示加载提示信息，相应的html结构如下
```html
<body>
    ...
    <div id="myList">
    </div>
    <p id="#loading"></p>
    ...
    <script src="jquery.js"></script> <!--引入jquery-->
    <script src="jquery.scrollLoad-1.4.0.js"></script> <!--引入scrollLoad插件-->
</body>
```
- 为插件加上设置loading参数的值为#loading选择器
```js
var scroll = $("#myList").scrollLoad({
    url: '/data.json?pageIndex={{pageIndex}}',
    ...
    loading:'#loading',
    ...
    nextPage: function (data, $wrapper, currentPage) {
   //这里拿到$wrapper可以进行dom操作，渲染数据
        var list = data.result.list;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var $item = $('<li>' + item.name + '</li>');
           $wrapper.append($item);
        }

    }
})
```
- 默认loading提示为文字提示，如下所示，通过覆盖这些参数的值可以支持自定义提示，支持html结构。
```js
var scroll = $("#myList").scrollLoad({
        ...
        loadingTips: '数据正在加载中...',     //数据正在加载时的提示
        finishTips: '数据已经全部加载完毕',   //数据加载完毕时的提示
        noDataTips: '暂无数据',              //没有数据时的提示
        ...
        
        loadingTips: '<img src="loading.gif">',     //覆盖为自定义的html标签
    } 
})
```

---
#### 1.3 自定义要监听的容器
- 插件默认监听的是当前窗口window，当然你也可以监听某个div容器，插件只会捕捉该div的滚动条滚动事件，并在滚动条到达底部时触发ajax请求并在完成时调用nextPage函数。
```js
var scroll = $("#myList").scrollLoad({
        url: '/data.json?pageIndex={{pageIndex}}',
        ...                   
        scrollContainer: window,            //要监听滚动条事件的容器，默认为window
        ...     
        scrollContainer: '#container',     //修改自定义的要监听的容器
    }
})
```
---
#### 1.4 额外的参数传递
- 当需要在url里边传递一下额外的参数时，可以设置插件的param参数的值，它是一个对象，插件内部会把对象的值自动序列化为查询字符串附带到url上。

```js

var user = $('#username').val();

var scroll = $("#myList").scrollLoad({
        url: '/data.json?pageIndex={{pageIndex}}',
        ...                   
        param: {},            //默认的值为一个空对象
        ...     
        param: {
            type:1,
            state:'action', //添加额外的参数
            user:function(){
                return 
            }
        },  
    }
})
```
- 上述传递参数的参数都是静态不变的，当然你可以传递动态获取的参数的值。比如下边一个例子：当你想从界面上获取一个参数的值，但是他有可能改变时，你就可以用这种方法。
```js
var userType = ''; //这里的userType可能随着你的点击的不同而变化

$('#btn1,#btn2').click(function(){
            userType = $(this).data('userType');
});

var scroll = $("#myList").scrollLoad({
        url: '/data.json?pageIndex={{pageIndex}}',
        ...                   
        param: {},            //默认的值为一个空对象
        ...     
        param: {
           
            userType:function(){
                return  userType //此时需要通过函数的形式传递才能实时获取参数值的变化
            }
        },  
    }
})
```
---
#### 1.5 配置数据状态的条件
- 插件内部会根据两个函数的返回值来控制界面上loading提示的显示和隐藏，所以使用的时候必须要给出这两个函数的实现，用户根据返回数据的内容给出条件的返回值。
```js
 var defaults = {
        url: '/data.json?pageIndex={{pageIndex}}',
                 
        noDataCondition: function (data) {  
        //1.如果没有数据请返回true，否则返回false，插件根据返回值来控制加载信息的提示
            if (data.status ===0 && data.result.list.length === 0 )
                return true; //这里根据我自己返回的数据，当状态为0企鹅数据list的长度为0时表示没有数据
            return false;
        },
        finishCondition: function (data) {//需要使用者根据个人情况给出数据加载完毕时的条件，参数为异步请求返回来的数据
        //2.如果有数据且数据已经加载完毕请返回true，否则返回false，插件根据返回值来控制加载信息的提示
            if (data.status === 0 && data.result.pageIndex > 1 && 
            data.result.list.length < pageSize)
                return true;//这里我根据页码大于一且返回的数据长度小于pageSize时，说明是有数据，但是加载完了，
            return false;
        },
        nextPage: function (data,$wrapper,currentPage) {//触发加载事件调用的方法，插件内部发送异步请求返回数据
            //data:异步返回的json数据
            //$wrapper:选择的要插入数据的容器 
            //currentPage:当前页码
        }
};
```
---
#### 1.6 其他参数
- 可以根据自己的需求自定义配置
```js
var defaults = {
        url: '/data.json?pageIndex={{pageIndex}}',
    
        pageIndex: 1,                       //初始化时要加载的是第几页，默认为第一页,可以自定义初始加载某一页
        isInitLoad: true,                   //是否在页面一显示就加载第一页数据，默认为加载
        isMakeEmpty: true,                  //当重新加载数据到一个容器中时，是否清空以前的数据，默认清空
        distantToBottom: 100,                 //当滚动条距离底部100像素时触发加载事件
 
};
```
### 二、公开的方法
- 插件内部提供了部分公共方法，可以使用插件的返回值来调用。
```js
var scroll = $("#myList").scrollLoad({
        url: '/data.json?pageIndex={{pageIndex}}',
        ...                   
    }
})

scroll.reload(); //reload公开方法，该方法调用后会清空$wrapper的内容并且重新加载第一页的数据。

scroll.options(); // options方法，该方法调用后返回当前的配置项。
```
### 三、关于作者
- 如果有什么疑问，可以联系作者QQ 526457385，也欢迎批评指正，欢迎Fork。