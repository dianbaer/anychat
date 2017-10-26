function IndexMediator() {
    this.init = function (view) {
        $("#loginUCenter").on("click", this.onLoginChat);
    }
    // 注销方法
    this.dispose = function () {
        $("#loginUCenter").on("click", this.onLoginChat);
    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.LOGIN_SUCCESS];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.LOGIN_SUCCESS:
                window.location.href = "talk.html?token=" + $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
                break;
        }
    }
    this.advanceTime = function (passedTime) {

    }
    this.onLoginChat = function () {
        var userName = $("#userName").val();
        var userPassword = $("#userPassword").val();
        $T.tokenProxy.getToken(userName, userPassword);
    }
}
$T.indexMediator = new IndexMediator();