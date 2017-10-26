function UserObj() {
    this.user;
    this.view;
    this.chatList = [];
    this.shadow;
    //初始化
    this.init = function (user) {
        this.user = user;
        this.createView();
        EventDispatcher.apply(this);
    }
    //创建显示对象
    this.createView = function () {
        var view = document.createElement("li");
        if (!this.user.isOnline) {
            view.className = "downLine_P";
        }
        view.innerHTML = '<img src="' + $T.tokenProxy.getUserImg(this.user.userId) + '" alt=""/><span>' + this.user.userRealName + '</span>';
        this.view = $(view);
        this.view.attr("id", this.user.userId);
        this.shadow = $("<i class='shadow_P'></i>");
        if (!this.user.isOnline) {
            this.view.append(this.shadow);
        }
    }
    this.onLine = function () {
        this.view.removeClass("downLine_P");
        this.shadow.remove();
    }
    this.offLine = function () {
        this.view.addClass("downLine_P");
        this.view.append(this.shadow);
    }
    //添加监听
    this.addOptListener = function () {
        this.addClickListener(this, this.onClick);
    }
    this.addClickListener = function (userObj, call) {
        var callFunc = function (event) {
            call.call(userObj, event);
        }
        this.view.on("click", callFunc);

    }
    //点击是派发事件
    this.onClick = function (event) {
        $(".windowL_P li").removeClass("on_P");
        this.view.addClass("on_P");
        this.dispatchEventWith($T.chatObjEventType.OPEN_CHAT_OBJ);
    }
}