function Global() {
}
var $T = new Global();

function Notification() {
    this.SEND_HTTP_START = "SEND_HTTP_START";// 发送http请求
    this.SEND_HTTP_END = "SEND_HTTP_END";// 发送http请求完成
    this.SYSTEM_ERROR = "SYSTEM_ERROR";// 系统内部错误
    this.MODULE_INIT_COMPLETE = "moduleInitComplete";// 模块初始化完成
}
$T.notification = new Notification();

function ViewManager() {
    this.observerMap = [];
    this.viewMap = [];
    /**
     * 注册监听函数
     */
    this.registerObserver = function (notificationName, observer) {
        if (notificationName == null || observer == null) {
            alert("注册消息或控制器为空，请检查");
            return;
        }
        var observers = this.observerMap[notificationName];
        if (observers) {
            var isHave = false;
            for (var i = 0; i < observers.length; i++) {
                if (observers[i] == observer) {
                    isHave = true;
                    break;
                }
            }
            if (!isHave) {
                observers.push(observer);
            } else {
                alert("重复注册消息监听,请检查逻辑");
            }
        } else {
            this.observerMap[notificationName] = [observer];
        }
    }
    this.registerObserverArray = function (notificationNameArray, observer) {
        for (var i = 0; i < notificationNameArray.length; i++) {
            this.registerObserver(notificationNameArray[i], observer);
        }
    }
    this.getNotification = function (name, body) {
        var obj = {};
        obj.name = name;
        obj.body = body;
        return obj;
    }
    /**
     * 发消息给监听函数
     */
    this.notifyObservers = function (notification) {
        var obj = this.observerMap[notification.name];
        if (obj) {
            // 这里最好复制这个数组，防止回调的时候，在注册新的监听
            var observers = obj.concat();
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                observer.handleNotification.call(observer, [notification]);
            }
        }
    }
    this.removeObserverArray = function (notificationNameArray, observer) {
        for (var i = 0; i < notificationNameArray.length; i++) {
            this.removeObserver(notificationNameArray[i], observer);
        }
    }
    /**
     * 移除
     */
    this.removeObserver = function (notificationName, observer) {
        if (notificationName == null) {
            return;
        }
        var observers = this.observerMap[notificationName];
        var isHave = false;
        for (var i = 0; i < observers.length; i++) {
            if (observers[i] == observer) {
                observers.splice(i, 1);
                isHave = true;
                break;
            }
        }
        if (!isHave) {
            alert("移除消息监听失败，请检查逻辑");
        }
        if (observers.length == 0) {
            delete this.observerMap[notificationName];
        }
    }
    /**
     * 注册视图
     */
    this.registerView = function (viewName, view) {
        this.viewMap[viewName] = view;
    }
    /**
     * 获取视图
     */
    this.retrieveView = function (viewName) {
        return this.viewMap[viewName];
    }
    /**
     * 移除视图
     */
    this.removeView = function (viewName) {
        var view = this.viewMap[viewName];
        if (view != null) {
            delete this.viewMap[viewName];
        }
        return view;
    }
    this.reset = function () {
        // 清空所有注册消息
        this.observerMap = [];
        // 清空所有视图
        this.viewMap = [];
    }
}
$T.viewManager = new ViewManager();

function HttpConfigNormal() {
    this.TYPE_POST = "post";// 发送类型
    this.TYPE_GET = "get";// 发送类型
    this.RETURN_TYPE_JSON = "json";// 获取类型
    this.RETURN_TYPE_HTML = "html";// 获取类型
    this.PACKET = "packet";// 是文件类型的包

}
$T.httpConfigNormal = new HttpConfigNormal();

function HttpConfig() {
    HttpConfigNormal.apply(this);
    // 允许消息头
    this.HOPCODE = "hOpCode";// 操作码
    this.TOKEN = "token";
    this.SEND_TYPE = "sendType";
    this.RECEIVE_TYPE = "receiveType";
    this.FILE_UUID = "fileUuid";// uuid
    // 发送类型
    this.SEND_TYPE_JSON = "sendTypeJson";
    this.SEND_TYPE_PROTOBUF = "sendTypeProtobuf";
    this.SEND_TYPE_PACKET = "sendTypePacket";
    this.SEND_TYPE_FILE_SAVE_SESSION = "sendTypeFileSaveSession";
    this.SEND_TYPE_FILE_NOT_SAVE = "sendTypeFileNotSave";
    this.SEND_TYPE_NONE = "sendTypeNone";
    // 接收类型
    this.RECEIVE_TYPE_JSON = "receiveTypeJson";
    this.RECEIVE_TYPE_PROTOBUF = "receiveTypeProtobuf";
    this.RECEIVE_TYPE_FILE = "receiveTypeFile";
    this.RECEIVE_TYPE_IMAGE = "receiveTypeImage";
    this.RECEIVCE_TYPE_STRING = "receiveTypeString";
    this.RECEIVE_TYPE_NONE = "receiveTypeNone";
}
$T.httpConfig = new HttpConfig();

function HttpResultFilter() {
    this.filterArray = new Array();
    this.addFilter = function (filter) {
        this.filterArray.push(filter);
    }
    this.filter = function (result, sendParam) {
        for (var i = 0; i < this.filterArray.length; i++) {
            var filter = this.filterArray[i];
            var bool = filter.filter(result, sendParam);
            if (!bool) {
                return false;
            }
        }
        return true;
    }
}
$T.httpResultFilter = new HttpResultFilter();

function SendParamNormal() {
    this.canContinuous = false;// 该函数名是否可以持续发送
    this.lockKey;//锁的对象
    this.loadType;// 加载消息类型
    this.successHandle;// 成功回调
    this.failHandle;// 失败回调
    this.object;// 回调的对象本身
    this.data;// 发送数据
    this.type = $T.httpConfig.TYPE_POST;// 发送类型
    this.async = true;// 是否异步
    this.url;// 发送地址
    this.returnType = $T.httpConfig.RETURN_TYPE_JSON;// 获取类型
    this.isStatic = false;// 静态网页还是动态数据
    this.startTime;// 请求开始时间
    this.endTime;// 请求结束时间
    this.fileArray;// 文件数组
    this.headerKey;//头key数组
    this.headerValue;//头value数组
}

function SendParam() {
    SendParamNormal.apply(this);
    this.fileUuid;// 获取进度的id
    this.token;// 身份标示
    this.sendType;// 发送类型
    this.receiveType;// 接收类型
}

function TestFilter() {
    this.filter = function (result, sendParam) {
        return true;
    }
}

/**
 * 全局
 */
function ArrayTools() {
    this.indexOf = function (array, obj) {
        var index = -1;
        if (array == null || obj == null) {
            return index;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj) {
                index = i;
                break;
            }
        }
        return index;
    }
}
$T.arrayTools = new ArrayTools();

function DisplayObject() {
    this.obj;
    this.xValue = 0;
    this.yValue = 0;
    this.alphaValue = 0;
    this.visibility = "visible";
    this.DisplayObject = function (obj) {
        this.obj = obj;
    }
    this.getX = function () {
        return this.xValue;
    }
    this.setX = function (value) {
        this.xValue = value;
        this.draw();
    }
    this.getY = function () {
        return this.yValue;
    }
    this.setY = function (value) {
        this.yValue = value;
        this.draw();
    }
    this.getAlpha = function () {
        return this.alphaValue;
    }
    this.setAlpha = function (value) {
        this.alphaValue = value;
        this.draw();
    }
    this.setVisible = function (value) {
        if (value == true) {
            this.visibility = "visible";
        } else {
            this.visibility = "hidden";
        }
        this.draw();
    }
    this.draw = function () {
        this.obj.style.position = "absolute";
        this.obj.style.top = this.yValue + "px";
        this.obj.style.left = this.xValue + "px";
        this.obj.style.opacity = this.alphaValue;
        this.obj.style.filter = "alpha(opacity=" + (this.alphaValue * 100) + "%)";
        this.obj.style.visibility = this.visibility;
    }
}


