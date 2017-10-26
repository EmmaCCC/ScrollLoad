# ScrollLoad
一个jquery滚动加载插件，该插件会绑定当前窗口或者指定容器的滚动事件（scroll），当滚动条滚动到底部时，会触发动作并向指定的url请求数据，客户端拿到数据之后可以进行随意的渲染到页面上。

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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
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
- 设置div的高度，是窗口出现滚动条，然后滑动滚动条到底部，nextPage函数会自动被调用，参数 data：异步请求返回的数据；$wrapper:当前选择的div容器；currentPage：当前加载的第几页的数据（滚动加载实际上就是分页加载的另一种形式）。
 

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
```js
var scroll = $("#myList").scrollLoad({
    url: '/data.json?pageIndex={{pageIndex}}',
    loading:'#loading',
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
- 默认loading提示为文字提示，如下所示，通过覆盖这些参数的值可以支持自定义提示，并且支持html结构。
```js
  var defaults = {
        ...
        loadingTips: '数据正在加载中...',     //数据正在加载时的提示
        finishTips: '数据已经全部加载完毕',   //数据加载完毕时的提示
        noDataTips: '暂无数据',              //没有数据时的提示
        ...
        
        loadingTips: '<img src="loading.gif">',     //覆盖为自定义的html标签
};
```

---
#### 1.3 自定义要监听的容器
- 插件默认监听的是当前窗口，当然你也可以监听某个div容器，插件只会捕捉该div的滚动条滚动事件，并在滚动条到达底部时触发ajax请求并在完成时nextPage函数。
- 
```js
  var defaults = {
        url: '/data.json?pageIndex={{pageIndex}}',
        ...                   
        scrollContainer: window,            //要监听滚动条事件的容器，默认为window
        ...     
        scrollContainer: '#container',     //修改自定义的要监听的容器
};
```
