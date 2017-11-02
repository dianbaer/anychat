(function (window) {
    if (!window.anychat) window.anychat = {};
    var ChatObjEventType = function () {
        /**
         * 切换聊天对象
         * @type {string}
         */
        this.OPEN_CHAT_OBJ = "openChatObj";
    };
    window.anychat.chatObjEventType = new ChatObjEventType();
})(window);