function Event() {
    this.mTarget;
    this.mCurrentTarget;
    this.mType;
    this.mBubbles;
    this.mStopsPropagation;
    this.mStopsImmediatePropagation;
    this.mData;
    /** xp 创建事件类，传入类型，是否冒泡，和数据（无回调）* */
    this.Event = function (type, bubbles, data) {
        if (bubbles == undefined) {
            bubbles = false;
        }
        if (data == undefined) {
            data = null;
        }
        this.reset(type, bubbles, data);
    }
    /** xp 停止向上冒泡，这轮的事件广播不停（无回调）* */
    this.stopPropagation = function () {
        this.mStopsPropagation = true;
    }
    /** xp 立即停止事件广播（无回调）* */
    this.stopImmediatePropagation = function () {
        this.mStopsPropagation = this.mStopsImmediatePropagation = true;
    }
    // xp清理事件类
    this.dispose = function () {
        this.mData = this.mTarget = this.mCurrentTarget = null;
    }
    this.reset = function (type, bubbles, data) {
        if (bubbles == undefined) {
            bubbles = false;
        }
        if (data == undefined) {
            data = null;
        }
        this.mType = type;
        this.mBubbles = bubbles;
        this.mData = data;
        this.mTarget = this.mCurrentTarget = null;
        this.mStopsPropagation = this.mStopsImmediatePropagation = false;
        return this;
    }
}


function EventPool() {
    this.sEventPool = new Array();
    /** xp取事件池里面的事件，并且对事件进行重置（无回调）* */
    this.fromPool = function (type, bubbles, data) {
        if (this.sEventPool.length)
            return this.sEventPool.pop().reset(type, bubbles, data);
        else {
            var event = new Event();
            event.Event(type, bubbles, data);
            return event;
        }
    }

    /** @private */
    /** xp只清理两个目标和带来的数据，是为了可以释放资源，其他的不清理，等用的时候在重置，增加效率（无回调）* */
    this.toPool = function (event) {
        event.mData = event.mTarget = event.mCurrentTarget = null;
        this.sEventPool[this.sEventPool.length] = event; // avoiding 'push'
    }
}
$T.eventPool = new EventPool();


$T.sBubbleChains = new Array();
$T.functionMapping = new Array();
/**
 * xp已看完，这个类重中之重就是回调之后，不能影响这次循环的调用，一切都有一个衡量点，就是如果注册了这个时间，并且触发时，除非是被阻止冒泡，不能阻止事件触发
 * 比较重要的几点，如果事件触发了，接受这个事件的对象无法改变自身这一次的监听状态例如
 * a对象监听函数有b和c，b先收到，在这一次b里面移除c的监听，并不能阻止c收到这次事件
 * 如果想阻止，可以再b里面把stopsImmediatePropagation设置为true
 * 接受这个事件的对象可以移除他的上一级的监听，使之无法收到事件（这种做法不合理，本来就不能做）
 * 如果接受这个事件对象，离开了自己的父类，也不能阻止父类这一次收到这个事件
 */
function EventDispatcher() {
    this.mEventListeners;
    this.isEventDispatcher = true;
    /** xp添加监听,同一个函数只能添加一种类型的监听，多余的忽略，在监听的时候动态的创建，节省资源（无回调） * */
    this.addEventListener = function (type, listener, parent) {
        if (this.mEventListeners == null)
            this.mEventListeners = new Array();

        var listeners = this.mEventListeners[type];
        if (listeners == null) {
            this.mEventListeners[type] = [listener];
            $T.functionMapping[listener] = parent;
        } else if ($T.arrayTools.indexOf(listeners, listener) == -1) { // check
            // for
            // duplicates
            listeners.push(listener);
            $T.functionMapping[listener] = parent;
        }
    }
    /** xp移除监听，这里面临时创建了一个数组，存还需要在监听的函数，这里能创建大量的临时数组，这是有意义的，因为回调的时候可能会删除事件，这个删除事件，不能影响这一次的遍历（无回调）* */
    this.removeEventListener = function (type, listener) {
        if (this.mEventListeners) {
            var listeners = this.mEventListeners[type];
            var numListeners = listeners ? listeners.length : 0;

            if (numListeners > 0) {
                // we must not modify the original vector, but work on a copy.
                // (see comment in 'invokeEvent')

                var index = 0;
                var restListeners = new Array();

                for (var i = 0; i < numListeners; ++i) {
                    var otherListener = listeners[i];
                    if (otherListener != listener)
                        restListeners[index++] = otherListener;
                }

                this.mEventListeners[type] = restListeners;
            }
        }
    }
    /** xp移除这个类型的所有监听，如果不传类型，就移除所有类型的监听（无回调）* */
    this.removeEventListeners = function (type) {
        if (type && this.mEventListeners)
            delete this.mEventListeners[type];
        else
            this.mEventListeners = null;
    }
    /***************************************************************************
     * xp如果不冒泡并且 （事件字典为空或者字典里没有这个事件）就不发事件，这样提高效率
     **************************************************************************/
    this.dispatchEvent = function (event) {
        var bubbles = event.mBubbles;

        if (!bubbles && (this.mEventListeners == null || !(event.mType in this.mEventListeners)))
            return; // no need to do anything

        // we save the current target and restore it later;
        // this allows users to re-dispatch events without creating a clone.

        // xp存这个事件最开始设定的目标，执行完毕之后在还原，一般情况下这个目标肯定是空，除非用户自己设定了目标
        var previousTarget = event.mTarget;
        // xp设置目标
        event.mTarget = this;
        // xp只有设置冒泡，并且这个目标是显示对象，才去走冒泡逻辑，不然不走，提高效率
        if (bubbles && this.isDisplayObject)
            this.bubbleEvent(event);
        else
            this.invokeEvent(event);

        if (previousTarget)
            event.mTarget = previousTarget;
    }
    /** xp 这里的回调，可能增加事件无所谓，因为加的事件在长度之外，也可能删除事件，删除事件已经解决了这个问题，创建新的数组* */
    this.invokeEvent = function (event) {
        var listeners = this.mEventListeners ? this.mEventListeners[event.mType] : null;
        var numListeners = listeners == null ? 0 : listeners.length;

        if (numListeners) {
            // xp这个this，并不是发事件的那个显示对象，谁调的，就是谁
            event.mCurrentTarget = this;

            // we can enumerate directly over the vector, because:
            // when somebody modifies the list while we're looping,
            // "addEventListener" is not
            // problematic, and "removeEventListener" will create a new Vector,
            // anyway.

            for (var i = 0; i < numListeners; ++i) {
                var listener = listeners[i];
                var numArgs = listener.length;

                if (numArgs == 0)
                    listener.call($T.functionMapping[listener]);
                else if (numArgs == 1)
                    listener.call($T.functionMapping[listener], event);
                else
                    listener.call($T.functionMapping[listener], event, event.mData);

                if (event.mStopsImmediatePropagation) {
                    // xp如果这个数组被换掉了，就把这个数组置空把，没用了（回来测试下）
                    if (!this.mEventListeners || listeners !== this.mEventListeners[event.mType]) {
                        listeners.length = 0;
                    }
                    return true;
                }
            }
            // xp如果这个数组被换掉了，就把这个数组置空把，没用了（回来测试下）
            if (!this.mEventListeners || listeners !== this.mEventListeners[event.mType]) {
                listeners.length = 0;
            }
            return event.mStopsPropagation;
        } else {
            return false;
        }
    }
    /** xp把全部监听的对象到头放到一个数组里，防止回调给他们删除，然后执行事件冒泡，这个冒泡的数据组池，提高效率而且必须是数组，因为回调之后再发布事件，还需要创建新的* */
    this.bubbleEvent = function (event) {
        // we determine the bubble chain before starting to invoke the
        // listeners.
        // that way, changes done by the listeners won't affect the bubble
        // chain.

        var chain;
        var element = this;
        var length = 1;

        if ($T.sBubbleChains.length > 0) {
            chain = $T.sBubbleChains.pop();
            chain[0] = element;
        } else
            chain = [element];

        while ((element = element.parent) != null)
            chain[length++] = element;

        for (var i = 0; i < length; ++i) {
            var stopPropagation = chain[i].invokeEvent(event);
            if (stopPropagation)
                break;
        }

        chain.length = 0;
        $T.sBubbleChains.push(chain);
    }
    /** xp发布事件用内部的事件池，执行事件发布之后，然后再放入事件池，如果是冒泡或者自己有这个事件 才去发布事件，这个判断增加效率，* */
    this.dispatchEventWith = function (type, bubbles, data) {
        if (bubbles == undefined) {
            bubbles = false;
        }
        if (data == undefined) {
            data = null;
        }
        if (bubbles || this.hasEventListener(type)) {
            var event = $T.eventPool.fromPool(type, bubbles, data);
            this.dispatchEvent(event);
            $T.eventPool.toPool(event);
        }
    }
    /** xp返回是否有这种类型的监听（无回调）* */
    this.hasEventListener = function (type) {
        var listeners = this.mEventListeners ? this.mEventListeners[type] : null;
        return listeners ? listeners.length != 0 : false;
    }
}


