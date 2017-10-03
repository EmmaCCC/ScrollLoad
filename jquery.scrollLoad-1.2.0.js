//author:Emma
//date:201709.24
//name:scrollLoad 滚动加载插件
//version:1.3.0


; (function ($, window, document, undefined) {
    //构造函数
    var ScrollLoad = function (ele, opts) {
        this._init(ele, opts);
    };

    ScrollLoad.prototype = {
        //私有方法
        _init: function (ele, opts) {
            //初始化数据
            var defaults = {
                url: '/data.json?pageIndex={{pageIndex}}',
                param: {},                          //附带的参数
                scrollContainer: window,            //要监听滚动条事件的容器，默认为window
                pageIndex: 1,                       //初始化时要加载的是第几页，默认为第一页
                isInitLoad: true,                   //是否在页面一显示就加载第一页数据，默认为加载
                isMakeEmpty: true,                  //当重新加载到一个容器中时，是否清空以前的数据，默认清空
                distantToBottom: 0,                 //当滚动条距离底部多少像素时出发加载事件
                loading: "#loading",                //加载提示的选择器
                loadingTips: "数据正在加载中...",     //数据正在加载时的提示
                finishTips: "数据已经全部加载完毕",   //数据加载完毕时的提示
                noDataTips: "暂无数据",              //没有数据时的提示
                noDataCondition: function (data) {  //需要使用者给出没有数据时的条件，参数为异步请求返回来的数据
                    if (data.status === 0 && data.result.pageIndex === 0)
                        return true;
                    return false;
                },
                finishCondition: function (data) {//需要使用者给出数据加载完毕时的条件，参数为异步请求返回来的数据
                    if (data.status === 0 && data.result.list.length === 0)
                        return true;
                    return false;
                },
                nextPage: function (data,$wrapper,currentPage) {//触发加载事件调用的方法，插件内部发送异步请求返回数据
                    //data:异步返回的json数据
                    //选择的要插入数据的容器 
                    //当前页码
                }
            };

            this.$element = ele;
            this.isBusy = false;
            this.isFinish = false;
            this.settings = $.extend({}, defaults, opts);
            this.currentPage = this.settings.pageIndex;
            this.$loading = $(this.settings.loading);
            this.$loading.hide();

            if (this.settings.isMakeEmpty) {
                this.$element.empty();
                this.currentPage = 1;
            } else {
                this.currentPage = this.$element.data('currentPage') || 1;
            }
            if (this.settings.isInitLoad) {
                this._loadData();
            }
            var _this = this;

            $(this.settings.scrollContainer).off('scroll');

            $(this.settings.scrollContainer).scroll(function () {
                var $this = $(this);
                if (this === window) {
                    if ($(document).height() - $(window).height() - $(document).scrollTop() <= _this.settings.distantToBottom) {
                    console.log($(document).height(), $(window).height(), $(document).scrollTop());
                        _this._loadData();

                    }
                } else {
                    var viewHeight = $this.height();//可见高度
                    var contentHeight = $this.get(0).scrollHeight; //内容高度

                    var scrollTop = $this.scrollTop();//滚动高度
                    console.log(viewHeight, contentHeight, scrollTop);

                    if (contentHeight - viewHeight - scrollTop <= _this.settings.distantToBottom) { //到达底部100px时,加载新内容
                        _this._loadData();
                    }

                }


            });


        },

        _loadData: function (fn) {
            if (this.isBusy || this.isFinish) {
                return;
            }
            this.isBusy = true;
            this.$loading.show().html(this.settings.loadingTips);
            var _self = this;
            var url = this.settings.url.replace('{{pageIndex}}', this.currentPage);

            $.ajax({
                type: "GET",
                url: url,
                data: this.settings.param,
                dataType: "json",
                success: function (data) {
                    _self.isBusy = false;
                    _self.$loading.hide();
                    if (data) {
                        if (_self.settings.noDataCondition(data)) {
                            _self.isFinish = true;
                            _self.$loading.show().html(this.settings.noDataTips);
                           
                        }

                        if (_self.settings.finishCondition(data)) {
                            _self.isFinish = true;
                            _self.$loading.show().html(this.settings.finishTips);
                          
                        }
                        _self.currentPage++;
                        //wrapper存储上一次的页码 当切换两个或者多个容器时可以用到 记录每个容器加载到第几页了
                        _self.$element.data('currentPage', _self.currentPage);
                        _self.settings.nextPage(data, _self.$element, _self.currentPage);
                    } else {
                        throw Error('data is ' + data);
                    }
                }
            });


        },

        Options: function () {
            return this.settings;
        }
    }

    $.fn.scrollLoad = function (opts) {
        var scroll = new ScrollLoad(this, opts);
        return scroll;
    }

})($, window, document);


//var scroll = $("#myList").scrollLoad({
//    url: '/data.json?pageIndex={{pageIndex}}',
//    param: {
//        type: type,
//        state: 1
//    },
//    loading: "#loading",
//    nextPage: function (data, $wrapper, currentPage) {
//        var list = data.result.list;
//        for (var i = 0; i < list.length; i++) {
//            var item = list[i];
//            var $item = $('<li>' + item.name + '</li>')
//            $wrapper.append($item);
//        }

//    }
//})