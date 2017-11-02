(function (window) {
    if (!window.anychat) window.anychat = {};
    var chatObjEventType = window.anychat.chatObjEventType;
    var EventDispatcher = window.juggle.EventDispatcher;
    var UserObj = function () {
        this.user = null;
        this.view = null;
        this.chatList = [];
        this.shadow = null;
        EventDispatcher.apply(this);
        //初始化
        this.init = function (user) {
            this.user = user;
            this.createView();
        };
        //创建显示对象
        this.createView = function () {
            var view = document.createElement("li");
            if (!this.user.isOnline) {
                view.className = "downLine_P";
            }
            var img;
            if (this.user.userImg === null || this.user.userImg === undefined) {
                img = "js/anychat/images/default.png";
            } else {
                img = this.user.userImg;
            }
            view.innerHTML = '<img src="' + img + '" alt=""/><span>' + this.user.userRealName + '</span>';
            this.view = $(view);
            this.view.attr("id", this.user.userId);
            this.shadow = $("<i class='shadow_P'></i>");
            if (!this.user.isOnline) {
                this.view.append(this.shadow);
            }
        };
        this.onLine = function () {
            this.view.removeClass("downLine_P");
            this.shadow.remove();
        };
        this.offLine = function () {
            this.view.addClass("downLine_P");
            this.view.append(this.shadow);
        };
        //添加监听
        this.addOptListener = function () {
            this.addClickListener(this, this.onClick);
        };
        this.addClickListener = function (userObj, call) {
            var callFunc = function (event) {
                call.call(userObj, event);
            };
            this.view.on("click", callFunc);
        };
        //点击是派发事件
        this.onClick = function (event) {
            $(".windowL_P li").removeClass("on_P");
            this.view.addClass("on_P");
            this.dispatchEventWith(chatObjEventType.OPEN_CHAT_OBJ);
        }
    };
    window.anychat.UserObj = UserObj;
})(window);