function TweenEventType() {
    /** **************自定义事件****************** */
    this.REMOVE_FROM_JUGGLER = "removeFromJuggler";// 移出时间轴
}
$T.tweenEventType = new TweenEventType();

/**
 * 主要注意的是，这个对象并不会被注销，需要保留这个对象的引用，然后注销了，在删除引用
 */
function DelayedCall() {
    this.mCurrentTime;
    this.mTotalTime;
    this.mCall;
    this.mArgs;
    this.mRepeatCount;
    // xp增加的
    this.isPoolDelayedCall = false;
    this.isDelayedCall = true;
    this.DelayedCall = function (call, delay, args, isPoolDelayedCall) {
        if (args == undefined) {
            args = null;
        }
        if (isPoolDelayedCall == undefined) {
            isPoolDelayedCall = false;
        }
        this.reset(call, delay, args, isPoolDelayedCall);
    }
    /***************************************************************************
     * xp默认是一次，如果不用默认值，需要new对象然后修改次数，如果是0次，就说明无限回调，0.0001的限制比这个小的话就用0.00001不能等于0
     * 如果传0，那就等于下一帧调用
     **************************************************************************/
    this.reset = function (call, delay, args, isPoolDelayedCall) {
        if (args == undefined) {
            args = null;
        }
        if (isPoolDelayedCall == undefined) {
            isPoolDelayedCall = false;
        }
        this.isPoolDelayedCall = isPoolDelayedCall;
        this.mCurrentTime = 0;
        this.mTotalTime = Math.max(delay, 0.0001);
        this.mCall = call;
        this.mArgs = args;
        this.mRepeatCount = 1;
        EventDispatcher.apply(this);
        return this;
    }
    this.advanceTime = function (time) {
        var previousTime = this.mCurrentTime;
        this.mCurrentTime = Math.min(this.mTotalTime, this.mCurrentTime + time);

        // xp上一次时间小于总时间，这个是为了确实有过时间差，第二个条件，如果正确肯定是等于，不可能大于
        // 不可能有大于的情况，所以把大于去了
        // 上一次时间必须小于总时间，并且这一次时间必须大于等于总时间，这个是动画的必须条件，概念上这才叫有时间的动画
        if (previousTime < this.mTotalTime && this.mCurrentTime == this.mTotalTime) {

            if (this.mRepeatCount == 0 || this.mRepeatCount > 1) {

                if (this.mRepeatCount > 0)
                    this.mRepeatCount -= 1;
                this.mCurrentTime = 0;
                // xp回调放下面点比较好吧，这样如果修改repeatCount的时候，不至于还被这里置回去
                if (this.mArgs == null) {
                    this.mCall.apply(this);
                } else {
                    this.mCall.apply(this, this.mArgs);
                }

                // xp精确一点时间都不浪费
                this.advanceTime((previousTime + time) - this.mTotalTime);
            } else {
                // save call & args: they might be changed through an event
                // listener
                // xp保存回调的函数和参数
                var call = this.mCall;
                var args = this.mArgs;
                // in the callback, people might want to call "reset" and re-add
                // it to the
                // juggler; so this event has to be dispatched *before*
                // executing 'call'.
                // 先发事件，再回调，不然juggler可能无法清除这个delayedcall
                this.dispatchEventWith($T.tweenEventType.REMOVE_FROM_JUGGLER);

                call.apply(this, args);
            }
        }
    }
    // xp注销，传进来的，不能这里修改需要在外面清空
    this.dispose = function () {
        this.mCall = null;
        this.mArgs = null;
        // removeEventListeners();
    }
    /** xp没问题，因为如果是1的话，就不会再减1了，并且mCurrentTime也不会再改变了* */
    this.isComplete = function () {
        // 不可能有大于的情况，所以把大于去了
        return this.mRepeatCount == 1 && this.mCurrentTime == this.mTotalTime;
    }
}

function DelayedCallPool() {
    this.sDelayedCallPool = new Array();

    this.fromPool = function (call, delay, args) {
        if (args == undefined) {
            args = null;
        }
        if (this.sDelayedCallPool.length)
            return this.sDelayedCallPool.pop().reset(call, delay, args, true);
        else {
            var delayedCall = new DelayedCall();
            delayedCall.DelayedCall(call, delay, args, true);
            return delayedCall;
        }
    }
    this.toPool = function (delayedCall) {
        // reset any object-references, to make sure we don't prevent any
        // garbage collection
        delayedCall.mCall = null;
        delayedCall.mArgs = null;
        // delayedCall.removeEventListeners();
        this.sDelayedCallPool[this.sDelayedCallPool.length] = delayedCall;
    }
}
$T.delayedCallPool = new DelayedCallPool();

