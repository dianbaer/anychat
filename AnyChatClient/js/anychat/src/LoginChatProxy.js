(function (window) {
    if (!window.anychat) window.anychat = {};
    var notificationExt = window.anychat.notificationExt;
    var webSocketEventType = window.juggle.webSocketEventType;
    var Proxy = window.juggle.Proxy;
    var LoginChatProxy = function () {
        Proxy.apply(this);
        this.url = null;
        this.webSocketClient = null;
        /**
         * 初始化，监听消息
         * @param webSocketClient
         */
        this.init = function (webSocketClient) {
            this.webSocketClient = webSocketClient;
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("2"), this.onLoginChatServer, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("3"), this.onUserOnline, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("4"), this.onUserOffline, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("6"), this.onUserMessage, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("7"), this.onGroupMessage, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("10"), this.onUserKick, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("11"), this.onAgainConnect, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("13"), this.onGetMessage, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("14"), this.onToUserMessage, this);
        };
        /**
         * 登录成功
         * @param event
         */
        this.onLoginChatServer = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.LOGIN_CHAT_SERVER_SUCCESS, event.mData));
        };
        /**
         * 好友上线
         * @param event
         */
        this.onUserOnline = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_USER_ONLINE, event.mData));
        };
        /**
         * 好友离线
         * @param event
         */
        this.onUserOffline = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_USER_OFFLINE, event.mData));
        };
        /**
         * 用户发来消息
         * @param event
         */
        this.onUserMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_USER_MESSAGE, event.mData));
            // 回复服务器，这些信息接收到了
            var data = event.mData;
            if (data.message !== null) {
                var messageId = [];
                for (var i = 0; i < data.message.length; i++) {
                    var message = data.message[i];
                    messageId.push(message.chatId);
                }
                this.sendUserMessageReceive(messageId, data.userId);
            }
        };
        /**
         * 组发来消息
         * @param event
         */
        this.onGroupMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_GROUP_MESSAGE, event.mData));
            // 回复服务器，这些信息收到了，只告诉服务器最后一条即可
            var data = event.mData;
            if (data.message !== null) {
                this.sendGroupMessageReceive(data.message[data.message.length - 1].chatId, data.chatGroupId);
            }
        };
        /**
         * 被踢下线
         * @param event
         */
        this.onUserKick = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_KICK, event.mData));
        };
        /**
         * 通知重新连接服务器
         * @param event
         */
        this.onAgainConnect = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.AGAIN_CONNECT, event.mData));
        };
        /**
         * 获取聊天记录
         * @param event
         */
        this.onGetMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.GET_CHAT_LIST, event.mData));
        };
        /**
         * 发给好友的消息，推送给自己
         * @param event
         */
        this.onToUserMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_TO_USER_MESSAGE, event.mData));
        };
        /**
         * 登录聊天服务器
         * @param token
         */
        this.loginChat = function (token) {
            var data = {
                "wsOpCode": 1,
                "token": token
            };
            this.webSocketClient.send(data);
        };
        /**
         * 推送消息
         * @param chatContent
         * @param toType
         * @param toTypeId
         */
        this.sendMessage = function (chatContent, toType, toTypeId) {
            var data = {
                "wsOpCode": 5,
                "chatContent": chatContent,
                "toType": toType,
                "toTypeId": toTypeId
            };
            this.webSocketClient.send(data);
        };
        /**
         * 获取聊天记录
         * @param toType
         * @param toTypeId
         * @param chatCreateTime
         * @param currentPage
         * @param pageSize
         */
        this.getMessage = function (toType, toTypeId, chatCreateTime, currentPage, pageSize) {
            var data = {
                "wsOpCode": 12,
                "toType": toType,
                "toTypeId": toTypeId,
                "chatCreateTime": chatCreateTime,
                "currentPage": currentPage,
                "pageSize": pageSize
            };
            this.webSocketClient.send(data);
        };
        /**
         * 收到某用户的消息
         * @param messageId
         * @param userId
         */
        this.sendUserMessageReceive = function (messageId, userId) {
            var data = {
                "wsOpCode": 8,
                "messageId": messageId,
                "userId": userId
            };
            this.webSocketClient.send(data);
        };
        /**
         * 收到组的消息
         * @param endChatId
         * @param chatGroupId
         */
        this.sendGroupMessageReceive = function (endChatId, chatGroupId) {
            var data = {
                "wsOpCode": 9,
                "endChatId": endChatId,
                "chatGroupId": chatGroupId
            };
            this.webSocketClient.send(data);
        }
    };
    window.anychat.loginChatProxy = new LoginChatProxy();
})(window);