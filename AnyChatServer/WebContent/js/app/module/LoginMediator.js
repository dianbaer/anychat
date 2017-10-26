function LoginMediator() {

    this.init = function (view) {
        $("#loginUCenter").on("click", this.onLoginChat);

    }
    // 注销方法
    this.dispose = function () {

        $("#loginUCenter").on("click", this.onLoginChat);
    }
    // 关心消息数组
    this.listNotificationInterests = [];
    // 关心的消息处理
    this.handleNotification = function (data) {

    }
    this.onLoginChat = function () {
        var userName = $("#userName").val();
        var userPassword = $("#userPassword").val();
        $T.tokenProxy.getToken(userName, userPassword);
    }
}
$T.loginMediator = new LoginMediator();