function Transitions() {
    this.LINEAR = "linear";
    this.EASE_IN = "easeIn";
    this.EASE_OUT = "easeOut";
    this.EASE_IN_OUT = "easeInOut";
    this.EASE_OUT_IN = "easeOutIn";
    this.EASE_IN_BACK = "easeInBack";
    this.EASE_OUT_BACK = "easeOutBack";
    this.EASE_IN_OUT_BACK = "easeInOutBack";
    this.EASE_OUT_IN_BACK = "easeOutInBack";
    this.EASE_IN_ELASTIC = "easeInElastic";
    this.EASE_OUT_ELASTIC = "easeOutElastic";
    this.EASE_IN_OUT_ELASTIC = "easeInOutElastic";
    this.EASE_OUT_IN_ELASTIC = "easeOutInElastic";
    this.EASE_IN_BOUNCE = "easeInBounce";
    this.EASE_OUT_BOUNCE = "easeOutBounce";
    this.EASE_IN_OUT_BOUNCE = "easeInOutBounce";
    this.EASE_OUT_IN_BOUNCE = "easeOutInBounce";

    this.sTransitions = null;
    this.getTransition = function (name) {
        if (this.sTransitions == null)
            this.registerDefaults();
        return this.sTransitions[name];
    }
    this.register = function (name, func) {
        if (this.sTransitions == null)
            this.registerDefaults();
        this.sTransitions[name] = func;
    }
    this.registerDefaults = function () {
        this.sTransitions = new Array();

        this.register(this.LINEAR, this.linear);
        this.register(this.EASE_IN, this.easeIn);
        this.register(this.EASE_OUT, this.easeOut);
        this.register(this.EASE_IN_OUT, this.easeInOut);
        this.register(this.EASE_OUT_IN, this.easeOutIn);
        this.register(this.EASE_IN_BACK, this.easeInBack);
        this.register(this.EASE_OUT_BACK, this.easeOutBack);
        this.register(this.EASE_IN_OUT_BACK, this.easeInOutBack);
        this.register(this.EASE_OUT_IN_BACK, this.easeOutInBack);
        this.register(this.EASE_IN_ELASTIC, this.easeInElastic);
        this.register(this.EASE_OUT_ELASTIC, this.easeOutElastic);
        this.register(this.EASE_IN_OUT_ELASTIC, this.easeInOutElastic);
        this.register(this.EASE_OUT_IN_ELASTIC, this.easeOutInElastic);
        this.register(this.EASE_IN_BOUNCE, this.easeInBounce);
        this.register(this.EASE_OUT_BOUNCE, this.easeOutBounce);
        this.register(this.EASE_IN_OUT_BOUNCE, this.easeInOutBounce);
        this.register(this.EASE_OUT_IN_BOUNCE, this.easeOutInBounce);
    }
    this.linear = function (ratio) {
        return ratio;
    }

    this.easeIn = function (ratio) {
        return ratio * ratio * ratio;
    }

    this.easeOut = function (ratio) {
        var invRatio = ratio - 1.0;
        return invRatio * invRatio * invRatio + 1;
    }

    this.easeInOut = function (ratio) {
        return this.easeCombined(this.easeIn, this.easeOut, ratio);
    }

    this.easeOutIn = function (ratio) {
        return this.easeCombined(this.easeOut, this.easeIn, ratio);
    }

    this.easeInBack = function (ratio) {
        var s = 1.70158;
        return Math.pow(ratio, 2) * ((s + 1.0) * ratio - s);
    }

    this.easeOutBack = function (ratio) {
        var invRatio = ratio - 1.0;
        var s = 1.70158;
        return Math.pow(invRatio, 2) * ((s + 1.0) * invRatio + s) + 1.0;
    }

    this.easeInOutBack = function (ratio) {
        return this.easeCombined(this.easeInBack, this.easeOutBack, ratio);
    }

    this.easeOutInBack = function (ratio) {
        return this.easeCombined(this.easeOutBack, this.easeInBack, ratio);
    }

    this.easeInElastic = function (ratio) {
        if (ratio == 0 || ratio == 1)
            return ratio;
        else {
            var p = 0.3;
            var s = p / 4.0;
            var invRatio = ratio - 1;
            return -1.0 * Math.pow(2.0, 10.0 * invRatio) * Math.sin((invRatio - s) * (2.0 * Math.PI) / p);
        }
    }

    this.easeOutElastic = function (ratio) {
        if (ratio == 0 || ratio == 1)
            return ratio;
        else {
            var p = 0.3;
            var s = p / 4.0;
            return Math.pow(2.0, -10.0 * ratio) * Math.sin((ratio - s) * (2.0 * Math.PI) / p) + 1;
        }
    }

    this.easeInOutElastic = function (ratio) {
        return this.easeCombined(this.easeInElastic, this.easeOutElastic, ratio);
    }

    this.easeOutInElastic = function (ratio) {
        return this.easeCombined(this.easeOutElastic, this.easeInElastic, ratio);
    }

    this.easeInBounce = function (ratio) {
        return 1.0 - this.easeOutBounce(1.0 - ratio);
    }

    this.easeOutBounce = function (ratio) {
        var s = 7.5625;
        var p = 2.75;
        var l;
        if (ratio < (1.0 / p)) {
            l = s * Math.pow(ratio, 2);
        } else {
            if (ratio < (2.0 / p)) {
                ratio -= 1.5 / p;
                l = s * Math.pow(ratio, 2) + 0.75;
            } else {
                if (ratio < 2.5 / p) {
                    ratio -= 2.25 / p;
                    l = s * Math.pow(ratio, 2) + 0.9375;
                } else {
                    ratio -= 2.625 / p;
                    l = s * Math.pow(ratio, 2) + 0.984375;
                }
            }
        }
        return l;
    }

    this.easeInOutBounce = function (ratio) {
        return this.easeCombined(this.easeInBounce, this.easeOutBounce, ratio);
    }

    this.easeOutInBounce = function (ratio) {
        return this.easeCombined(this.easeOutBounce, this.easeInBounce, ratio);
    }

    this.easeCombined = function (startFunc, endFunc, ratio) {
        if (ratio < 0.5)
            return 0.5 * startFunc.call($T.transitions, ratio * 2.0);
        else
            return 0.5 * endFunc.call($T.transitions, (ratio - 0.5) * 2.0) + 0.5;
    }
}
$T.transitions = new Transitions();

/**
 * 动画的核心就是长度等于（终点-起点）*（现在时间/总时间），这是最稳定的动画，没有误差
 * tween池里出来的，回归tween池，自己创建的，需要自己注销，tween内部不负责注销
 */
