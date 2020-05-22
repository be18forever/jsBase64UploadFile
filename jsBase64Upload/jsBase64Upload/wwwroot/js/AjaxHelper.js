var AJAXHelper = {
    Get: function (fun, data, callback, thisobj, failcallback, async) {
        var data = {
            targetFunction: fun,
            data: JSON.stringify(data)
        };
        $.ajax({
            url: "/handler/JsonApi.ashx",//handler地址
            async: async == undefined ? true : async,
            dataType: "json",
            type: "POST",
            data: data,
            context: thisobj,
            success: function (res) {
                if (res != null && res.Error != null) {
                    //错误提示。使用当前项目的框架
                    //$.noty({ text: res.ErrorMsg, layout: "center", type: "alert", animateOpen: { opacity: "show" } });
                    error(res.Error);
                    failcallback(this);
                    //alert(res.Error);
                    //if (confirm('back to the login page?')) {
                    //    top.location.href = '/login.aspx';
                    //}
                } else {
                    callback(res, this);
                }
            },
            error: function (xmlHttpRequest, textStatus) {
                if (failcallback) {
                    failcallback(xmlHttpRequest, textStatus);
                } else {
                    alert("请求发生错误 状态码:" + xmlHttpRequest.status + " 状态:" + xmlHttpRequest.readyState + " 错误信息:" + textStatus)
                }
                //if (confirm('back to the login page?')) {
                //    top.location.href = '/login.aspx';
                //}
            }
        });
    },
    //同步的方法.一般用于传文件流啥的.非异步
    PostTo: function (fun, data) {
        var data = {
            targetFunction: fun,
            data: JSON.stringify(data)
        };
        var postres = $.ajax({
            url: "/handler/JsonApi.ashx",//handler地址
            async: false,
            dataType: "json",
            type: "POST",
            data: data,

            success: function (res) {
                if (res != null && res.Error != null) {
                    //错误提示。使用当前项目的框架
                    $.noty({ text: res.ErrorMsg, layout: "center", type: "alert", animateOpen: { opacity: "show" } });
                    failcallback(res);
                }
            }
        });
        return $.parseJSON(postres.responseText);
    }
};
this.window.AJAXHelper = AJAXHelper;