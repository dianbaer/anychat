function IndexMediator() {
    this.isLoginSuccess = false;
    this.isChatInitComplete = false;
    this.init = function (view) {
        // 模块
        $T.moduleManager.loadModule("html/top.html", document.getElementById("index_top"), null, $T.topMediator);
        $T.moduleManager.loadModule("html/left.html", document.getElementById("index_left"), null, $T.leftMediator);
        $T.moduleManager.loadModule("html/body.html", document.getElementById("index_body"), null, $T.bodyMediator);
        $T.moduleManager.loadModule("html/chat.html", document.getElementById("index_chat"), null, $T.chatMediator);
        $T.moduleManager.loadModule("html/bottom.html", document.getElementById("index_bottom"), null, $T.bottomMediator);
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notification.MODULE_INIT_COMPLETE, $T.notificationExt.LOGIN_SUCCESS];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.LOGIN_SUCCESS:
                this.isLoginSuccess = true;
                this.loginChatServer();
                break;
            case $T.notification.MODULE_INIT_COMPLETE:
                if (data[0].body[0] == "html/chat.html") {
                    this.isChatInitComplete = true;
                    this.loginChatServer();
                }
                break;
        }
    }
    this.loginChatServer = function () {
        if (this.isChatInitComplete && this.isLoginSuccess) {
            $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.LOGIN_CHAT_SERVER));
        }
    }

}
$T.indexMediator = new IndexMediator();