function Tween() {
    this.mTarget;
    this.mTransitionFunc;
    this.mTransitionName;

    this.mProperties;
    this.mStartValues;
    this.mEndValues;

    this.mOnStart;
    this.mOnUpdate;
    this.mOnRepeat;
    this.mOnComplete;

    this.mOnStartArgs;
    this.mOnUpdateArgs;
    this.mOnRepeatArgs;
    this.mOnCompleteArgs;

    this.mTotalTime;
    this.mCurrentTime;
    this.mProgress;
    this.mDelay;
    this.mRoundToInt;
    this.mNextTween;
    this.mRepeatCount;
    this.mRepeatDelay;
    this.mReverse;
    this.mCurrentCycle;
    // xp增加的
    this.isPoolTween = false;
    this.isTween = true;
    this.Tween = function (target, time, transition, isPoolTween) {
        if (transition == undefined) {
            transition = "linear";
        }
        if (isPoolTween == undefined) {
            isPoolTween = false;
        }
        this.reset(target, time, transition, isPoolTween);
    }
    this.reset = function (target, time, transition, isPoolTween) {
        if (transition == undefined) {
            transition = "linear";
        }
        if (isPoolTween == undefined) {
            isPoolTween = false;
        }
        this.isPoolTween = isPoolTween;
        this.mTarget = target;
        this.mCurrentTime = 0.0;
        this.mTotalTime = Math.max(0.0001, time);
        this.mProgress = 0.0;
        this.mDelay = this.mRepeatDelay = 0.0;
        // xp把repeat也置空,nextTween置空
        this.mOnStart = this.mOnUpdate = this.mOnRepeat = this.mOnComplete = null;
        this.mOnStartArgs = this.mOnUpdateArgs = this.mOnRepeatArgs = this.mOnCompleteArgs = null;
        this.mNextTween = null;
        this.mRoundToInt = this.mReverse = false;
        this.mRepeatCount = 1;
        this.mCurrentCycle = -1;
        this.setTransition(transition);

        if (this.mProperties) {
            this.mProperties.length = 0;
        } else {
            this.mProperties = new Array();
        }
        if (this.mStartValues) {
            this.mStartValues.length = 0;
        } else {
            this.mStartValues = new Array();
        }
        if (this.mEndValues) {
            this.mEndValues.length = 0;
        } else {
            this.mEndValues = new Array();
        }
        EventDispatcher.apply(this);
        return this;
    }
    this.animate = function (getValue, setValue, endValue) {
        if (this.mTarget == null)
            return; // tweening null just does nothing.

        this.mProperties[this.mProperties.length] = setValue;
        this.mStartValues[this.mStartValues.length] = getValue.call(this.mTarget);
        this.mEndValues[this.mEndValues.length] = endValue;
    }
    this.advanceTime = function (time) {
        if (time == 0 || (this.mRepeatCount == 1 && this.mCurrentTime == this.mTotalTime))
            return;

        var i;
        var previousTime = this.mCurrentTime;
        var restTime = this.mTotalTime - this.mCurrentTime;
        var carryOverTime = time > restTime ? time - restTime : 0.0;

        this.mCurrentTime += time;

        if (this.mCurrentTime <= 0)
            return; // the delay is not over yet
        else if (this.mCurrentTime > this.mTotalTime)
            this.mCurrentTime = this.mTotalTime;
        // xp上一次时间小于等于0，当前时间大于0 才说明tween开始了mCurrentTime<=0 return
        // 这里mCurrentTime是肯定大于0的所以mCurrentTime > 0可以删除
        if (this.mCurrentCycle < 0 && previousTime <= 0) {
            this.mCurrentCycle++;
            if (this.mOnStart != null)
                this.mOnStart.call(this, this.mOnStartArgs);
        }

        var ratio = this.mCurrentTime / this.mTotalTime;
        var reversed = this.mReverse && (this.mCurrentCycle % 2 == 1);
        var numProperties = this.mStartValues.length;
        this.mProgress = reversed ? this.mTransitionFunc.call($T.transitions, 1.0 - ratio) : this.mTransitionFunc.call($T.transitions, ratio);
        // xp这块写得非常好，都是长度乘以比值，这样就不会有误差
        for (i = 0; i < numProperties; ++i) {
            // if (isNaN(mStartValues[i]))
            // if (this.mStartValues[i] != this.mStartValues[i]) // isNaN check
            // - "isNaN" causes allocation!
            // this.mStartValues[i] = this.mTarget[this.mProperties[i]];

            var startValue = this.mStartValues[i];
            var endValue = this.mEndValues[i];
            var delta = endValue - startValue;

            var currentValue = startValue + this.mProgress * delta;
            if (this.mRoundToInt)
                currentValue = Math.round(currentValue);
            this.mProperties[i].call(this.mTarget, currentValue);
            // this.mTarget[this.mProperties[i]] = currentValue;
        }

        if (this.mOnUpdate != null)
            this.mOnUpdate.call(this, this.mOnUpdateArgs);
        // xp 这块也是，只有可能等于
        if (previousTime < this.mTotalTime && this.mCurrentTime == this.mTotalTime) {
            if (this.mRepeatCount == 0 || this.mRepeatCount > 1) {
                this.mCurrentTime = -this.mRepeatDelay;
                this.mCurrentCycle++;
                if (this.mRepeatCount > 1)
                    this.mRepeatCount--;
                if (this.mOnRepeat != null)
                    this.mOnRepeat.call(this, this.mOnRepeatArgs);
            } else {
                // xp这块写的太牛逼了，保存成功回调函数和回调参数，防止派发事件的时候清理这些属性，很安全
                // save callback & args: they might be changed through an event
                // listener
                var onComplete = this.mOnComplete;
                var onCompleteArgs = this.mOnCompleteArgs;

                // in the 'onComplete' callback, people might want to call
                // "tween.reset" and
                // add it to another juggler; so this event has to be dispatched
                // *before*
                // executing 'onComplete'.
                this.dispatchEventWith($T.tweenEventType.REMOVE_FROM_JUGGLER);
                if (onComplete != null)
                    onComplete.call(this, onCompleteArgs);
            }
        }
        // xp 这块也不用担心，advanceTime开头有限制，如果是完成了，直接返回
        if (carryOverTime)
            this.advanceTime(carryOverTime);
    }
    // this.getEndValue = function(property)
    // {
    // var index = this.mProperties.indexOf(property);
    // if (index == -1) return null;
    // else return this.mEndValues[index];
    // }
    this.isComplete = function () {
        // xp 这块也是，只有可能等于
        return this.mCurrentTime == this.mTotalTime && this.mRepeatCount == 1;
    }
    this.setTransition = function (value) {
        this.mTransitionName = value;
        this.mTransitionFunc = $T.transitions.getTransition(value);

        // if (mTransitionFunc == null)
        // throw new ArgumentError("Invalid transiton: " + value);
    }
    this.setTransitionFunc = function (value) {
        this.mTransitionName = "custom";
        this.mTransitionFunc = value;
    }
    /** xp延迟这块是先加回原先的延迟，再减去现在的延迟，没问题* */
    this.setDelay = function (value) {
        this.mCurrentTime = this.mCurrentTime + this.mDelay - value;
        this.mDelay = value;
    }
    // xp注销tween
    this.dispose = function () {
        this.mOnStart = this.mOnUpdate = this.mOnRepeat = this.mOnComplete = null;
        this.mOnStartArgs = this.mOnUpdateArgs = this.mOnRepeatArgs = this.mOnCompleteArgs = null;
        this.mTarget = null;
        this.mTransitionFunc = null;
        this.mProperties.length = 0;
        // mProperties = null;
        this.mStartValues.length = 0;
        // mStartValues = null;
        this.mEndValues.length = 0;
        // mEndValues = null;
        // 这个tween是外部创建的，应该外部注销，这里只是把引用删除
        this.mNextTween = null;
        // this.removeEventListeners();
    }
}

function TweenPool() {
    this.sTweenPool = new Array();

    this.fromPool = function (target, time, transition) {
        if (transition == undefined) {
            transition = "linear";
        }
        if (this.sTweenPool.length)
            return this.sTweenPool.pop().reset(target, time, transition, true);
        else {
            var tween = new Tween();
            tween.Tween(target, time, transition, true)
            return tween;
        }
    }

    this.toPool = function (tween) {
        // reset any object-references, to make sure we don't prevent any
        // garbage collection
        tween.mOnStart = tween.mOnUpdate = tween.mOnRepeat = tween.mOnComplete = null;
        tween.mOnStartArgs = tween.mOnUpdateArgs = tween.mOnRepeatArgs = tween.mOnCompleteArgs = null;
        tween.mTarget = null;
        tween.mTransitionFunc = null;
        // xp这里增加清除nextTween
        tween.mNextTween = null;
        // tween.removeEventListeners();
        this.sTweenPool[this.sTweenPool.length] = tween;
    }
}
$T.tweenPool = new TweenPool();

/**
 * 类
 */
