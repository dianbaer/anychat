function BodyMediator() {

    this.init = function (view) {

        $T.moduleManager.loadModule("html/login.html", document.getElementById("body"), "bodyview", $T.loginMediator);
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.CHANGE_BODY];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.CHANGE_BODY:
                if (data[0].body == "login") {
                    $T.moduleManager.loadModule("html/login.html", document.getElementById("body"), "bodyview", $T.loginMediator);
                }
                break;
        }
    }
}
$T.bodyMediator = new BodyMediator();