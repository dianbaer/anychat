(function (window) {
    if (!window.anychat) window.anychat = {};
    var chatObjEventType = window.anychat.chatObjEventType;
    var EventDispatcher = window.juggle.EventDispatcher;
    var GroupObj = function () {
        this.group = null;
        this.view = null;
        this.chatList = [];
        EventDispatcher.apply(this);
        this.init = function (group) {
            this.group = group;
            this.createView();
        };
        this.createView = function () {
            var view = document.createElement("li");
            view.className = "talkGroup_P";
            view.innerHTML = '<img src="image/groupIcon.png" alt=""/><span class="titleSty2_P">' + this.group.chatGroupName + '</span>';
            this.view = $(view);
        };
        this.addOptListener = function () {
            this.addClickListener(this, this.onClick);
        };
        this.addClickListener = function (groupObj, call) {
            var callFunc = function (event) {
                call.call(groupObj, event);
            };
            this.view.on("click", callFunc);
        };
        this.onClick = function (event) {
            $(".windowL_P li").removeClass("on_P");
            this.view.addClass("on_P");
            this.dispatchEventWith(chatObjEventType.OPEN_CHAT_OBJ);
        }
    };
    window.anychat.GroupObj = GroupObj;
})(window);