function Juggler() {
    this.mObjects;
    this.mElapsedTime;
    this.Juggler = function () {
        this.mElapsedTime = 0;
        this.mObjects = new Array();
    }
    /***************************************************************************
     * xp放入的这个对象必须是不在这个数组里，如果在了，就不再继续增加了，防止多次添加的错误
     * 如果这个对象是事件对象，监听一个REMOVE_FROM_JUGGLER的事件（无回调）
     **************************************************************************/
    this.add = function (object) {
        if (object && $T.arrayTools.indexOf(this.mObjects, object) == -1) {
            this.mObjects[this.mObjects.length] = object;

            // var dispatcher:EventDispatcher = object as EventDispatcher;
            if (object.isEventDispatcher)
                object.addEventListener($T.tweenEventType.REMOVE_FROM_JUGGLER, this.onRemove, this);
        }
    }
    /** xp判断是否这个对象（无回调）* */
    this.contains = function (object) {
        return $T.arrayTools.indexOf(this.mObjects, object) != -1;
    }
    /***************************************************************************
     * xp移除一个对象，如果这个对象是事件对象就移除REMOVE_FROM_JUGGLER事件监听，然后把这个数组的这个对象位置置空,
     * 置空是有意义的，因为在调用动画时，可能会动态的增加动画，置空了，可以控制新加入的动画，在下一帧在做操作（无回调）
     * 如果是tween池里出来的，并且是主动调用，而不是事件调用，就把他回放到tween池
     **************************************************************************/
    this.remove = function (object, event) {
        if (object == null)
            return;

        // var dispatcher:EventDispatcher = object as EventDispatcher;
        if (object.isEventDispatcher)
            object.removeEventListener($T.tweenEventType.REMOVE_FROM_JUGGLER, this.onRemove);

        // var tween:Tween = object as Tween;
        if (object.isTween && event == null && object.isPoolTween)
            this.onPooledTweenComplete(object);
        // var delayedCall:DelayedCall = object as DelayedCall;
        if (object.isDelayedCall && event == null && object.isPoolDelayedCall)
            this.onPooledDelayedCallComplete(object);

        var index = $T.arrayTools.indexOf(this.mObjects, object);
        if (index != -1)
            this.mObjects[index] = null;
    }
    /***************************************************************************
     * xp移除这个对象的所有tween，tween肯定是事件类，所以移除REMOVE_FROM_JUGGLER事件（无回调）
     * 这个方法总觉得有问题，移除的时候，如果tween不是pool出来的，必须在外面手动施放，一定得注意
     **************************************************************************/
    this.removeTweens = function (target) {
        if (target == null)
            return;

        for (var i = this.mObjects.length - 1; i >= 0; --i) {
            var tween = this.mObjects[i];
            if (tween.isTween && tween.mTarget == target) {
                tween.removeEventListener($T.tweenEventType.REMOVE_FROM_JUGGLER, this.onRemove);
                // xp这个很安全的，如果是移除事件监听，也不会移除当前这次事件的监听
                if (tween.isPoolTween)
                    this.onPooledTweenComplete(tween);
                this.mObjects[i] = null;
            }
        }
    }
    this.containsTweens = function (target) {
        if (target == null)
            return false;

        for (var i = this.mObjects.length - 1; i >= 0; --i) {
            var tween = this.mObjects[i];
            if (tween.isTween && tween.mTarget == target)
                return true;
        }

        return false;
    }
    this.delayCall = function (call, delay, args) {
        if (call == undefined)
            return null;

        var delayedCall = $T.delayedCallPool.fromPool(call, delay, args);
        // delayedCall.addEventListener(Event.REMOVE_FROM_JUGGLER,
        // onPooledDelayedCallComplete);
        this.add(delayedCall);

        return delayedCall;
    }
    this.repeatCall = function (call, interval, repeatCount, args) {
        if (call == undefined)
            return null;
        if (repeatCount == undefined)
            repeatCount = 0;
        var delayedCall = $T.delayedCallPool.fromPool(call, interval, args);
        delayedCall.mRepeatCount = repeatCount;
        // delayedCall.addEventListener(Event.REMOVE_FROM_JUGGLER,
        // onPooledDelayedCallComplete);
        this.add(delayedCall);

        return delayedCall;
    }
    this.onPooledDelayedCallComplete = function (delayedCall) {
        $T.delayedCallPool.toPool(delayedCall);
    }
    /***************************************************************************
     * xp使用tween对象池，创建tween，优先把所有属性先判断tween有没有，如果有算tween的，如果没有判断tween驱动的对象有没有，有则设置驱动对象往这个值改变，
     * 然后监听REMOVE_FROM_JUGGLER用来回收tween，最后再加入动画列表（无回调）
     **************************************************************************/

    this.tween = function (target, time, properties) {
        var tween = $T.tweenPool.fromPool(target, time);

        for (var property in properties) {
            var value = properties[property];

            if (tween.hasOwnProperty(property))
                tween[property] = value;
            else if (target.hasOwnProperty(property))
                tween.animate(property, value);
            // else
            // throw new ArgumentError("Invalid property: " + property);
        }

        // tween.addEventListener(Event.REMOVE_FROM_JUGGLER,
        // onPooledTweenComplete);
        this.add(tween);
        return tween;
    }
    this.onPooledTweenComplete = function (tween) {
        $T.tweenPool.toPool(tween);
    }
    /***************************************************************************
     * xp
     * 回调的时候添加没问题，在下一帧执行，移除的话也处理好了，只是置空，保证后续添加的在下一帧执行，如果在回调的时候，移除了这个列表里面的一个，如果他在
     * 还没有执行的那段，就不会在执行了，这会不会有问题（？）
     **************************************************************************/
    this.advanceTime = function (time) {
        var numObjects = this.mObjects.length;
        var currentIndex = 0;
        var i;

        this.mElapsedTime += time;
        if (numObjects == 0)
            return;

        // there is a high probability that the "advanceTime" function modifies
        // the list
        // of animatables. we must not process new objects right now (they will
        // be processed
        // in the next frame), and we need to clean up any empty slots in the
        // list.

        // xp把固定数量的动画，放到数组的前端，并执行，是空的全部放入后端
        for (i = 0; i < numObjects; ++i) {
            var object = this.mObjects[i];
            if (object) {
                // shift objects into empty slots along the way
                if (currentIndex != i) {
                    this.mObjects[currentIndex] = object;
                    this.mObjects[i] = null;
                }

                object.advanceTime(time);
                ++currentIndex;
            }
        }

        if (currentIndex != i) {
            numObjects = this.mObjects.length; // count might have changed!

            while (i < numObjects)
                this.mObjects[currentIndex++] = this.mObjects[i++];

            this.mObjects.length = currentIndex;
        }
    }
    /** xp移除，如果是tween，并且这个tween完成了，执行下一个tween，如果发布REMOVE_FROM_JUGGLER事件，就会调用这个方法，并且执行下一个tween* */
    this.onRemove = function (event) {
        this.remove(event.mTarget, event);

        if (event.mTarget.isTween && event.mTarget.isComplete)
            this.add(event.mTarget.nextTween);
        // xp等tween的nextTween放入，在回收tween
        if (event.mTarget.isTween && event.mTarget.isPoolTween)
            this.onPooledTweenComplete(event.mTarget);
        if (event.mTarget.isDelayedCall && event.mTarget.isPoolDelayedCall)
            this.onPooledDelayedCallComplete(event.mTarget);

    }
}

/**
 * 全局 依赖Juggler
 */
function JugglerManager() {
    this.processTime = 0;
    this.oneJuggler = "";
    this.twoJuggler = "";
    this.threeJuggler = "";
    this.fourJuggler = "";
    this.intervalId = "";
    this.isStop = false;
    this.init = function () {
        this.processTime = new Date().getTime();
        this.oneJuggler = new Juggler();
        this.oneJuggler.Juggler();
        this.twoJuggler = new Juggler();
        this.twoJuggler.Juggler();
        this.threeJuggler = new Juggler();
        this.threeJuggler.Juggler();
        this.fourJuggler = new Juggler();
        this.fourJuggler.Juggler();
        this.intervalId = setInterval(this.onEnterFrame, 25);
    }
    this.onEnterFrame = function () {
        var now = new Date().getTime();
        var passedTime = (now - $T.jugglerManager.processTime) / 1000.0;
        $T.jugglerManager.processTime = now;
        if (passedTime == 0.0 || this.isStop) {
            return;
        }
        $T.jugglerManager.oneJuggler.advanceTime(passedTime);
        $T.jugglerManager.twoJuggler.advanceTime(passedTime);
        $T.jugglerManager.threeJuggler.advanceTime(passedTime);
        $T.jugglerManager.fourJuggler.advanceTime(passedTime);
    }
}
$T.jugglerManager = new JugglerManager();
$T.jugglerManager.init();

function Version() {
    this.NAME = "v1.0.0";
    this.addVersionToUrl = function (url) {
        var index = url.indexOf("?");
        if (index == -1) {
            url += "?v=" + this.NAME;
        } else {
            url += "&v=" + this.NAME;
        }
        return url;
    }
    this.addVersionAndTimeToUrl = function (url) {
        url = this.addVersionToUrl(url) + "&t=" + new Date().getTime();
        return url;
    }
    this.loadScript = function (script) {
        document.write("<script src='" + this.addVersionToUrl(script) + "' language='javascript' type='text/javascript'></script>");
    }
    this.loadCss = function (css) {
        document.write("<link href='" + this.addVersionToUrl(css) + "' rel='stylesheet' type='text/css'/>");
    }
    this.initLoad = function () {
        // 消息
        this.loadScript("js/threecss-c/mvc/Notification.js");
        this.loadScript("js/threecss-c/mvc/ViewManager.js");
        // http
        this.loadScript("js/threecss-c/http/HttpConfigNormal.js");
        this.loadScript("js/threecss-c/http/HttpConfig.js");
        this.loadScript("js/threecss-c/http/HttpResultFilter.js");
        this.loadScript("js/threecss-c/http/SendParamNormal.js");
        this.loadScript("js/threecss-c/http/SendParam.js");
        this.loadScript("js/threecss-c/http/TestFilter.js");

        // 工具
        this.loadScript("js/threecss-c/tools/ArrayTools.js");
        this.loadScript("js/threecss-c/display/DisplayObject.js");
        // 事件
        this.loadScript("js/threecss-c/event/Event.js");
        this.loadScript("js/threecss-c/event/EventPool.js");
        this.loadScript("js/threecss-c/event/EventDispatcher.js");
        // 动画
        this.loadScript("js/threecss-c/tween/TweenEventType.js");
        this.loadScript("js/threecss-c/tween/DelayedCall.js");
        this.loadScript("js/threecss-c/tween/DelayedCallPool.js");
        this.loadScript("js/threecss-c/tween/Transitions.js");
        this.loadScript("js/threecss-c/tween/Tween.js");
        this.loadScript("js/threecss-c/tween/TweenPool.js");
        this.loadScript("js/threecss-c/tween/Juggler.js");
        this.loadScript("js/threecss-c/tween/JugglerManager.js");

        this.loadScript("js/threecss-c/http/HttpUtilNormal.js");
        this.loadScript("js/threecss-c/http/HttpUtil.js");
        // 资源
        this.loadScript("js/threecss-c/resource/ResourceEventType.js");
        this.loadScript("js/threecss-c/resource/Loader.js");
        this.loadScript("js/threecss-c/resource/ResourceManager.js");
        // 注册
        this.loadScript("js/threecss-c/Register.js");
        // 模块
        this.loadScript("js/threecss-c/module/ModuleData.js");
        this.loadScript("js/threecss-c/module/ModuleManager.js");
        // websocket
        this.loadScript("js/threecss-c/websocket/WebSocketConfig.js");
        this.loadScript("js/threecss-c/websocket/WebSocketEventType.js");
        this.loadScript("js/threecss-c/websocket/WebSocketClient.js");

    }
    this.init = function (name) {
		if(name != null){
			this.NAME = name;
		}
    }

}
$T.version = new Version();

