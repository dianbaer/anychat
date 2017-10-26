function LeftMediator() {

    this.init = function (view) {

        $("#left_button").on("click", this.onClick);

    }
    // 注销方法
    this.dispose = function () {
        $("#left_button").remove("click", this.onClick);

    }
    // 关心消息数组
    this.listNotificationInterests = [];
    // 关心的消息处理
    this.handleNotification = function (data) {

    }
    this.onClick = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHANGE_BODY, "login"));
    }

}
$T.leftMediator = new LeftMediator();