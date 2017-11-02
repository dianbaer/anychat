(function (window) {
    if (!window.anychat) window.anychat = {};
    var ChatObjEventType = function () {
        /**
         * 切换聊天对象
         * @type {string}
         */
        this.OPEN_CHAT_OBJ = "openChatObj";
    };
    window.anychat.chatObjEventType = new ChatObjEventType();
})(window);
(function (window) {
    if (!window.anychat) window.anychat = {};
    var GetUrlParam = function () {
        /**
         * 获取url地址某参数的值
         * @param name 参数名
         * @returns {*}
         */
        this.getUrlParam = function (name) {
            var search = location.search;
            search = search.substring(1);
            var array = search.split("&");
            var paramValue = null;
            for (var i = 0; i < array.length; i++) {
                var str = array[i];
                if (str.indexOf(name + "=") !== -1) {
                    var strArray = str.split("=");
                    paramValue = strArray[1];
                    break;
                }
            }
            return paramValue;
        }
    };
    window.anychat.getUrlParam = new GetUrlParam();
})(window);
(function (window) {
    if (!window.anychat) window.anychat = {};
    var NotificationExt = function () {
        /**
         * 登录成功
         * @type {string}
         */
        this.LOGIN_CHAT_SERVER_SUCCESS = "loginChatServerSuccess";
        /**
         * 用户上线
         * @type {string}
         */
        this.CHAT_USER_ONLINE = "chatUserOnline";
        /**
         * 用户离线
         * @type {string}
         */
        this.CHAT_USER_OFFLINE = "chatUserOffline";
        /**
         * 接到用户信息
         * @type {string}
         */
        this.CHAT_USER_MESSAGE = "chatUserMessage";
        /**
         * 接到组信息
         * @type {string}
         */
        this.CHAT_GROUP_MESSAGE = "chatGroupMessage";
        /**
         * 被踢下线
         * @type {string}
         */
        this.CHAT_KICK = "chatKick";
        /**
         * 通知再重新登录
         * @type {string}
         */
        this.AGAIN_CONNECT = "againConnect";
        /**
         * 获取聊天记录
         * @type {string}
         */
        this.GET_CHAT_LIST = "getChatList";
        /**
         * 接到自己发给别人的信息
         * @type {string}
         */
        this.CHAT_TO_USER_MESSAGE = "chatToUserMessage";
    };
    window.anychat.notificationExt = new NotificationExt();
})(window);
(function (window) {
    if (!window.anychat) window.anychat = {};
    var notificationExt = window.anychat.notificationExt;
    var webSocketEventType = window.juggle.webSocketEventType;
    var Proxy = window.juggle.Proxy;
    var LoginChatProxy = function () {
        Proxy.apply(this);
        this.url = null;
        this.webSocketClient = null;
        /**
         * 初始化，监听消息
         * @param webSocketClient
         */
        this.init = function (webSocketClient) {
            this.webSocketClient = webSocketClient;
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("2"), this.onLoginChatServer, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("3"), this.onUserOnline, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("4"), this.onUserOffline, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("6"), this.onUserMessage, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("7"), this.onGroupMessage, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("10"), this.onUserKick, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("11"), this.onAgainConnect, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("13"), this.onGetMessage, this);
            this.webSocketClient.addEventListener(webSocketEventType.getMessage("14"), this.onToUserMessage, this);
        };
        /**
         * 登录成功
         * @param event
         */
        this.onLoginChatServer = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.LOGIN_CHAT_SERVER_SUCCESS, event.mData));
        };
        /**
         * 好友上线
         * @param event
         */
        this.onUserOnline = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_USER_ONLINE, event.mData));
        };
        /**
         * 好友离线
         * @param event
         */
        this.onUserOffline = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_USER_OFFLINE, event.mData));
        };
        /**
         * 用户发来消息
         * @param event
         */
        this.onUserMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_USER_MESSAGE, event.mData));
            // 回复服务器，这些信息接收到了
            var data = event.mData;
            if (data.message !== null && data.message !== undefined) {
                var messageId = [];
                for (var i = 0; i < data.message.length; i++) {
                    var message = data.message[i];
                    messageId.push(message.chatId);
                }
                this.sendUserMessageReceive(messageId, data.userId);
            }
        };
        /**
         * 组发来消息
         * @param event
         */
        this.onGroupMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_GROUP_MESSAGE, event.mData));
            // 回复服务器，这些信息收到了，只告诉服务器最后一条即可
            var data = event.mData;
            if (data.message !== null && data.message !== undefined) {
                this.sendGroupMessageReceive(data.message[data.message.length - 1].chatId, data.chatGroupId);
            }
        };
        /**
         * 被踢下线
         * @param event
         */
        this.onUserKick = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_KICK, event.mData));
        };
        /**
         * 通知重新连接服务器
         * @param event
         */
        this.onAgainConnect = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.AGAIN_CONNECT, event.mData));
        };
        /**
         * 获取聊天记录
         * @param event
         */
        this.onGetMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.GET_CHAT_LIST, event.mData));
        };
        /**
         * 发给好友的消息，推送给自己
         * @param event
         */
        this.onToUserMessage = function (event) {
            this.notifyObservers(this.getNotification(notificationExt.CHAT_TO_USER_MESSAGE, event.mData));
        };
        /**
         * 登录聊天服务器
         * @param token
         */
        this.loginChat = function (token) {
            var data = {
                "wsOpCode": 1,
                "token": token
            };
            this.webSocketClient.send(data);
        };
        /**
         * 推送消息
         * @param chatContent
         * @param toType
         * @param toTypeId
         */
        this.sendMessage = function (chatContent, toType, toTypeId) {
            var data = {
                "wsOpCode": 5,
                "chatContent": chatContent,
                "toType": toType,
                "toTypeId": toTypeId
            };
            this.webSocketClient.send(data);
        };
        /**
         * 获取聊天记录
         * @param toType
         * @param toTypeId
         * @param chatCreateTime
         * @param currentPage
         * @param pageSize
         */
        this.getMessage = function (toType, toTypeId, chatCreateTime, currentPage, pageSize) {
            var data = {
                "wsOpCode": 12,
                "toType": toType,
                "toTypeId": toTypeId,
                "chatCreateTime": chatCreateTime,
                "currentPage": currentPage,
                "pageSize": pageSize
            };
            this.webSocketClient.send(data);
        };
        /**
         * 收到某用户的消息
         * @param messageId
         * @param userId
         */
        this.sendUserMessageReceive = function (messageId, userId) {
            var data = {
                "wsOpCode": 8,
                "messageId": messageId,
                "userId": userId
            };
            this.webSocketClient.send(data);
        };
        /**
         * 收到组的消息
         * @param endChatId
         * @param chatGroupId
         */
        this.sendGroupMessageReceive = function (endChatId, chatGroupId) {
            var data = {
                "wsOpCode": 9,
                "endChatId": endChatId,
                "chatGroupId": chatGroupId
            };
            this.webSocketClient.send(data);
        }
    };
    window.anychat.loginChatProxy = new LoginChatProxy();
})(window);
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
            view.innerHTML = '<img src="js/anychat/images/groupIcon.png" alt=""/><span class="titleSty2_P">' + this.group.chatGroupName + '</span>';
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
            if (this.token === null || this.token === undefined) {
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
            $(".windowL_P>dd").mCustomScrollbar({
                theme: "minimal",
                advanced: {autoExpandHorizontalScroll: true},
                scrollbarPosition: "outside"
            });
            $(".talkCon_P").mCustomScrollbar({
                theme: "minimal",
                advanced: {autoExpandHorizontalScroll: true},
                scrollbarPosition: "outside"
            });
            $(".hisList_P").mCustomScrollbar({
                theme: "minimal",
                advanced: {autoExpandHorizontalScroll: true},
                scrollbarPosition: "outside"
            });
            var talkButton = 1;
            $(".windowL_P .group").on("click", "p", function () {
                if (talkButton === 1) {
                    $(this).parent().siblings().find(".slid_P").removeClass("slid_P");
                    $(this).parent().siblings().find("ul").stop().slideUp();
                    $(this).parent().find("p").addClass("slid_P").next().slideDown(function () {
                        talkButton = 2;
                    });
                } else {
                    $(this).parent().siblings().find(".slid_P").removeClass("slid_P");
                    $(this).parent().siblings().find("ul").stop().slideUp();
                    $(this).parent().find("p").removeClass("slid_P").next().slideUp(function () {
                        talkButton = 1
                    });
                }
            });
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
        this.onClose = function (event) {
            alert("与服务器断开链接");
        };
        //断开聊天服务器
        this.logoutChatServer = function () {
            if (this.webSocketClient !== null && this.webSocketClient !== undefined) {
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
        this.onReturnChat = function (event) {
            this.nowModule = 1;
            $(event.target).parents(".windowR_P.left2_P").hide().prev().show();
            //下拉滚动条
            $('.talkCon_P').mCustomScrollbar('scrollTo', 'bottom')
        };
        //好友上线的操作
        this.userOnline = function (body) {
            var userObj = this.userMap[body.chatUser.userId];
            //说明在好友列表里
            if (userObj !== null && userObj !== undefined) {
                userObj.user = body.chatUser;
                userObj.onLine();
                this.onlineNum++;
                $("#currentOnline").text(this.onlineNum);
                //设置靠前
                var childNodes = $("#talkUserList")[0].childNodes;
                var displayNode;
                for (var i = 0; i < childNodes.length; i++) {
                    var node = childNodes[i];
                    if (node.id !== null && node.id !== undefined) {
                        displayNode = node;
                        break;
                    }
                }
                if (displayNode !== null && displayNode !== undefined) {
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
            if (userObj !== null && userObj !== undefined) {
                userObj.user.isOnline = false;
                userObj.offLine();
                this.onlineNum--;
                $("#currentOnline").text(this.onlineNum);

                //设置靠后
                var childNodes = $("#talkUserList")[0].childNodes;
                var displayNode;
                for (var i = childNodes.length - 1; i >= 0; i--) {
                    var node = childNodes[i];
                    if (node.id !== null && node.id !== undefined) {
                        displayNode = node;
                        break;
                    }
                }
                if (displayNode !== null && displayNode !== undefined) {
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
            if (body.chatGroupList !== null && body.chatGroupList !== undefined) {
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
            if (body.chatUserList !== null && body.chatUserList !== undefined) {
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
            if (event.mTarget.user !== null && event.mTarget.user !== undefined) {
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
            var img;
            if (userObj.user.userImg === null || userObj.user.userImg === undefined) {
                img = "js/anychat/images/default.png";
            } else {
                img = userObj.user.userImg;
            }
            view.innerHTML = '<a href="javascript:;" class="perPic_P"><img src="' + img + '" alt=""/></a>' +
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
            var img;
            if (this.own.userImg === null || this.own.userImg === undefined) {
                img = "js/anychat/images/default.png";
            } else {
                img = this.own.userImg;
            }
            view.innerHTML = '<a href="javascript:;" class="perPic_P"><img src="' + img + '" alt=""/></a>' +
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
            if (this.nowToObj.user !== null && this.nowToObj.user !== undefined) {
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
            if (this.nowToObj.user !== null && this.nowToObj.user !== undefined) {
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
            if (this.nowToObj.group !== null && this.nowToObj.group !== undefined) {
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
        this.onSendChat = function (event) {
            var chatContent = $("#sendChatContent").val();
            if (chatContent === null || chatContent === "" || chatContent === undefined) {
                return;
            }
            var toType;
            var toTypeId;
            if (this.nowToObj.user !== null && this.nowToObj.user !== undefined) {
                toType = 1;
                toTypeId = this.nowToObj.user.userId;
            } else {
                toType = 2;
                toTypeId = this.nowToObj.group.chatGroupId;
            }
            //$("#sendChatContent").val();
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
            if (this.currentPage === this.totalPage || this.totalPage === null || this.totalPage === undefined) {
                $("#nextPage").addClass("disabled_P");
                $("#lastPage").addClass("disabled_P");
            }
            if (this.currentPage === 1) {
                $("#firstPage").addClass("disabled_P");
                $("#prePage").addClass("disabled_P");
            }
            $("#histortChat").text("");
            if (body.message !== null && body.message !== undefined && body.message.length !== 0) {
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
            if (this.nowToObj.user !== null && this.nowToObj.user !== undefined) {
                toType = 1;
                toTypeId = this.nowToObj.user.userId;
            } else {
                toType = 2;
                toTypeId = this.nowToObj.group.chatGroupId;
            }
            loginChatProxy.getMessage(toType, toTypeId, chatCreateTime, currentPage, this.pageSize);
        };
        Mediator.apply(this);
    };
    window.anychat.TalkMediator = TalkMediator;
})(window);