function HttpUtilNormal() {
    this.lockMap = [];// 锁请求用的
    this.send = function (sendParam) {
        if (sendParam.url == null) {
            alert("url不能为空");
            return;
        }
        var form;
        if (sendParam.fileArray != null) {
            try {
                form = new FormData();
            } catch (e) {
                alert("浏览器不支持FormData");
                return;
            }
        }
        if (sendParam.successHandle == null || sendParam.object == null) {
            alert("successHandle或object不能为空");
            return;
        }
        if (sendParam.type == $T.httpConfigNormal.TYPE_POST) {
            if (sendParam.data == null) {
                alert("发送post请求，data不能为空");
                return;
            }
        }

        if (!sendParam.canContinuous && this.lockMap[sendParam.lockKey] == 1) {
            // 发送消息，不能重复请求
            return;
        }
        if (!sendParam.canContinuous && sendParam.lockKey != null) {
            this.lockMap[sendParam.lockKey] = 1;
        }
        var xMLHttpRequest = new XMLHttpRequest();
        if (xMLHttpRequest == null) {
            if (!sendParam.canContinuous && sendParam.lockKey != null) {
                delete this.lockMap[sendParam.lockKey];
            }
            alert("浏览器不支持ajax请求");
            return;
        }
        if (sendParam.loadType != null) {
            // 发送消息，显示某种请求样式
            $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notification.SEND_HTTP_START, sendParam.loadType));
        }
        var url;
        if (sendParam.isStatic) {
            url = $T.version.addVersionToUrl(sendParam.url);
        } else {
            url = $T.version.addVersionAndTimeToUrl(sendParam.url);
        }
        xMLHttpRequest.open(sendParam.type, url, sendParam.async);
        if (sendParam.headerKey != null && sendParam.headerKey.length > 0) {
            for (var i = 0; i < sendParam.headerKey.length; i++) {
                xMLHttpRequest.setRequestHeader(sendParam.headerKey[i], sendParam.headerValue[i]);
            }
        }
        if (sendParam.fileArray != null) {
            for (var i = 0; i < sendParam.fileArray.length; i++) {
                var file = sendParam.fileArray[i];
                form.append("file" + i, file);
            }
            form.append($T.httpConfigNormal.PACKET, encodeURI(JSON.stringify(sendParam.data)));
        }
        this.addHttpListener(xMLHttpRequest, this.sendReturn, sendParam);
        sendParam.startTime = new Date().getTime();
        if (form != null) {
            xMLHttpRequest.send(form);
        } else {
            if (sendParam.type == $T.httpConfigNormal.TYPE_POST) {
				xMLHttpRequest.setRequestHeader('Content-Type', 'application/json');
                xMLHttpRequest.send(JSON.stringify(sendParam.data));
            } else {
                xMLHttpRequest.send();
            }
        }

    }
    this.addHttpListener = function (xMLHttpRequest, sendReturn, sendParam) {
        var onReadyStateHandle = sendReturn;
        if (sendParam != null) {
            onReadyStateHandle = function (event) {
                sendReturn.call(xMLHttpRequest, event, sendParam);
            }
        }
        xMLHttpRequest.onreadystatechange = onReadyStateHandle;

    }
    this.sendReturn = function (event, sendParam) {
        if (this.readyState == 4) {
            sendParam.endTime = new Date().getTime();
            // 删除请求
            if (!sendParam.canContinuous && sendParam.lockKey != null) {
                delete $T.httpUtilNormal.lockMap[sendParam.lockKey];
            }
            if (sendParam.loadType != null) {
                // 发送消息，关闭某种请求样式
                $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notification.SEND_HTTP_END, sendParam.loadType));
            }
            if (this.status == 200) {
                var result;
                if (sendParam.returnType == $T.httpConfigNormal.RETURN_TYPE_JSON) {
                    try {
                        result = JSON.parse(this.responseText);
                    } catch (e) {
                        // 发送错误消息
                        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notification.SYSTEM_ERROR, "json eval error"));
                        // 回调错误函数
                        if (sendParam.failHandle != null) {
                            sendParam.failHandle.call(sendParam.object, null, sendParam);
                        }
                        alert("json解析异常");
                        return;
                    }
                } else if (sendParam.returnType == $T.httpConfigNormal.RETURN_TYPE_HTML) {
                    result = this.responseText;
                }
                var bool = $T.httpResultFilter.filter(result, sendParam);
                if (bool) {
                    // 回调正确函数
                    sendParam.successHandle.call(sendParam.object, result, sendParam);
                } else {
                    // 回调错误函数
                    if (sendParam.failHandle != null) {
                        sendParam.failHandle.call(sendParam.object, result, sendParam);
                    }
                }
            } else {
                // 发送错误消息
                $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notification.SYSTEM_ERROR, "http return status" + this.status));
                // 回调错误函数
                if (sendParam.failHandle != null) {
                    sendParam.failHandle.call(sendParam.object, null, sendParam);
                }
            }

        } else if (this.readyState == 2) {

        } else if (this.readyState == 3) {

        } else {

        }

    }

}
$T.httpUtilNormal = new HttpUtilNormal();

function HttpUtil() {
    this.send = function (sendParam) {
        if (sendParam.data == null) {
            alert("发送post请求，data不能为空");
            return;
        }
        if (sendParam.data[$T.httpConfig.HOPCODE] == null) {
            alert("发送post请求，data[$T.httpConfig.HOPCODE]不能为空");
            return;
        }
        sendParam.lockKey = sendParam.data[$T.httpConfig.HOPCODE];
        sendParam.headerKey = [];
        sendParam.headerValue = [];
        sendParam.headerKey.push($T.httpConfig.HOPCODE);
        sendParam.headerValue.push(sendParam.data[$T.httpConfig.HOPCODE]);
        if (sendParam.token != null) {
            sendParam.headerKey.push($T.httpConfig.TOKEN);
            sendParam.headerValue.push(sendParam.token);
        }
        if (sendParam.fileArray != null) {
            if (sendParam.fileUuid != null) {
                sendParam.headerKey.push($T.httpConfig.FILE_UUID);
                sendParam.headerValue.push(sendParam.fileUuid);
            }
            sendParam.headerKey.push($T.httpConfig.PACKET);
            sendParam.headerValue.push(encodeURI(JSON.stringify(sendParam.data)));
        }
        $T.httpUtilNormal.send(sendParam);
    }

    this.getRequestUrl = function (sendParam) {
        var packet = encodeURI(JSON.stringify(sendParam.data));
        return sendParam.url + "?" + $T.httpConfig.HOPCODE + "=" + sendParam.data[$T.httpConfig.HOPCODE] + "&token=" + sendParam.token + "&sendType=" + sendParam.sendType + "&receiveType=" + sendParam.receiveType + "&packet=" + packet;
    }

}
$T.httpUtil = new HttpUtil();

