(function (window) {
    if (!window.juggle) window.juggle = {};
    var HttpEventType = function () {
        this.ERROR = "error";
        this.SUCCESS = "success";
    };
    window.juggle.httpEventType = new HttpEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var EventDispatcher = window.juggle.EventDispatcher;
    var httpEventType = window.juggle.httpEventType;
    var HttpClient = function () {
        EventDispatcher.apply(this);
        this.send = function (data, url, header, type, isAsync) {
            this.data = data;
            this.url = url;
            this.header = header;
            var xMLHttpRequest = new XMLHttpRequest();
            if (xMLHttpRequest === null || xMLHttpRequest === undefined) {
                return false;
            }
            if (isAsync === null || isAsync === undefined) {
                isAsync = true;
            }
            if (type === null || type === undefined) {
                if (data === null || data === undefined) {
                    type = "get";
                } else {
                    type = "post";
                }
            }
            this.type = type;
            this.isAsync = isAsync;
            xMLHttpRequest.open(type, url, isAsync);
            for (var headName in header) {
                xMLHttpRequest.setRequestHeader(headName, header[headName]);
            }
            this.addHttpListener(this, xMLHttpRequest, this.sendReturn, data);
            if (type === "post") {
                xMLHttpRequest.setRequestHeader('Content-Type', 'application/json');
                xMLHttpRequest.send(JSON.stringify(data));
            } else {
                xMLHttpRequest.send();
            }
        };
        this.addHttpListener = function (httpClient, xMLHttpRequest, sendReturn, data) {
            var onReadyStateHandle = function (event) {
                sendReturn.call(httpClient, xMLHttpRequest, event, data);
            };
            xMLHttpRequest.onreadystatechange = onReadyStateHandle;
        };
        this.sendReturn = function (xMLHttpRequest, event, data) {
            if (xMLHttpRequest.readyState === 4) {
                if (xMLHttpRequest.status === 200) {
                    //派发请求成功返回数据
                    this.dispatchEventWith(httpEventType.SUCCESS, false, xMLHttpRequest.responseText);
                } else {
                    //派发请求错误
                    this.dispatchEventWith(httpEventType.ERROR);
                }
            }
        };
        this.sendFile = function (fileList, data, url, header, type, isAsync) {
            this.data = data;
            this.url = url;
            this.header = header;
            var xMLHttpRequest = new XMLHttpRequest();
            if (xMLHttpRequest === null || xMLHttpRequest === undefined) {
                return false;
            }
            if (isAsync === null || isAsync === undefined) {
                isAsync = true;
            }
            if (type === null || type === undefined) {
                type = "post";
            }
            this.type = type;
            this.isAsync = isAsync;
            xMLHttpRequest.open(type, url, isAsync);
            for (var headName in header) {
                xMLHttpRequest.setRequestHeader(headName, header[headName]);
            }
            this.addHttpListener(this, xMLHttpRequest, this.sendReturn, data);
            var form = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                var file = fileList[i];
                form.append("file" + i, file);
            }
            if (data !== null && data !== undefined) {
                for (var key in data) {
                    form.append(key, data[key]);
                }
            }
            xMLHttpRequest.send(form);
        }
    };
    window.juggle.HttpClient = HttpClient;
})(window);
