function ChatMediator() {
    this.webSocketClient;
    this.isLoginSuccess = false;
    this.init = function (view) {
        $("#sendMessage").on("click", this.onSendMessage);
        $("#getMessage").on("click", this.onGetMessage);
    }
    // 注销方法
    this.dispose = function () {
        $("#sendMessage").on("click", this.onSendMessage);
        $("#getMessage").on("click", this.onGetMessage);
    }
    this.loginChatServer = function () {
        this.logoutChatServer();

        this.webSocketClient = new WebSocketClient();
        this.webSocketClient.WebSocketClient($T.url.chat);
        this.webSocketClient.addEventListener($T.webSocketEventType.CONNECTED, this.onConnected, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.CLOSE, this.onClose, this);
        $T.loginChatProxy.LoginChatProxy(this.webSocketClient);
    }
    this.logoutChatServer = function () {
        if (this.webSocketClient != null) {
            this.webSocketClient.close();
            this.webSocketClient.removeEventListeners();
            this.webSocketClient = null;
        }
    }
    this.onConnected = function (event) {
        this.appMessage("/***************************************/");
        this.appMessage("连接服务器成功，登陆中..");

        $T.loginChatProxy.loginChat($T.cookieParam.getCookieParam($T.cookieName.TOKEN));
    }
    this.appMessage = function (message) {
        $("#message").append("<div>" + message + "<div>");
    }
    this.onClose = function (event) {
        this.appMessage("/***************************************/");
        this.appMessage("与聊天服务器断开连接");
    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.LOGIN_CHAT_SERVER, $T.notificationExt.LOGIN_CHAT_SERVER_SUCCESS, $T.notificationExt.CHAT_USER_ONLINE, $T.notificationExt.CHAT_USER_OFFLINE, $T.notificationExt.CHAT_USER_MESSAGE, $T.notificationExt.CHAT_GROUP_MESSAGE, $T.notificationExt.CHAT_KICK, $T.notificationExt.AGAIN_CONNECT, $T.notificationExt.GET_CHAT_LIST];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.LOGIN_CHAT_SERVER:
                this.loginChatServer();
                break;
            case $T.notificationExt.LOGIN_CHAT_SERVER_SUCCESS:
                this.LoginChatServerSuccess(data[0].body);
                break;
            case $T.notificationExt.CHAT_USER_ONLINE:
                this.appMessage("/***************************************/");
                this.appMessage("用户上线用户id：" + data[0].body.chatUser.userId + ",isOnline:" + data[0].body.chatUser.isOnline);
                break;
            case $T.notificationExt.CHAT_USER_OFFLINE:
                this.appMessage("/***************************************/");
                this.appMessage("用户下线用户id：" + data[0].body.userId);
                break;
            case $T.notificationExt.CHAT_USER_MESSAGE:
                this.onUserMessage(data[0].body);
                break;
            case $T.notificationExt.CHAT_GROUP_MESSAGE:
                this.onGroupMessage(data[0].body);
                break;
            case $T.notificationExt.CHAT_KICK:
                this.appMessage("/***************************************/");
                this.appMessage("你即将被踢下线");
                break;
            case $T.notificationExt.AGAIN_CONNECT:
                $T.loginChatProxy.loginChat($T.cookieParam.getCookieParam($T.cookieName.TOKEN));
                this.appMessage("/***************************************/");
                this.appMessage("正在踢用户下线，重新登陆中...");
                break;
            case $T.notificationExt.GET_CHAT_LIST:
                this.getChatListSuccess(data[0].body);
                break;
        }
    }
    this.getChatListSuccess = function (body) {
        this.appMessage("/******************开始GET_CHAT_lIST_SUCCESS*********************/");
        this.appMessage("currentPage：" + body.currentPage + ",pageSize:" + body.pageSize + ",totalPage:" + body.totalPage + ",allNum:" + body.allNum + ",toType:" + body.toType + ",toTypeId:" + body.toTypeId);
        if (body.message != null) {
            for (var i = 0; i < body.message.length; i++) {
                var msg = body.message[i];
                this.appMessage("消息chatId:" + msg.chatId + ",chatContent:" + msg.chatContent + ",chatCreateTime:" + msg.chatCreateTime);
            }
        }
    }
    this.LoginChatServerSuccess = function (body) {
        this.isLoginSuccess = true;
        this.appMessage("/******************开始LOGIN_CHAT_SERVER_SUCCESS*********************/");
        this.appMessage("登陆成功...");
        this.appMessage("用户信息为userId：" + body.chatUser.userId + ",realname:" + body.chatUser.userRealName);
        if (body.chatUserList != null) {
            for (var i = 0; i < body.chatUserList.length; i++) {
                var user = body.chatUserList[i];
                this.appMessage("用户好友信息为userId：" + user.userId + ",realname:" + user.userRealName + "，isOnline：" + user.isOnline);
            }
        }
        if (body.chatGroupList != null) {
            for (var i = 0; i < body.chatGroupList.length; i++) {
                var userGroup = body.chatGroupList[i];
                this.appMessage("用户组信息为chatGroupId：" + userGroup.chatGroupId + ",groupname:" + userGroup.chatGroupName);
            }
        }
    }
    this.onUserMessage = function (body) {
        this.appMessage("/*****************开始CHAT_USER_MESSAGE**********************/");
        this.appMessage("用户发来消息userId:" + body.userId);
        if (body.message != null) {
            for (var i = 0; i < body.message.length; i++) {
                var msg = body.message[i];
                this.appMessage("消息chatId:" + msg.chatId + ",chatContent:" + msg.chatContent + ",chatCreateTime:" + msg.chatCreateTime);
            }

        }
    }
    this.onGroupMessage = function (body) {
        this.appMessage("/*****************开始CHAT_GROUP_MESSAGE**********************/");
        this.appMessage("组发来消息chatGroupId:" + body.chatGroupId);
        if (body.message != null) {
            for (var i = 0; i < body.message.length; i++) {
                var msg = body.message[i];
                this.appMessage("用户id：" + msg.userId + "消息chatId:" + msg.chatId + ",chatContent:" + msg.chatContent + ",chatCreateTime:" + msg.chatCreateTime);
            }

        }
    }

    this.onSendMessage = function () {
        var chatContent = $("#chatContent").val();
        var toType = $("#toType").val();
        var toTypeId = $("#toTypeId").val();
        $T.loginChatProxy.sendMessage(chatContent, toType, toTypeId);
    }
    this.onGetMessage = function () {

        var toType = $("#toType_get").val();
        var toTypeId = $("#toTypeId_get").val();
        var chatCreateTime = $("#chatCreateTime").val();
        var currentPage = $("#currentPage").val();
        var pageSize = $("#pageSize").val();
        $T.loginChatProxy.getMessage(toType, toTypeId, chatCreateTime, currentPage, pageSize);
    }

}
$T.chatMediator = new ChatMediator();