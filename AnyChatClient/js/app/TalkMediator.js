function TalkMediator() {
    //webscoket对象
    this.webSocketClient;
    //聊天组map
    this.groupMap = [];
    //好友列表map
    this.userMap = [];
    //当前打开谁的对话框
    this.nowToObj;
    //自己的数据
    this.own;
    //在线好友数量
    this.onlineNum = 0;
    //好友数量
    this.userNum = 0;
    //每页几条
    this.pageSize = 20;
    //当前页数
    this.currentPage;
    //总页数
    this.totalPage;
    this.maxPage = 9999;
    //当前模块 1代表聊天 2代表聊天记录
    this.nowModule = 1;

    this.init = function (view) {
        //获取url传递过来的token
        var token = $T.getUrlParam.getUrlParam($T.httpConfig.TOKEN);
        if (token == null) {
            //token是空应该提示无法登陆
            return;
        }
        //设置cookie
        $T.cookieParam.setCookieParam($T.cookieName.TOKEN, token);
        //链接聊天服务器
        this.loginChatServer();
        //添加发送聊天信息的监听
        $("#sendChat").on("click", this.onSendChat);
        $(".history_P").on("click", this.onClickHistory);
        $("#firstPage").on("click", this.onFirstPage);
        $("#prePage").on("click", this.onPrePage);
        $("#nextPage").on("click", this.onNextPage);
        $("#lastPage").on("click", this.onLastPage);
        $("#returnChat").on("click", this.onReturnChat);
    }
    //链接聊天服务器
    this.loginChatServer = function () {
        this.logoutChatServer();

        this.webSocketClient = new WebSocketClient();
        this.webSocketClient.WebSocketClient($T.url.chat);
        this.webSocketClient.addEventListener($T.webSocketEventType.CONNECTED, this.onConnected, this);
        this.webSocketClient.addEventListener($T.webSocketEventType.CLOSE, this.onClose, this);
        $T.loginChatProxy.LoginChatProxy(this.webSocketClient);
    }
    //断开聊天服务器
    this.logoutChatServer = function () {
        if (this.webSocketClient != null) {
            this.webSocketClient.close();
            this.webSocketClient.removeEventListeners();
            this.webSocketClient = null;
        }
    }
    //链接成功后发送登陆请求
    this.onConnected = function (event) {
        $T.loginChatProxy.loginChat($T.cookieParam.getCookieParam($T.cookieName.TOKEN));
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [
        $T.notificationExt.LOGIN_CHAT_SERVER_SUCCESS,
        $T.notificationExt.CHAT_USER_ONLINE,
        $T.notificationExt.CHAT_USER_OFFLINE,
        $T.notificationExt.CHAT_USER_MESSAGE,
        $T.notificationExt.CHAT_GROUP_MESSAGE,
        $T.notificationExt.CHAT_KICK,
        $T.notificationExt.AGAIN_CONNECT,
        $T.notificationExt.GET_CHAT_LIST,
        $T.notificationExt.CHAT_TO_USER_MESSAGE];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.LOGIN_CHAT_SERVER_SUCCESS:
                this.LoginChatServerSuccess(data[0].body);
                break;
            case $T.notificationExt.CHAT_USER_ONLINE:
                this.userOnline(data[0].body);
                break;
            case $T.notificationExt.CHAT_USER_OFFLINE:
                this.userOffline(data[0].body);
                break;
            case $T.notificationExt.CHAT_USER_MESSAGE:
                this.onUserMessage(data[0].body);
                break;
            case $T.notificationExt.CHAT_GROUP_MESSAGE:
                this.onGroupMessage(data[0].body);
                break;
            case $T.notificationExt.CHAT_KICK:
                alert("你即将被踢下线");
                break;
            case $T.notificationExt.AGAIN_CONNECT:
                $T.loginChatProxy.loginChat($T.cookieParam.getCookieParam($T.cookieName.TOKEN));
                break;
            case $T.notificationExt.GET_CHAT_LIST:
                this.getChatListSuccess(data[0].body);
                break;
            case $T.notificationExt.CHAT_TO_USER_MESSAGE:
                this.onToUserMessage(data[0].body);
                break;
        }
    }
    this.onReturnChat = function () {
        $T.talkMediator.nowModule = 1;
        $(this).parents(".windowR_P.left2_P").hide().prev().show();
        //下拉滚动条
        $('.talkCon_P').mCustomScrollbar('scrollTo', 'bottom')
    }
    //好友上线的操作
    this.userOnline = function (body) {
        var userObj = this.userMap[body.chatUser.userId];
        //说明在好友列表里
        if (userObj != null) {
            userObj.user = body.chatUser;
            userObj.onLine();
            this.onlineNum++;
            $("#currentOnline").text(this.onlineNum);
            //设置靠前
            var childNodes = $("#talkUserList")[0].childNodes;
            var displayNode;
            for (var i = 0; i < childNodes.length; i++) {
                var node = childNodes[i];
                if (node.id != null) {
                    displayNode = node;
                    break;
                }
            }
            if (displayNode != null) {
                if (displayNode.id != userObj.user.userId) {
                    $("#" + displayNode.id).before($("#" + userObj.user.userId));
                }
            }
        } else {
            //说明是新进入公司的员工，需要加入好友列表
            var userObj = new UserObj();
            userObj.init(body.chatUser);
            this.userMap[body.chatUser.userId] = userObj;
            $("#talkUserList").prepend(userObj.view);
            userObj.addOptListener();
            userObj.addEventListener($T.chatObjEventType.OPEN_CHAT_OBJ, this.openChatObjHandle, this);
            this.onlineNum++;
            this.userNum++;
            $("#currentOnline").text(this.onlineNum);
            $("#allUser").text(this.userNum);
        }
    }
    //好友下线
    this.userOffline = function (body) {
        var userObj = this.userMap[body.userId];
        if (userObj != null) {
            userObj.user.isOnline = false;
            userObj.offLine();
            this.onlineNum--;
            $("#currentOnline").text(this.onlineNum);

            //设置靠后
            var childNodes = $("#talkUserList")[0].childNodes;
            var displayNode;
            for (var i = childNodes.length - 1; i >= 0; i--) {
                var node = childNodes[i];
                if (node.id != null) {
                    displayNode = node;
                    break;
                }
            }
            if (displayNode != null) {
                if (displayNode.id != userObj.user.userId) {
                    $("#" + displayNode.id).after($("#" + userObj.user.userId));
                }
            }
        } else {
            //这种情况不可能发生
        }

    }
    //登陆成功
    this.LoginChatServerSuccess = function (body) {
        //设置自己的信息
        this.own = body.chatUser;
        var firstGroup;
        //初始化聊天组
        if (body.chatGroupList != null) {
            for (var i = 0; i < body.chatGroupList.length; i++) {
                var userGroup = body.chatGroupList[i];
                var groupObj = new GroupObj();
                groupObj.init(userGroup);
                this.groupMap[userGroup.chatGroupId] = groupObj;
                $("#talkList").prepend(groupObj.view);
                groupObj.addOptListener();
                groupObj.addEventListener($T.chatObjEventType.OPEN_CHAT_OBJ, this.openChatObjHandle, this);
                //默认打开第一个聊天组
                if (i == 0) {
                    firstGroup = groupObj;
                }
            }
        }
        //初始化好友列表
        if (body.chatUserList != null) {
            for (var i = 0; i < body.chatUserList.length; i++) {
                var user = body.chatUserList[i];
                var userObj = new UserObj();
                userObj.init(user);
                this.userMap[user.userId] = userObj;
                if (user.isOnline) {
                    $("#talkUserList").prepend(userObj.view);
                } else {
                    $("#talkUserList").append(userObj.view);
                }

                userObj.addOptListener();
                userObj.addEventListener($T.chatObjEventType.OPEN_CHAT_OBJ, this.openChatObjHandle, this);
                if (user.isOnline) {
                    this.onlineNum++;
                }
            }
            //修改好友列表的数字
            $("#currentOnline").text(this.onlineNum);
            this.userNum = body.chatUserList.length;
            $("#allUser").text(this.userNum);
        }
        //默认打开第一个群聊天窗口
        this.nowToObj = firstGroup;
        this.nowToObj.view.addClass("on_P");
        $("#toTypeName").text(this.nowToObj.group.chatGroupName);
        $("#toTypeName2").text(this.nowToObj.group.chatGroupName);
    }
    //切换聊天对象
    this.openChatObjHandle = function (event) {
        //如果没变化，返回
        if (event.mTarget == this.nowToObj) {
            return;
        }
        //设置当前聊天对象，清空聊天记录
        this.nowToObj = event.mTarget;
        $("#chatList #mCSB_2_container")[0].innerHTML = "";
        //如果是用户
        if (event.mTarget.user != null) {
            $("#toTypeName").text(this.nowToObj.user.userRealName);
            this.openChat(event.mTarget.chatList);
            //修改聊天记录的
            $("#toTypeName2").text(this.nowToObj.user.userRealName);
        } else {
            //如果是聊天组
            $("#toTypeName").text(this.nowToObj.group.chatGroupName);
            this.openChat(event.mTarget.chatList);
            //修改聊天记录的
            $("#toTypeName2").text(this.nowToObj.group.chatGroupName);
        }
        //设置这个对象没有未读记录
        event.mTarget.view.removeClass("online_P");
        //如果聊天记录打开，需要切换聊天记录的内容
        if (this.nowModule == 2) {
            $T.talkMediator.getHistoryChatList($T.talkMediator.maxPage);
        }
    }
    //显示聊天信息
    this.openChat = function (chatList) {
        for (var i = 0; i < chatList.length; i++) {
            var chat = chatList[i];
            var view;
            //如果是自己则聊天内容在右边
            if (chat.userId == this.own.userId) {
                view = this.createOwnChat(chat);
            } else {
                view = this.createOtherUserChat(chat);
            }
            $("#chatList #mCSB_2_container").append(view);
        }
        //下拉滚动条
        $('.talkCon_P').mCustomScrollbar('scrollTo', 'bottom')
    }
    //他人的聊天显示
    this.createOtherUserChat = function (chat) {
        var view = document.createElement("div");
        var userObj = this.userMap[chat.userId];
        //var chatContent = chat.chatContent;
        view.className = "otherAsk_P";
        view.innerHTML = '<a href="javascript:;" class="perPic_P"><img src="' + $T.tokenProxy.getUserImg(userObj.user.userId) + '" alt=""/></a>' +
            '<dl>' +
            '<dt>' + userObj.user.userRealName + '</dt>' +
            '<dd><span>' + $T.expressionConvert.replace_symbol_to_image(chat.chatContent) + '</span></dd>' +
            '</dl>' +
            '<div class="clear"></div>';
        return $(view);
    }
    //自己的聊天显示
    this.createOwnChat = function (chat) {
        var view = document.createElement("div");
        view.className = "myAsk_P";
        view.innerHTML = '<a href="javascript:;" class="perPic_P"><img src="' + $T.tokenProxy.getUserImg(this.own.userId) + '" alt=""/></a>' +
            '<dl>' +
            '<dd><span>' + $T.expressionConvert.replace_symbol_to_image(chat.chatContent) + '</span></dd>' +
            '</dl>' +
            '<div class="clear"></div>';
        return $(view);
    }
    //用户发来消息时
    this.onUserMessage = function (body) {
        var showHaveMsg = true;
        //如果是当前聊天对象则直接显示
        if (this.nowToObj.user != null) {
            if (this.nowToObj.user.userId == body.userId) {
                this.openChat(body.message);
                showHaveMsg = false;
            }
        }
        //如果是不是当前聊天对象，增加新消息css
        if (showHaveMsg) {
            this.userMap[body.userId].view.addClass("online_P");
        }
        //加入历史聊天列表
        this.userMap[body.userId].chatList = this.userMap[body.userId].chatList.concat(body.message);
    }
    this.onToUserMessage = function (body) {
        //如果是当前聊天对象则显示
        if (this.nowToObj.user != null) {
            if (this.nowToObj.user.userId == body.toUserId) {
                this.openChat([body.message]);
            }
        }
        //加入历史聊天列表
        this.userMap[body.toUserId].chatList = this.userMap[body.toUserId].chatList.concat([body.message]);
    }
    this.onGroupMessage = function (body) {
        //如果是当前聊天对象则显示
        var showHaveMsg = true;
        if (this.nowToObj.group != null) {
            if (this.nowToObj.group.chatGroupId == body.chatGroupId) {
                this.openChat(body.message);
                showHaveMsg = false;
            }
        }
        //如果是不是当前聊天对象，增加新消息css
        if (showHaveMsg) {
            this.groupMap[body.chatGroupId].view.addClass("online_P");
        }
        //加入历史聊天列表
        this.groupMap[body.chatGroupId].chatList = this.groupMap[body.chatGroupId].chatList.concat(body.message);
    }
    //发送聊天
    this.onSendChat = function () {
        var chatContent = $(this).parents(".windowR_P").find(".ke-edit-iframe").contents().find(".ke-content").html();
        //chatContent = chatContent.replace(/&NBSP;/g,"");
        //chatContent = chatContent.replace(/&nbsp;/g, "");
        //火狐浏览器会在末尾添加一个<br>
        chatContent = chatContent.replace(/<br>/g, "");
        chatContent = $.trim(chatContent);
        // //将聊天记录中的图片替换成表情符号
        chatContent = $T.expressionConvert.replace_Image_to_symbol(chatContent);
        if (chatContent == null || chatContent == "") {
            return;
        }
        var toType;
        var toTypeId;
        if ($T.talkMediator.nowToObj.user != null) {
            toType = 1;
            toTypeId = $T.talkMediator.nowToObj.user.userId;
        } else {
            toType = 2;
            toTypeId = $T.talkMediator.nowToObj.group.chatGroupId;
        }
        $(this).parents(".windowR_P").find(".ke-edit-iframe").contents().find(".ke-content").html("");
        $T.loginChatProxy.sendMessage(chatContent, toType, toTypeId);
    }
    this.advanceTime = function (passedTime) {

    }
    this.onClickHistory = function () {
        $(".windowR_P.left2_P").show().prev().hide();
        $T.talkMediator.getHistoryChatList($T.talkMediator.maxPage);
        $T.talkMediator.nowModule = 2;
    }
    this.setNowTime = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var monthStr;
        if (month < 10) {
            monthStr = "0" + month;
        } else {
            monthStr = month;
        }
        var dateStr;
        var date = date.getDate();
        if (date < 10) {
            dateStr = "0" + date;
        } else {
            dateStr = date;
        }
        $("#historyTime").text(year + "-" + monthStr + "-" + dateStr);
    }
    this.createHistoryChat = function (chat) {
        var view = document.createElement("dl");
        var user;
        if (chat.userId == this.own.userId) {
            user = this.own;
        } else {
            user = this.userMap[chat.userId].user;
        }
        view.innerHTML = '<dt class="org_P">' + user.userRealName + ' ' + chat.chatCreateTime + '</dt>' +
            '<dd>' + $T.expressionConvert.replace_symbol_to_image(chat.chatContent) + '</dd>';
        return $(view);
    }
    this.getChatListSuccess = function (body) {
        this.currentPage = body.currentPage;
        this.totalPage = body.totalPage;
        $("#firstPage").removeClass("disabled_P");
        $("#prePage").removeClass("disabled_P");
        $("#nextPage").removeClass("disabled_P");
        $("#lastPage").removeClass("disabled_P");
        if (this.currentPage == this.totalPage || this.totalPage == null) {
            $("#nextPage").addClass("disabled_P");
            $("#lastPage").addClass("disabled_P");
        }
        if (this.currentPage == 1) {
            $("#firstPage").addClass("disabled_P");
            $("#prePage").addClass("disabled_P");
        }
        $("#histortChat").text("");
        if (body.message != null && body.message.length != 0) {
            for (var i = 0; i < body.message.length; i++) {
                var msg = body.message[i];
                var view = this.createHistoryChat(msg);
                $("#histortChat").append(view);
                if (i == 0) {
                    var chatCreateTime = msg.chatCreateTime;
                    var array = chatCreateTime.split(" ");
                    $("#historyTime").text(array[0]);
                }

            }
        } else {
            $T.talkMediator.setNowTime();
        }
    }
    this.onFirstPage = function () {
        $T.talkMediator.getHistoryChatList(1);
    }
    this.onPrePage = function () {
        $T.talkMediator.getHistoryChatList($T.talkMediator.currentPage - 1);
    }
    this.onNextPage = function () {
        $T.talkMediator.getHistoryChatList($T.talkMediator.currentPage + 1);
    }
    this.onLastPage = function () {
        $T.talkMediator.getHistoryChatList($T.talkMediator.maxPage);

    }
    this.getHistoryChatList = function (currentPage, chatCreateTime) {
        var toType;
        var toTypeId;
        if ($T.talkMediator.nowToObj.user != null) {
            toType = 1;
            toTypeId = $T.talkMediator.nowToObj.user.userId;
        } else {
            toType = 2;
            toTypeId = $T.talkMediator.nowToObj.group.chatGroupId;
        }
        $T.loginChatProxy.getMessage(toType, toTypeId, chatCreateTime, currentPage, $T.talkMediator.pageSize);
    }
    this.timeFun = function () {
        var height2 = $(window).height();
        if (height2 / 2 - 217 - 183 < 0) {
            return WdatePicker({
                onpicking: this.getDate,
                dateFmt: 'yyyy-MM-dd',
                skin: 'my',
                position: {left: 10, top: -8}
            })
        } else {
            return WdatePicker({
                onpicking: this.getDate,
                dateFmt: 'yyyy-MM-dd',
                skin: 'my',
                position: {left: 8, top: -205}
            })
        }
    }
    this.getDate = function () {
        var html = $dp.cal.getNewDateStr();
        $T.talkMediator.getHistoryChatList(null, html);
    }
}
$T.talkMediator = new TalkMediator();