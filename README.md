# ScrollLoad
一个jquery滚动加载插件


```
var scroll = $("#myList").scrollLoad({
    url: '/data.json?pageIndex={{pageIndex}}',
    param: {
        type: type,
        state: 1
    },
    loading: "#loading",
    nextPage: function (data, $wrapper, currentPage) {
        var list = data.result.list;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
             var $item = $('<li>' + item.name + '</li>');
           $wrapper.append($item);
        }

    }
})
```
