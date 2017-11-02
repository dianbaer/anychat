(function (window) {
    if (!window.anychat) window.anychat = {};
    var NotificationExt = function () {
        /**
         * 登录成功
         * @type {string}
         */
        this.LOGIN_CHAT_SERVER_SUCCESS = "loginChatServerSuccess";
        /**
         * 用户上线
         * @type {string}
         */
        this.CHAT_USER_ONLINE = "chatUserOnline";
        /**
         * 用户离线
         * @type {string}
         */
        this.CHAT_USER_OFFLINE = "chatUserOffline";
        /**
         * 接到用户信息
         * @type {string}
         */
        this.CHAT_USER_MESSAGE = "chatUserMessage";
        /**
         * 接到组信息
         * @type {string}
         */
        this.CHAT_GROUP_MESSAGE = "chatGroupMessage";
        /**
         * 被踢下线
         * @type {string}
         */
        this.CHAT_KICK = "chatKick";
        /**
         * 通知再重新登录
         * @type {string}
         */
        this.AGAIN_CONNECT = "againConnect";
        /**
         * 获取聊天记录
         * @type {string}
         */
        this.GET_CHAT_LIST = "getChatList";
        /**
         * 接到自己发给别人的信息
         * @type {string}
         */
        this.CHAT_TO_USER_MESSAGE = "chatToUserMessage";
    };
    window.anychat.notificationExt = new NotificationExt();
})(window);