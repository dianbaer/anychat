(function (window) {
    if (!window.anychat) window.anychat = {};
    var chatObjEventType = window.anychat.chatObjEventType;
    var getUrlParam = window.anychat.getUrlParam;
    var notificationExt = window.anychat.notificationExt;
    var loginChatProxy = window.anychat.loginChatProxy;
    var GroupObj = window.anychat.GroupObj;
    var UserObj = window.anychat.UserObj;
    var Mediator = window.juggle.Mediator;
    var WebSocketClient = window.juggle.WebSocketClient;
    var webSocketEventType = window.juggle.webSocketEventType;
    var TalkMediator = function () {
        //webscoket对象
        this.webSocketClient = null;
        //聊天组map
        this.groupMap = [];
        //好友列表map
        this.userMap = [];
        //当前打开谁的对话框
        this.nowToObj = null;
        //自己的数据
        this.own = null;
        //在线好友数量
        this.onlineNum = 0;
        //好友数量
        this.userNum = 0;
        //每页几条
        this.pageSize = 20;
        //当前页数
        this.currentPage = 0;
        //总页数
        this.totalPage = 0;
        this.maxPage = 9999;
        //当前模块 1代表聊天 2代表聊天记录
        this.nowModule = 1;
        this.token = null;
        this.initView = function (view) {
            //获取url传递过来的token
            this.token = getUrlParam.getUrlParam("token");
            if (this.token === null) {
                //token是空应该提示无法登陆
                return;
            }
            //链接聊天服务器
            this.loginChatServer();
            //添加发送聊天信息的监听
            this.addSendChat(this, this.onSendChat);
            this.addHistory(this, this.onClickHistory);
            this.addFirstPage(this, this.onFirstPage);
            this.addPrePage(this, this.onPrePage);
            this.addNextPage(this, this.onNextPage);
            this.addLastPage(this, this.onLastPage);
            this.addReturnChat(this, this.onReturnChat);
        };
        this.addSendChat = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $("#sendChat").on("click", callFunc);
        };
        this.addHistory = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $(".history_P").on("click", callFunc);
        };
        this.addFirstPage = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $("#firstPage").on("click", callFunc);
        };
        this.addPrePage = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $("#prePage").on("click", callFunc);
        };
        this.addNextPage = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $("#nextPage").on("click", callFunc);
        };
        this.addLastPage = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $("#lastPage").on("click", callFunc);
        };
        this.addReturnChat = function (mediator, call) {
            var callFunc = function (event) {
                call.call(mediator, event);
            };
            $("#returnChat").on("click", callFunc);
        };
        //链接聊天服务器
        this.loginChatServer = function () {
            this.logoutChatServer();

            this.webSocketClient = new WebSocketClient(loginChatProxy.url);
            this.webSocketClient.addEventListener(webSocketEventType.CONNECTED, this.onConnected, this);
            this.webSocketClient.addEventListener(webSocketEventType.CLOSE, this.onClose, this);
            loginChatProxy.init(this.webSocketClient);
        };
        //断开聊天服务器
        this.logoutChatServer = function () {
            if (this.webSocketClient !== null) {
                this.webSocketClient.close();
                this.webSocketClient.removeEventListeners();
                this.webSocketClient = null;
            }
        };
        //链接成功后发送登陆请求
        this.onConnected = function (event) {
            loginChatProxy.loginChat(this.token);
        };
        // 关心消息数组
        this.listNotificationInterests = [
            notificationExt.LOGIN_CHAT_SERVER_SUCCESS,
            notificationExt.CHAT_USER_ONLINE,
            notificationExt.CHAT_USER_OFFLINE,
            notificationExt.CHAT_USER_MESSAGE,
            notificationExt.CHAT_GROUP_MESSAGE,
            notificationExt.CHAT_KICK,
            notificationExt.AGAIN_CONNECT,
            notificationExt.GET_CHAT_LIST,
            notificationExt.CHAT_TO_USER_MESSAGE];
        // 关心的消息处理
        this.handleNotification = function (data) {
            switch (data.name) {
                case notificationExt.LOGIN_CHAT_SERVER_SUCCESS:
                    this.LoginChatServerSuccess(data.body);
                    break;
                case notificationExt.CHAT_USER_ONLINE:
                    this.userOnline(data.body);
                    break;
                case notificationExt.CHAT_USER_OFFLINE:
                    this.userOffline(data.body);
                    break;
                case notificationExt.CHAT_USER_MESSAGE:
                    this.onUserMessage(data.body);
                    break;
                case notificationExt.CHAT_GROUP_MESSAGE:
                    this.onGroupMessage(data.body);
                    break;
                case notificationExt.CHAT_KICK:
                    alert("你即将被踢下线");
                    break;
                case notificationExt.AGAIN_CONNECT:
                    loginChatProxy.loginChat(this.token);
                    break;
                case notificationExt.GET_CHAT_LIST:
                    this.getChatListSuccess(data.body);
                    break;
                case notificationExt.CHAT_TO_USER_MESSAGE:
                    this.onToUserMessage(data.body);
                    break;
            }
        };
        this.onReturnChat = function () {
            this.nowModule = 1;
            $(this).parents(".windowR_P.left2_P").hide().prev().show();
            //下拉滚动条
            $('.talkCon_P').mCustomScrollbar('scrollTo', 'bottom')
        };
        //好友上线的操作
        this.userOnline = function (body) {
            var userObj = this.userMap[body.chatUser.userId];
            //说明在好友列表里
            if (userObj !== null) {
                userObj.user = body.chatUser;
                userObj.onLine();
                this.onlineNum++;
                $("#currentOnline").text(this.onlineNum);
                //设置靠前
                var childNodes = $("#talkUserList")[0].childNodes;
                var displayNode;
                for (var i = 0; i < childNodes.length; i++) {
                    var node = childNodes[i];
                    if (node.id !== null) {
                        displayNode = node;
                        break;
                    }
                }
                if (displayNode !== null) {
                    if (displayNode.id !== userObj.user.userId) {
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
                userObj.addEventListener(chatObjEventType.OPEN_CHAT_OBJ, this.openChatObjHandle, this);
                this.onlineNum++;
                this.userNum++;
                $("#currentOnline").text(this.onlineNum);
                $("#allUser").text(this.userNum);
            }
        };
        //好友下线
        this.userOffline = function (body) {
            var userObj = this.userMap[body.userId];
            if (userObj !== null) {
                userObj.user.isOnline = false;
                userObj.offLine();
                this.onlineNum--;
                $("#currentOnline").text(this.onlineNum);

                //设置靠后
                var childNodes = $("#talkUserList")[0].childNodes;
                var displayNode;
                for (var i = childNodes.length - 1; i >= 0; i--) {
                    var node = childNodes[i];
                    if (node.id !== null) {
                        displayNode = node;
                        break;
                    }
                }
                if (displayNode !== null) {
                    if (displayNode.id !== userObj.user.userId) {
                        $("#" + displayNode.id).after($("#" + userObj.user.userId));
                    }
                }
            } else {
                //这种情况不可能发生
            }

        };
        //登陆成功
        this.LoginChatServerSuccess = function (body) {
            //设置自己的信息
            this.own = body.chatUser;
            var firstGroup;
            //初始化聊天组
            if (body.chatGroupList !== null) {
                for (var i = 0; i < body.chatGroupList.length; i++) {
                    var userGroup = body.chatGroupList[i];
                    var groupObj = new GroupObj();
                    groupObj.init(userGroup);
                    this.groupMap[userGroup.chatGroupId] = groupObj;
                    $("#talkList").prepend(groupObj.view);
                    groupObj.addOptListener();
                    groupObj.addEventListener(chatObjEventType.OPEN_CHAT_OBJ, this.openChatObjHandle, this);
                    //默认打开第一个聊天组
                    if (i === 0) {
                        firstGroup = groupObj;
                    }
                }
            }
            //初始化好友列表
            if (body.chatUserList !== null) {
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
                    userObj.addEventListener(chatObjEventType.OPEN_CHAT_OBJ, this.openChatObjHandle, this);
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
        };
        //切换聊天对象
        this.openChatObjHandle = function (event) {
            //如果没变化，返回
            if (event.mTarget === this.nowToObj) {
                return;
            }
            //设置当前聊天对象，清空聊天记录
            this.nowToObj = event.mTarget;
            $("#chatList #mCSB_2_container")[0].innerHTML = "";
            //如果是用户
            if (event.mTarget.user !== null) {
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
            if (this.nowModule === 2) {
                this.getHistoryChatList(this.maxPage);
            }
        };
        //显示聊天信息
        this.openChat = function (chatList) {
            for (var i = 0; i < chatList.length; i++) {
                var chat = chatList[i];
                var view;
                //如果是自己则聊天内容在右边
                if (chat.userId === this.own.userId) {
                    view = this.createOwnChat(chat);
                } else {
                    view = this.createOtherUserChat(chat);
                }
                $("#chatList #mCSB_2_container").append(view);
            }
            //下拉滚动条
            $('.talkCon_P').mCustomScrollbar('scrollTo', 'bottom')
        };
        //他人的聊天显示
        this.createOtherUserChat = function (chat) {
            var view = document.createElement("div");
            var userObj = this.userMap[chat.userId];
            //var chatContent = chat.chatContent;
            view.className = "otherAsk_P";
            view.innerHTML = '<a href="javascript:;" class="perPic_P"><img src="' + userObj.user.userImg + '" alt=""/></a>' +
                '<dl>' +
                '<dt>' + userObj.user.userRealName + '</dt>' +
                '<dd><span>' + chat.chatContent + '</span></dd>' +
                '</dl>' +
                '<div class="clear"></div>';
            return $(view);
        };
        //自己的聊天显示
        this.createOwnChat = function (chat) {
            var view = document.createElement("div");
            view.className = "myAsk_P";
            view.innerHTML = '<a href="javascript:;" class="perPic_P"><img src="' + this.own.userImg + '" alt=""/></a>' +
                '<dl>' +
                '<dd><span>' + chat.chatContent + '</span></dd>' +
                '</dl>' +
                '<div class="clear"></div>';
            return $(view);
        };
        //用户发来消息时
        this.onUserMessage = function (body) {
            var showHaveMsg = true;
            //如果是当前聊天对象则直接显示
            if (this.nowToObj.user !== null) {
                if (this.nowToObj.user.userId === body.userId) {
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
        };
        this.onToUserMessage = function (body) {
            //如果是当前聊天对象则显示
            if (this.nowToObj.user !== null) {
                if (this.nowToObj.user.userId === body.toUserId) {
                    this.openChat([body.message]);
                }
            }
            //加入历史聊天列表
            this.userMap[body.toUserId].chatList = this.userMap[body.toUserId].chatList.concat([body.message]);
        };
        this.onGroupMessage = function (body) {
            //如果是当前聊天对象则显示
            var showHaveMsg = true;
            if (this.nowToObj.group !== null) {
                if (this.nowToObj.group.chatGroupId === body.chatGroupId) {
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
        };
        //发送聊天
        this.onSendChat = function () {
            var chatContent = $(this).parents(".windowR_P").find(".ke-edit-iframe").contents().find(".ke-content").html();
            if (chatContent === null || chatContent === "") {
                return;
            }
            var toType;
            var toTypeId;
            if (this.nowToObj.user !== null) {
                toType = 1;
                toTypeId = this.nowToObj.user.userId;
            } else {
                toType = 2;
                toTypeId = this.nowToObj.group.chatGroupId;
            }
            $(this).parents(".windowR_P").find(".ke-edit-iframe").contents().find(".ke-content").html("");
            loginChatProxy.sendMessage(chatContent, toType, toTypeId);
        };
        this.onClickHistory = function () {
            $(".windowR_P.left2_P").show().prev().hide();
            this.getHistoryChatList(this.maxPage);
            this.nowModule = 2;
        };
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
        };
        this.createHistoryChat = function (chat) {
            var view = document.createElement("dl");
            var user;
            if (chat.userId === this.own.userId) {
                user = this.own;
            } else {
                user = this.userMap[chat.userId].user;
            }
            view.innerHTML = '<dt class="org_P">' + user.userRealName + ' ' + chat.chatCreateTime + '</dt>' +
                '<dd>' + chat.chatContent + '</dd>';
            return $(view);
        };
        this.getChatListSuccess = function (body) {
            this.currentPage = body.currentPage;
            this.totalPage = body.totalPage;
            $("#firstPage").removeClass("disabled_P");
            $("#prePage").removeClass("disabled_P");
            $("#nextPage").removeClass("disabled_P");
            $("#lastPage").removeClass("disabled_P");
            if (this.currentPage === this.totalPage || this.totalPage === null) {
                $("#nextPage").addClass("disabled_P");
                $("#lastPage").addClass("disabled_P");
            }
            if (this.currentPage === 1) {
                $("#firstPage").addClass("disabled_P");
                $("#prePage").addClass("disabled_P");
            }
            $("#histortChat").text("");
            if (body.message !== null && body.message.length !== 0) {
                for (var i = 0; i < body.message.length; i++) {
                    var msg = body.message[i];
                    var view = this.createHistoryChat(msg);
                    $("#histortChat").append(view);
                    if (i === 0) {
                        var chatCreateTime = msg.chatCreateTime;
                        var array = chatCreateTime.split(" ");
                        $("#historyTime").text(array[0]);
                    }

                }
            } else {
                this.setNowTime();
            }
        };
        this.onFirstPage = function () {
            this.getHistoryChatList(1);
        };
        this.onPrePage = function () {
            this.getHistoryChatList(this.currentPage - 1);
        };
        this.onNextPage = function () {
            this.getHistoryChatList(this.currentPage + 1);
        };
        this.onLastPage = function () {
            this.getHistoryChatList(this.maxPage);

        };
        this.getHistoryChatList = function (currentPage, chatCreateTime) {
            var toType;
            var toTypeId;
            if (this.nowToObj.user !== null) {
                toType = 1;
                toTypeId = this.nowToObj.user.userId;
            } else {
                toType = 2;
                toTypeId = this.nowToObj.group.chatGroupId;
            }
            loginChatProxy.getMessage(toType, toTypeId, chatCreateTime, currentPage, this.pageSize);
        };
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
        };
        this.getDate = function () {
            var html = $dp.cal.getNewDateStr();
            this.getHistoryChatList(null, html);
        };
        Mediator.apply(this);
    };
    window.anychat.TalkMediator = TalkMediator;
})(window);