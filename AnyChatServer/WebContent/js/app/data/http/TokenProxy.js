function TokenProxy() {
    this.NAME = "TokenProxy";
    this.getToken = function (userName, userPassword) {
        var data = {
            "hOpCode": 20,
            "userName": userName,
            "userPassword": userPassword
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.getTokenSuccess;
        sendParam.failHandle = this.getTokenFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.url = $T.url.url;
        $T.httpUtil.send(sendParam);
    }
    this.getTokenSuccess = function (result, sendParam) {
        $T.cookieParam.setCookieParam($T.cookieName.TOKEN, result.tokenId);
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.LOGIN_SUCCESS));
    }
    this.getTokenFail = function (result, sendParam) {

    }
    this.getUserImg = function (userId) {
        var data = {
            "hOpCode": 14,
            "userId": userId
        };
        var sendParam = new SendParam();
        sendParam.data = data;
        sendParam.url = $T.url.url;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.sendType = $T.httpConfig.SEND_TYPE_PACKET;
        sendParam.receiveType = $T.httpConfig.RECEIVE_TYPE_IMAGE;
        return $T.httpUtil.getRequestUrl(sendParam);
    }
}
$T.tokenProxy = new TokenProxy();