function ResourceEventType() {
    /** 加载完成 */
    this.LOAD_COMPLETE = "loadComplete";
}
$T.resourceEventType = new ResourceEventType();

function Loader() {
    this.url;
    this.resultArray = [];
    this.num = 0;
    this.obj;
    this.Loader = function (url) {
        this.url = url;
        EventDispatcher.apply(this);
    }
    this.load = function () {
        for (var i = 0; i < this.url.length; i++) {
            var sendParam = new SendParamNormal();
            sendParam.successHandle = this.loadSuccess;
            sendParam.failHandle = this.loadFail;
            sendParam.object = this;
            sendParam.type = $T.httpConfig.TYPE_GET;
            sendParam.url = this.url[i];
            sendParam.returnType = $T.httpConfig.RETURN_TYPE_HTML;
            sendParam.isStatic = true;
            sendParam.lockKey = this.url[i];
            $T.httpUtilNormal.send(sendParam);
        }

    }
    this.loadSuccess = function (result, sendParam) {
        this.resultArray[sendParam.url] = result;
        this.num++;
        if (this.num == this.url.length) {
            this.dispatchEventWith($T.resourceEventType.LOAD_COMPLETE);
        }
    }
    this.loadFail = function () {

    }
}

function ResourceManager() {
    this.resource = [];
    this.loadResource = function (url, callBack) {
        var loader = new Loader();
        loader.Loader(url);
        loader.obj = callBack;
        loader.addEventListener($T.resourceEventType.LOAD_COMPLETE, this.loadComplete, this);
        loader.load();
    }
    this.loadComplete = function (event) {
        event.mTarget.removeEventListener($T.resourceEventType.LOAD_COMPLETE, this.loadComplete);
        for (var i = 0; i < event.mTarget.url.length; i++) {
            var url = event.mTarget.url[i];
            this.resource[url] = event.mTarget.resultArray[url];
        }
        event.mTarget.obj.call(null, event.mTarget.url);
    }
    this.getResource = function (url) {
        return this.resource[url];
    }
}
$T.resourceManager = new ResourceManager();

function Register() {
    this.register = function (mediator) {
        if (mediator.init == null) {
            alert("mediator没有init方法");
            return false;
        }
        if (mediator.dispose == null) {
            alert("mediator没有dispose方法");
            return false;
        }
        if (mediator.handleNotification == null) {
            alert("mediator没有handleNotification方法");
            return false;
        }
        if (mediator.listNotificationInterests == null) {
            alert("mediator没有listNotificationInterests数组");
            return false;
        }
        $T.viewManager.registerObserverArray(mediator.listNotificationInterests, mediator);
        if (mediator.advanceTime != undefined) {
            $T.jugglerManager.fourJuggler.add(mediator);
        }
        mediator.isInit = true;
    }
    this.unRegister = function (mediator) {
        $T.viewManager.removeObserverArray(mediator.listNotificationInterests, mediator);
        if (mediator.advanceTime != undefined) {
            $T.jugglerManager.fourJuggler.remove(mediator);
        }
        mediator.isInit = false;
    }
}
$T.register = new Register();

function ModuleData() {
    this.view;
    this.type;
    this.mediator;
    this.data;
}


function ModuleManager() {
    this.moduleUrlToData = [];
    this.moduleTypeToData = [];
    this.loadModule = function (url, view, type, mediator, data) {
        var moduleData = new ModuleData();
        moduleData.view = view;
        moduleData.type = type;
        moduleData.mediator = mediator;
        moduleData.data = data;
        this.moduleUrlToData[url] = moduleData;
        $T.resourceManager.loadResource([url], this.loadComplete);
    }
    this.loadComplete = function (url) {
        var moduleData = $T.moduleManager.moduleUrlToData[url[0]];
        if (moduleData == null) {
            // 还没加载完成就卸载了
            return;
        }
        var resource = $T.resourceManager.getResource(url[0]);
        if (moduleData.type != null) {
            var oldModuleData = $T.moduleManager.moduleTypeToData[moduleData.type];
            if (oldModuleData != null) {
                $T.register.unRegister(oldModuleData.mediator);
                oldModuleData.mediator.dispose();

            }
            $T.moduleManager.moduleTypeToData[moduleData.type] = moduleData;
        }
        moduleData.view.innerHTML = resource;
        moduleData.mediator.init(moduleData.view, moduleData.data);
        $T.register.register(moduleData.mediator);
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notification.MODULE_INIT_COMPLETE, url));
    }
    this.unLoadModule = function (url) {
        var moduleData = this.moduleUrlToData[url];
        if (moduleData != null) {
            if (moduleData.mediator.isInit) {
                $T.register.unRegister(moduleData.mediator);
                moduleData.mediator.dispose();
            }
            delete this.moduleUrlToData[url];
            delete this.moduleTypeToData[moduleData.type];
        }
    }
}
$T.moduleManager = new ModuleManager();

function WebSocketConfig() {
    this.WSOPCODE = "wsOpCode";// 操作码
}
$T.webSocketConfig = new WebSocketConfig();

function WebSocketEventType() {
    // 链接完成
    this.CONNECTED = "connected";
    // 关闭
    this.CLOSE = "close";
    // 接到消息
    this.MESSAGE = "message";
    this.getMessage = function (wsOpCode) {
        return this.MESSAGE + "_" + wsOpCode;
    }
}
$T.webSocketEventType = new WebSocketEventType();

function WebSocketClient() {
    this.webSocket;
    this.isConnected = false;
    this.url;
    this.WebSocketClient = function (url) {
        this.url = url;
        this.connect();
        EventDispatcher.apply(this);
    }
    this.connect = function () {
        this.webSocket = new WebSocket(this.url);
        this.onOpenListener(this, this.onOpen);
        this.onCloseListener(this, this.onClose);
        this.onErrorListener(this, this.onError);
        this.onMessageListener(this, this.onMessage);
    }
    this.onOpenListener = function (webSocketClient, call) {
        var callFunc = function (event) {
            call.call(webSocketClient, event);
        }
        webSocketClient.webSocket.onopen = callFunc;

    }
    this.onCloseListener = function (webSocketClient, call) {
        var callFunc = function (event) {
            call.call(webSocketClient, event);
        }
        webSocketClient.webSocket.onclose = callFunc;

    }
    this.onErrorListener = function (webSocketClient, call) {
        var callFunc = function (event) {
            call.call(webSocketClient, event);
        }
        webSocketClient.webSocket.onerror = callFunc;

    }
    this.onMessageListener = function (webSocketClient, call) {
        var callFunc = function (event) {
            call.call(webSocketClient, event);
        }
        webSocketClient.webSocket.onmessage = callFunc;

    }
    this.onOpen = function (event) {
        this.isConnected = true;
        this.dispatchEventWith($T.webSocketEventType.CONNECTED);
    }
    this.send = function (data) {
        if (!this.isConnected) {
            alert("未链接至websocket服务器");
            return;
        }
        var blob = new Blob([JSON.stringify(data)]);
        this.webSocket.send(blob);
    }
    this.onMessage = function (event) {
        var data = eval('(' + event.data + ')');
        if (data[$T.webSocketConfig.WSOPCODE] == null) {
            return;
        }
        this.dispatchEventWith($T.webSocketEventType.getMessage(data[$T.webSocketConfig.WSOPCODE]), false, data);
    }
    this.onClose = function (event) {
        this.isConnected = false;
        this.dispatchEventWith($T.webSocketEventType.CLOSE);
    }
    this.onError = function (event) {

    }
    this.close = function () {
        this.webSocket.close();
    }
}
