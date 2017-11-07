(function (window) {
    if (!window.juggle) window.juggle = {};
    var WebSocketEventType = function () {
        // 链接完成
        this.CONNECTED = "connected";
        // 关闭
        this.CLOSE = "close";
        // 接到消息
        this.WSMESSAGE = "wsmessage";
        this.getMessage = function (wsOpCode) {
            return this.WSMESSAGE + "_" + wsOpCode;
        }
    };
    window.juggle.webSocketEventType = new WebSocketEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var WebSocketConfig = function () {
        this.WSOPCODE = "wsOpCode";// 操作码
    };
    window.juggle.webSocketConfig = new WebSocketConfig();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var EventDispatcher = window.juggle.EventDispatcher;
    var webSocketEventType = window.juggle.webSocketEventType;
    var webSocketConfig = window.juggle.webSocketConfig;
    /**
     * 创建websocket客户端
     * @param url
     * @constructor
     */
    var WebSocketClient = function (url) {
        this.webSocket = null;
        this.isConnected = false;
        this.url = url;
        this.connect = function () {
            //创建链接
            this.webSocket = new WebSocket(this.url);
            //关注状态
            this.onOpenListener(this, this.onOpen);
            this.onCloseListener(this, this.onClose);
            this.onErrorListener(this, this.onError);
            this.onMessageListener(this, this.onMessage);
        };
        this.onOpenListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onopen = callFunc;

        };
        this.onCloseListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onclose = callFunc;

        };
        this.onErrorListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onerror = callFunc;

        };
        this.onMessageListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onmessage = callFunc;

        };
        /**
         * 链接成功设置状态，派发事件
         * @param event
         */
        this.onOpen = function (event) {
            this.isConnected = true;
            this.dispatchEventWith(webSocketEventType.CONNECTED);
        };
        /**
         * 发送数据
         * @param data json格式的
         */
        this.send = function (data) {
            if (!this.isConnected) {
                alert("未链接至websocket服务器");
                return;
            }
            var blob = new Blob([JSON.stringify(data)]);
            this.webSocket.send(blob);
        };
        /**
         * 接到消息派发不同类型消息的事件
         * @param event
         */
        this.onMessage = function (event) {
            var data = JSON.parse(event.data);
            if (data[webSocketConfig.WSOPCODE] === null || data[webSocketConfig.WSOPCODE] === undefined) {
                return;
            }
            this.dispatchEventWith(webSocketEventType.getMessage(data[webSocketConfig.WSOPCODE]), false, data);
        };
        /**
         * 关闭时设置状态并且派发事件
         * @param event
         */
        this.onClose = function (event) {
            this.isConnected = false;
            this.dispatchEventWith(webSocketEventType.CLOSE);
        };
        this.onError = function (event) {

        };
        /**
         * 主动关闭
         */
        this.close = function () {
            this.webSocket.close();
        };
        EventDispatcher.apply(this);
        this.connect();
    };
    window.juggle.WebSocketClient = WebSocketClient;
})(window);