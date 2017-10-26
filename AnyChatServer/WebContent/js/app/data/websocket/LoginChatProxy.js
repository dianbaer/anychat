function LoginChatProxy() {
    this.webSocketClient;
    this.LoginChatProxy = function (webSocketClient) {
        this.webSocketClient = webSocketClient;
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("2"), this.onLoginChatServer, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("3"), this.onUserOnline, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("4"), this.onUserOffline, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("6"), this.onUserMessage, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("7"), this.onGroupMessage, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("10"), this.onUserKick, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("11"), this.onAgainConnect, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("13"), this.onGetMessage, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.getMessage("14"), this.onToUserMessage, this);
    }
    this.onLoginChatServer = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.LOGIN_CHAT_SERVER_SUCCESS, event.mData));
    }
    this.onUserOnline = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHAT_USER_ONLINE, event.mData));
    }
    this.onUserOffline = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHAT_USER_OFFLINE, event.mData));
    }
    this.onUserMessage = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHAT_USER_MESSAGE, event.mData));
        // 进行回复接受到了
        var data = event.mData;
        if (data.message != null) {
            var messageId = new Array();
            for (var i = 0; i < data.message.length; i++) {
                var message = data.message[i];
                messageId.push(message.chatId);
            }
            this.sendUserMessageReceive(messageId, data.userId);
        }

    }
    this.onToUserMessage = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHAT_TO_USER_MESSAGE, event.mData));
    }
    this.onGroupMessage = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHAT_GROUP_MESSAGE, event.mData));
        var data = event.mData;
        if (data.message != null) {
            this.sendGroupMessageReceive(data.message[data.message.length - 1].chatId, data.chatGroupId);
        }
        // 进行回复，接受到最后一条
    }
    this.onUserKick = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHAT_KICK, event.mData));
    }
    this.onAgainConnect = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.AGAIN_CONNECT, event.mData));
    }
    this.onGetMessage = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.GET_CHAT_LIST, event.mData));
    }
    this.loginChat = function (token) {
        var data = {
            "wsOpCode": 1,
            "token": token
        };
        this.webSocketClient.send(data);
    }
    this.sendMessage = function (chatContent, toType, toTypeId) {
        var data = {
            "wsOpCode": 5,
            "chatContent": chatContent,
            "toType": toType,
            "toTypeId": toTypeId
        };
        this.webSocketClient.send(data);
    }
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
    }
    this.sendUserMessageReceive = function (messageId, userId) {
        var data = {
            "wsOpCode": 8,
            "messageId": messageId,
            "userId": userId
        };
        this.webSocketClient.send(data);
    }
    this.sendGroupMessageReceive = function (endChatId, chatGroupId) {
        var data = {
            "wsOpCode": 9,
            "endChatId": endChatId,
            "chatGroupId": chatGroupId
        };
        this.webSocketClient.send(data);
    }
}
$T.loginChatProxy = new LoginChatProxy();