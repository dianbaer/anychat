(function (window) {
    if (!window.juggle) window.juggle = {};
    var Tools = function () {
        /**
         * 判断数组里是否包含该对象
         * @param array
         * @param obj
         * @returns {number}
         */
        this.indexOf = function (array, obj) {
            var index = -1;
            if (array === null || obj === null) {
                return index;
            }
            for (var i = 0; i < array.length; i++) {
                if (array[i] === obj) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        /**
         * 判断对象是否为空
         * @param obj
         * @returns {boolean}
         */
        this.isNull = function (obj) {
            return obj === null || obj === undefined;
        }
    };
    window.juggle.tools = new Tools();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    /**
     * 创建事件
     * @param type 类型
     * @param bubbles 是否冒泡
     * @param data 携带数据
     * @constructor
     */
    var Event = function (type, bubbles, data) {
        //发起事件的对象
        this.mTarget = null;
        //监听到事件的对象
        this.mCurrentTarget = null;
        //事件类型
        this.mType = null;
        //是否冒泡
        this.mBubbles = null;
        //是否阻止向上冒泡
        this.mStopsPropagation = null;
        //是否阻止派发事件
        this.mStopsImmediatePropagation = null;
        //携带数据
        this.mData = null;
        /** 阻止向上冒泡，本次循环派发事件不阻止（无回调）* */
        this.stopPropagation = function () {
            this.mStopsPropagation = true;
        };
        /** 停止派发事件（无回调）* */
        this.stopImmediatePropagation = function () {
            this.mStopsPropagation = this.mStopsImmediatePropagation = true;
        };
        /**
         * 重置事件
         * @param type
         * @param bubbles
         * @param data
         * @returns {Event}
         */
        this.reset = function (type, bubbles, data) {
            if (tools.isNull(bubbles)) {
                bubbles = false;
            }
            if (tools.isNull(data)) {
                data = null;
            }
            this.mType = type;
            this.mBubbles = bubbles;
            this.mData = data;
            this.mTarget = this.mCurrentTarget = null;
            this.mStopsPropagation = this.mStopsImmediatePropagation = false;
            return this;
        };
        this.reset(type, bubbles, data);
    };
    window.juggle.Event = Event;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var Event = window.juggle.Event;
    var EventPool = function () {
        this.sEventPool = [];
        /** 取事件池里面的事件，并且对事件进行重置（无回调）* */
        this.fromPool = function (type, bubbles, data) {
            if (this.sEventPool.length)
                return this.sEventPool.pop().reset(type, bubbles, data);
            else {
                return new Event(type, bubbles, data);
            }
        };
        /** 只清理两个目标和带来的数据，是为了可以释放资源，其他的不清理，等用的时候再重置（无回调）* */
        this.toPool = function (event) {
            event.mData = event.mTarget = event.mCurrentTarget = null;
            this.sEventPool[this.sEventPool.length] = event;
        };
    };
    window.juggle.eventPool = new EventPool();
})(window);


(function (window) {
    if (!window.juggle) window.juggle = {};
    var eventPool = window.juggle.eventPool;
    var tools = window.juggle.tools;
    var sBubbleChains = [];
    /**
     * EventDispatcher.apply(this);继承此类
     * 支持冒泡，前提冒泡对象的parent不为空并且isDisplayObject是true
     * 在派发事件的回调函数内将parent设置为null，不能阻止这一次parent接到这次事件
     * 在派发事件某层级的回调函数内，移除这层级的监听或添加这层级的监听，是不会影响这次派发事件目标的改变的。
     * 靠长度阻止addEventListener，靠重新创建数组阻止removeEventListener
     * 但是如果在某层级的回调函数内，移除上层的监听或添加上层的监听，上层本轮会受到影响。
     * @constructor
     */
    var EventDispatcher = function () {
        this.mEventListeners = null;
        this.isEventDispatcher = true;
        this.functionMapping = [];
        /**
         * 动态创建，同一函数不能重复添加某类型监听（无回调）
         * @param type
         * @param listener
         * @param parent
         */
        this.addEventListener = function (type, listener, parent) {
            if (tools.isNull(this.mEventListeners))
                this.mEventListeners = [];
            var listeners = this.mEventListeners[type];
            if (tools.isNull(listeners)) {
                this.mEventListeners[type] = [listener];
                this.functionMapping[listener] = parent;
            } else if (tools.indexOf(listeners, listener) === -1) {
                listeners.push(listener);
                this.functionMapping[listener] = parent;
            }
        };
        /**
         * 移除监听，临时数组能够阻止派发事件回调函数移除事件带来的本轮影响（无回调）
         * @param type
         * @param listener
         */
        this.removeEventListener = function (type, listener) {
            if (this.mEventListeners) {
                var listeners = this.mEventListeners[type];
                var numListeners = listeners ? listeners.length : 0;
                if (numListeners > 0) {
                    var index = 0;
                    var restListeners = [];
                    for (var i = 0; i < numListeners; ++i) {
                        var otherListener = listeners[i];
                        if (otherListener !== listener)
                            restListeners[index++] = otherListener;
                    }
                    this.mEventListeners[type] = restListeners;
                }
            }
        };
        /**
         * 移除某类型监听，传空则移除所有监听（无回调）
         * @param type
         */
        this.removeEventListeners = function (type) {
            if (type && this.mEventListeners)
                delete this.mEventListeners[type];
            else
                this.mEventListeners = null;
        };
        /**
         * 派发事件
         * @param event
         */
        this.dispatchEvent = function (event) {
            var bubbles = event.mBubbles;
            //不冒泡并且无监听或者没有此类型监听，返回
            if (!bubbles && (tools.isNull(this.mEventListeners) || !(event.mType in this.mEventListeners)))
                return;
            //mTarget参数保留，没意义
            var previousTarget = event.mTarget;
            // 设置目标
            event.mTarget = this;
            // 冒泡并且是显示对象
            if (bubbles && this.isDisplayObject)
                this.bubbleEvent(event);
            else
                this.invokeEvent(event);
            if (previousTarget)
                event.mTarget = previousTarget;
        };
        /**
         * 回调，回调前确认长度和移除事件函数中重新创建数组意义非凡
         * @param event
         * @returns {*}
         */
        this.invokeEvent = function (event) {
            var listeners = this.mEventListeners ? this.mEventListeners[event.mType] : null;
            var numListeners = tools.isNull(listeners) ? 0 : listeners.length;
            if (numListeners) {
                // mCurrentTarget当前接到事件的对象
                event.mCurrentTarget = this;
                for (var i = 0; i < numListeners; ++i) {
                    var listener = listeners[i];
                    var numArgs = listener.length;
                    if (numArgs === 0)
                        listener.call(this.functionMapping[listener]);
                    else if (numArgs === 1)
                        listener.call(this.functionMapping[listener], event);
                    else
                        listener.call(this.functionMapping[listener], event, event.mData);
                    //立即阻止事件派发
                    if (event.mStopsImmediatePropagation) {
                        return true;
                    }
                }
                //是否阻止冒泡
                return event.mStopsPropagation;
            } else {
                return false;
            }
        };
        /**
         * 使用了sBubbleChains数组池，减少垃圾回收
         * 提前将冒泡数组确认存入数组，意义非凡
         * @param event
         */
        this.bubbleEvent = function (event) {
            var chain;
            var element = this;
            var length = 1;
            if (sBubbleChains.length > 0) {
                chain = sBubbleChains.pop();
                chain[0] = element;
            } else
                chain = [element];
            while (!tools.isNull(element = element.parent))
                chain[length++] = element;
            for (var i = 0; i < length; ++i) {
                var stopPropagation = chain[i].invokeEvent(event);
                if (stopPropagation)
                    break;
            }
            chain.length = 0;
            sBubbleChains.push(chain);
        };
        /**
         * 派发事件使用对象池
         * @param type
         * @param bubbles
         * @param data
         */
        this.dispatchEventWith = function (type, bubbles, data) {
            if (tools.isNull(bubbles)) {
                bubbles = false;
            }
            if (tools.isNull(data)) {
                data = null;
            }
            //如果冒泡或者自己关注这个事件了
            if (bubbles || this.hasEventListener(type)) {
                var event = eventPool.fromPool(type, bubbles, data);
                this.dispatchEvent(event);
                eventPool.toPool(event);
            }
        };
        /**
         * 是否关注这个事件
         * @param type
         * @returns {boolean}
         */
        this.hasEventListener = function (type) {
            var listeners = this.mEventListeners ? this.mEventListeners[type] : null;
            return listeners ? listeners.length !== 0 : false;
        }
    };
    window.juggle.EventDispatcher = EventDispatcher;
})(window);

(function (window) {
    if (!window.juggle) window.juggle = {};
    var JugglerEventType = function () {
        /**
         * 离开时间轴
         * @type {string}
         */
        this.REMOVE_FROM_JUGGLER = "removeFromJuggler";
    };
    window.juggle.jugglerEventType = new JugglerEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    var jugglerEventType = window.juggle.jugglerEventType;
    var Juggler = function () {
        this.mObjects = [];
        this.mElapsedTime = 0;
        /**
         * 添加对象至时间轴，同一对象不能重复添加，如果继承事件类，会监听离开时间轴的事件（无回调）
         * @param object
         */
        this.add = function (object) {
            if (object && tools.indexOf(this.mObjects, object) === -1) {
                this.mObjects[this.mObjects.length] = object;
                if (object.isEventDispatcher)
                    object.addEventListener(jugglerEventType.REMOVE_FROM_JUGGLER, this.onRemove, this);
            }
        };
        /**
         * 判断这个对象是否在时间轴（无回调）
         * @param object
         * @returns {boolean}
         */
        this.contains = function (object) {
            return tools.indexOf(this.mObjects, object) !== -1;
        };
        /**
         * 将时间轴这个对象位置置空意义非凡，能够有效的控制新加入的动画进入这次调度
         * 如果是事件类移除事件监听
         * @param object
         */
        this.remove = function (object) {
            if (tools.isNull(object))
                return;
            if (object.isEventDispatcher)
                object.removeEventListener(jugglerEventType.REMOVE_FROM_JUGGLER, this.onRemove);
            var index = tools.indexOf(this.mObjects, object);
            if (index !== -1)
                this.mObjects[index] = null;
        };
        /**
         * 动画调度，
         * 回调中新加入的动画不能在这一次被调度，因为没有经历时间过程这是合理的
         * 回调中移除的分两种可能，已经在本次调度的无影响，没有在本次调度的取消本次调度
         * @param time
         */
        this.advanceTime = function (time) {
            //确定这次调度的长度
            var numObjects = this.mObjects.length;
            var currentIndex = 0;
            var i;
            this.mElapsedTime += time;
            if (numObjects === 0)
                return;
            //回调里可能含有后面给前面移除与前面给后面移除两种
            //后面给前面移除this.mObjects这轮含有null
            //前面给后面移除会进行调换
            for (i = 0; i < numObjects; ++i) {
                var object = this.mObjects[i];
                if (object) {
                    //将后面不为空的动画对象换到前面为空的位置上
                    if (currentIndex !== i) {
                        this.mObjects[currentIndex] = object;
                        this.mObjects[i] = null;
                    }
                    object.advanceTime(time);
                    ++currentIndex;
                }
            }
            //这次应该调度的长度和实际长度不一样
            if (currentIndex !== i) {
                //这个长度在回调过程中，很有可能已经改变了，重新取一下
                numObjects = this.mObjects.length;
                //将新加入的动画与前面为空的调换
                while (i < numObjects)
                    this.mObjects[currentIndex++] = this.mObjects[i++];
                //清空后面为空的动画对象
                this.mObjects.length = currentIndex;
            }
        };
        /**
         * 接受REMOVE_FROM_JUGGLER事件
         * @param event
         */
        this.onRemove = function (event) {
            //离开动画列表，并且移除监听事件
            this.remove(event.mTarget);
        }
    };
    window.juggle.Juggler = Juggler;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var Juggler = window.juggle.Juggler;
    var JugglerManager = function () {
        this.onEnterFrame = function () {
            var now = new Date().getTime();
            var passedTime = (now - juggle.jugglerManager.processTime) / 1000.0;
            juggle.jugglerManager.processTime = now;
            if (passedTime === 0.0 || this.isStop) {
                return;
            }
            juggle.jugglerManager.juggler.advanceTime(passedTime);
        };
        this.processTime = new Date().getTime();
        this.juggler = new Juggler();
        this.intervalId = setInterval(this.onEnterFrame, 25);
        this.isStop = false;
    };
    window.juggle.jugglerManager = new JugglerManager();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var Transitions = function () {
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
            if (this.sTransitions === null)
                this.registerDefaults();
            return this.sTransitions[name];
        };
        this.register = function (name, func) {
            if (this.sTransitions === null)
                this.registerDefaults();
            this.sTransitions[name] = func;
        };
        this.registerDefaults = function () {
            this.sTransitions = [];

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
        };
        this.linear = function (ratio) {
            return ratio;
        };

        this.easeIn = function (ratio) {
            return ratio * ratio * ratio;
        };

        this.easeOut = function (ratio) {
            var invRatio = ratio - 1.0;
            return invRatio * invRatio * invRatio + 1;
        };

        this.easeInOut = function (ratio) {
            return this.easeCombined(this.easeIn, this.easeOut, ratio);
        };

        this.easeOutIn = function (ratio) {
            return this.easeCombined(this.easeOut, this.easeIn, ratio);
        };

        this.easeInBack = function (ratio) {
            var s = 1.70158;
            return Math.pow(ratio, 2) * ((s + 1.0) * ratio - s);
        };

        this.easeOutBack = function (ratio) {
            var invRatio = ratio - 1.0;
            var s = 1.70158;
            return Math.pow(invRatio, 2) * ((s + 1.0) * invRatio + s) + 1.0;
        };

        this.easeInOutBack = function (ratio) {
            return this.easeCombined(this.easeInBack, this.easeOutBack, ratio);
        };

        this.easeOutInBack = function (ratio) {
            return this.easeCombined(this.easeOutBack, this.easeInBack, ratio);
        };

        this.easeInElastic = function (ratio) {
            if (ratio === 0 || ratio === 1)
                return ratio;
            else {
                var p = 0.3;
                var s = p / 4.0;
                var invRatio = ratio - 1;
                return -1.0 * Math.pow(2.0, 10.0 * invRatio) * Math.sin((invRatio - s) * (2.0 * Math.PI) / p);
            }
        };

        this.easeOutElastic = function (ratio) {
            if (ratio === 0 || ratio === 1)
                return ratio;
            else {
                var p = 0.3;
                var s = p / 4.0;
                return Math.pow(2.0, -10.0 * ratio) * Math.sin((ratio - s) * (2.0 * Math.PI) / p) + 1;
            }
        };

        this.easeInOutElastic = function (ratio) {
            return this.easeCombined(this.easeInElastic, this.easeOutElastic, ratio);
        };

        this.easeOutInElastic = function (ratio) {
            return this.easeCombined(this.easeOutElastic, this.easeInElastic, ratio);
        };

        this.easeInBounce = function (ratio) {
            return 1.0 - this.easeOutBounce(1.0 - ratio);
        };

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
        };

        this.easeInOutBounce = function (ratio) {
            return this.easeCombined(this.easeInBounce, this.easeOutBounce, ratio);
        };

        this.easeOutInBounce = function (ratio) {
            return this.easeCombined(this.easeOutBounce, this.easeInBounce, ratio);
        };

        this.easeCombined = function (startFunc, endFunc, ratio) {
            if (ratio < 0.5)
                return 0.5 * startFunc.call(juggle.transitions, ratio * 2.0);
            else
                return 0.5 * endFunc.call(juggle.transitions, (ratio - 0.5) * 2.0) + 0.5;
        }
    };
    window.juggle.transitions = new Transitions();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    var EventDispatcher = window.juggle.EventDispatcher;
    var transitions = window.juggle.transitions;
    var jugglerEventType = window.juggle.jugglerEventType;
    /**
     * 核心在于每次调用都是开始值+（终点-起点）*（经过时间/总时间），这是最稳定的，没有任何误差
     * @param target
     * @param time
     * @param transition
     * @constructor
     */
    var Tween = function (target, time, transition) {
        //动画目标
        this.mTarget = null;
        //动画变换函数
        this.mTransitionFunc = null;
        //设置属性的函数列表
        this.mProperties = null;
        //起始值（这个值时获取属性函数自动获取到的）
        this.mStartValues = null;
        //结束值
        this.mEndValues = null;
        //每个阶段的回调函数
        this.mOnStart = null;
        this.mOnUpdate = null;
        this.mOnRepeat = null;
        this.mOnComplete = null;
        //每个阶段回调函数携带的参数
        this.mOnStartArgs = null;
        this.mOnUpdateArgs = null;
        this.mOnRepeatArgs = null;
        this.mOnCompleteArgs = null;
        //总时间
        this.mTotalTime = null;
        //当前时间
        this.mCurrentTime = null;

        //开始动画时延迟调用时间，修改这个参数没有，需要调方法setDelay
        this.mDelay = null;
        //是否取整，取整动画不平滑
        this.mRoundToInt = false;
        //0代表无限次重复，>1代表重复次数
        this.mRepeatCount = null;
        //重复动画时延迟调用间隔
        this.mRepeatDelay = null;
        //偶数轮是否逆向
        this.mReverse = null;
        //当前第几轮，初始为-1，跟mReverse参数搭配使用
        this.mCurrentCycle = null;
        this.reset = function (target, time, transition) {
            if (tools.isNull(transition)) {
                transition = "linear";
            }
            this.mTarget = target;
            this.mCurrentTime = 0.0;
            this.mTotalTime = Math.max(0.0001, time);
            this.mDelay = this.mRepeatDelay = 0.0;
            this.mOnStart = this.mOnUpdate = this.mOnRepeat = this.mOnComplete = null;
            this.mOnStartArgs = this.mOnUpdateArgs = this.mOnRepeatArgs = this.mOnCompleteArgs = null;
            this.mRoundToInt = this.mReverse = false;
            this.mRepeatCount = 1;
            this.mCurrentCycle = -1;
            this.setTransition(transition);
            if (this.mProperties) {
                this.mProperties.length = 0;
            } else {
                this.mProperties = [];
            }
            if (this.mStartValues) {
                this.mStartValues.length = 0;
            } else {
                this.mStartValues = [];
            }
            if (this.mEndValues) {
                this.mEndValues.length = 0;
            } else {
                this.mEndValues = [];
            }
            return this;
        };

        /**
         * 设置动画
         * @param getValue 获取值得方法
         * @param setValue 设置值得方法
         * @param endValue 达到值
         */
        this.animate = function (getValue, setValue, endValue) {
            if (tools.isNull(this.mTarget))
                return;
            this.mProperties[this.mProperties.length] = setValue;
            this.mStartValues[this.mStartValues.length] = getValue.call(this.mTarget);
            this.mEndValues[this.mEndValues.length] = endValue;
        };
        this.advanceTime = function (time) {
            //经历时间为0或者重复次数是1并且当前时间等于总时间
            if (time === 0 || (this.mRepeatCount === 1 && this.mCurrentTime === this.mTotalTime))
                return;
            var i;
            var restTime = this.mTotalTime - this.mCurrentTime;
            //多余的时间
            var carryOverTime = time > restTime ? time - restTime : 0.0;
            this.mCurrentTime += time;
            //小于等于0说明还没开始
            if (this.mCurrentTime <= 0)
                return;
            //大于总时间则设置等于总时间，前面已经取出多余的时间
            else if (this.mCurrentTime > this.mTotalTime)
                this.mCurrentTime = this.mTotalTime;
            //开始动画
            if (this.mCurrentCycle < 0) {
                this.mCurrentCycle++;
                if (!tools.isNull(this.mOnStart))
                    this.mOnStart.call(this, this.mOnStartArgs);
            }
            //比例
            var ratio = this.mCurrentTime / this.mTotalTime;
            //是否逆向计算
            var reversed = this.mReverse && (this.mCurrentCycle % 2 === 1);
            var numProperties = this.mStartValues.length;
            //进度
            var mProgress = reversed ? this.mTransitionFunc.call(transitions, 1.0 - ratio) : this.mTransitionFunc.call(transitions, ratio);

            for (i = 0; i < numProperties; ++i) {
                var startValue = this.mStartValues[i];
                var endValue = this.mEndValues[i];
                var delta = endValue - startValue;
                //每次都是开始值+应该增加的值，这样没有误差
                var currentValue = startValue + mProgress * delta;
                //取整
                if (this.mRoundToInt)
                    currentValue = Math.round(currentValue);
                //改变属性
                this.mProperties[i].call(this.mTarget, currentValue);
            }
            if (!tools.isNull(this.mOnUpdate))
                this.mOnUpdate.call(this, this.mOnUpdateArgs);
            //相等时
            if (this.mCurrentTime === this.mTotalTime) {
                //无限次或者大于1次
                if (this.mRepeatCount === 0 || this.mRepeatCount > 1) {
                    this.mCurrentTime = -this.mRepeatDelay;
                    this.mCurrentCycle++;
                    if (this.mRepeatCount > 1)
                        this.mRepeatCount--;
                    if (!tools.isNull(this.mOnRepeat))
                        this.mOnRepeat.call(this, this.mOnRepeatArgs);
                } else {
                    //保存成功回调函数和回调参数，防止派发事件的时候清理这些属性，很安全
                    var onComplete = this.mOnComplete;
                    var onCompleteArgs = this.mOnCompleteArgs;
                    //先派发事件，在回调完成函数
                    this.dispatchEventWith(jugglerEventType.REMOVE_FROM_JUGGLER);
                    if (!tools.isNull(onComplete))
                        onComplete.call(this, onCompleteArgs);
                }
            }
            //这块也不用担心，advanceTime开头有限制，如果是完成了，直接返回
            if (carryOverTime)
                this.advanceTime(carryOverTime);
        };

        this.isComplete = function () {
            //这块也是，只有可能等于
            return this.mCurrentTime === this.mTotalTime && this.mRepeatCount === 1;
        };
        this.setTransition = function (value) {
            this.mTransitionFunc = transitions.getTransition(value);
        };
        /**
         * 修改延迟，先加回原先的延迟，再减去现在的延迟
         * @param value
         */
        this.setDelay = function (value) {
            this.mCurrentTime = this.mCurrentTime + this.mDelay - value;
            this.mDelay = value;
        };
        this.reset(target, time, transition);
        EventDispatcher.apply(this);
    };
    window.juggle.Tween = Tween;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    var Tween = window.juggle.Tween;
    var TweenPool = function () {
        this.sTweenPool = [];

        this.fromPool = function (target, time, transition) {
            if (tools.isNull(transition)) {
                transition = "linear";
            }
            if (this.sTweenPool.length)
                return this.sTweenPool.pop().reset(target, time, transition);
            else {
                return new Tween(target, time, transition);
            }
        };

        this.toPool = function (tween) {
            tween.mOnStart = tween.mOnUpdate = tween.mOnRepeat = tween.mOnComplete = null;
            tween.mOnStartArgs = tween.mOnUpdateArgs = tween.mOnRepeatArgs = tween.mOnCompleteArgs = null;
            tween.mTarget = null;
            tween.mTransitionFunc = null;
            tween.mProperties.length = 0;
            tween.mStartValues.length = 0;
            tween.mEndValues.length = 0;
            this.sTweenPool[this.sTweenPool.length] = tween;
        }
    };
    window.juggle.tweenPool = new TweenPool();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    var jugglerEventType = window.juggle.jugglerEventType;
    var EventDispatcher = window.juggle.EventDispatcher;
    /**
     * 创建回调
     * @param call 回调函数
     * @param delay 间隔
     * @param args 携带参数
     * @constructor
     */
    var DelayedCall = function (call, delay, args) {
        this.mCurrentTime = null;
        this.mTotalTime = null;
        this.mCall = null;
        this.mArgs = null;
        //重复次数，0为无限次数
        this.mRepeatCount = null;
        this.reset = function (call, delay, args) {
            if (tools.isNull(args)) {
                args = null;
            }
            this.mCurrentTime = 0;
            this.mTotalTime = Math.max(delay, 0.0001);
            this.mCall = call;
            this.mArgs = args;
            this.mRepeatCount = 1;
            return this;
        };
        this.advanceTime = function (time) {
            var previousTime = this.mCurrentTime;
            this.mCurrentTime = Math.min(this.mTotalTime, this.mCurrentTime + time);
            if (this.mCurrentTime === this.mTotalTime) {
                if (this.mRepeatCount === 0 || this.mRepeatCount > 1) {
                    if (this.mRepeatCount > 0)
                        this.mRepeatCount -= 1;
                    this.mCurrentTime = 0;
                    if (this.mArgs === null) {
                        this.mCall.call(this);
                    } else {
                        this.mCall.call(this, this.mArgs);
                    }
                    // 精确一点时间都不浪费
                    this.advanceTime((previousTime + time) - this.mTotalTime);
                } else {
                    //保存回调的函数和参数
                    var call = this.mCall;
                    var args = this.mArgs;
                    this.dispatchEventWith(jugglerEventType.REMOVE_FROM_JUGGLER);
                    call.call(this, args);
                }
            }
        };
        /**
         * 如果mRepeatCount不会再减1，并且mCurrentTime也不会再改变了
         * @returns {boolean}
         */
        this.isComplete = function () {
            return this.mRepeatCount === 1 && this.mCurrentTime === this.mTotalTime;
        };
        this.reset(call, delay, args);
        EventDispatcher.apply(this);
    };
    window.juggle.DelayedCall = DelayedCall;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    var DelayedCall = window.juggle.DelayedCall;
    var DelayedCallPool = function () {
        this.sDelayedCallPool = [];

        this.fromPool = function (call, delay, args) {
            if (tools.isNull(args)) {
                args = null;
            }
            if (this.sDelayedCallPool.length)
                return this.sDelayedCallPool.pop().reset(call, delay, args);
            else {
                return new DelayedCall(call, delay, args);
            }
        };
        this.toPool = function (delayedCall) {
            delayedCall.mCall = null;
            delayedCall.mArgs = null;
            this.sDelayedCallPool[this.sDelayedCallPool.length] = delayedCall;
        }
    };
    window.juggle.delayedCallPool = new DelayedCallPool();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var WebSocketEventType = function () {
        // 链接完成
        this.CONNECTED = "connected";
        // 关闭
        this.CLOSE = "close";
        // 接到消息
        this.WSMESSAGE = "wsmessage";
        this.getMessage = function (wsOpCode) {
            return this.WSMESSAGE + "_" + wsOpCode;
        }
    };
    window.juggle.webSocketEventType = new WebSocketEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var WebSocketConfig = function () {
        this.WSOPCODE = "wsOpCode";// 操作码
    };
    window.juggle.webSocketConfig = new WebSocketConfig();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var EventDispatcher = window.juggle.EventDispatcher;
    var webSocketEventType = window.juggle.webSocketEventType;
    var webSocketConfig = window.juggle.webSocketConfig;
    /**
     * 创建websocket客户端
     * @param url
     * @constructor
     */
    var WebSocketClient = function (url) {
        this.webSocket = null;
        this.isConnected = false;
        this.url = url;
        this.connect = function () {
            //创建链接
            this.webSocket = new WebSocket(this.url);
            //关注状态
            this.onOpenListener(this, this.onOpen);
            this.onCloseListener(this, this.onClose);
            this.onErrorListener(this, this.onError);
            this.onMessageListener(this, this.onMessage);
        };
        this.onOpenListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onopen = callFunc;

        };
        this.onCloseListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onclose = callFunc;

        };
        this.onErrorListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onerror = callFunc;

        };
        this.onMessageListener = function (webSocketClient, call) {
            var callFunc = function (event) {
                call.call(webSocketClient, event);
            };
            webSocketClient.webSocket.onmessage = callFunc;

        };
        /**
         * 链接成功设置状态，派发事件
         * @param event
         */
        this.onOpen = function (event) {
            this.isConnected = true;
            this.dispatchEventWith(webSocketEventType.CONNECTED);
        };
        /**
         * 发送数据
         * @param data json格式的
         */
        this.send = function (data) {
            if (!this.isConnected) {
                alert("未链接至websocket服务器");
                return;
            }
            var blob = new Blob([JSON.stringify(data)]);
            this.webSocket.send(blob);
        };
        /**
         * 接到消息派发不同类型消息的事件
         * @param event
         */
        this.onMessage = function (event) {
            var data = JSON.parse(event.data);
            if (data[webSocketConfig.WSOPCODE] === null || data[webSocketConfig.WSOPCODE] === undefined) {
                return;
            }
            this.dispatchEventWith(webSocketEventType.getMessage(data[webSocketConfig.WSOPCODE]), false, data);
        };
        /**
         * 关闭时设置状态并且派发事件
         * @param event
         */
        this.onClose = function (event) {
            this.isConnected = false;
            this.dispatchEventWith(webSocketEventType.CLOSE);
        };
        this.onError = function (event) {

        };
        /**
         * 主动关闭
         */
        this.close = function () {
            this.webSocket.close();
        };
        EventDispatcher.apply(this);
        this.connect();
    };
    window.juggle.WebSocketClient = WebSocketClient;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var HttpEventType = function () {
        this.ERROR = "error";
        this.SUCCESS = "success";
    };
    window.juggle.httpEventType = new HttpEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var EventDispatcher = window.juggle.EventDispatcher;
    var httpEventType = window.juggle.httpEventType;
    var HttpClient = function () {
        EventDispatcher.apply(this);
        this.send = function (data, url, header, type, isAsync) {
            this.data = data;
            this.url = url;
            this.header = header;
            var xMLHttpRequest = new XMLHttpRequest();
            if (xMLHttpRequest === null || xMLHttpRequest === undefined) {
                return false;
            }
            if (isAsync === null || isAsync === undefined) {
                isAsync = true;
            }
            if (type === null || type === undefined) {
                if (data === null || data === undefined) {
                    type = "get";
                } else {
                    type = "post";
                }
            }
            this.type = type;
            this.isAsync = isAsync;
            xMLHttpRequest.open(type, url, isAsync);
            for (var headName in header) {
                xMLHttpRequest.setRequestHeader(headName, header[headName]);
            }
            this.addHttpListener(this, xMLHttpRequest, this.sendReturn, data);
            if (type === "post") {
                xMLHttpRequest.setRequestHeader('Content-Type', 'application/json');
                xMLHttpRequest.send(JSON.stringify(data));
            } else {
                xMLHttpRequest.send();
            }
        };
        this.addHttpListener = function (httpClient, xMLHttpRequest, sendReturn, data) {
            var onReadyStateHandle = function (event) {
                sendReturn.call(httpClient, xMLHttpRequest, event, data);
            };
            xMLHttpRequest.onreadystatechange = onReadyStateHandle;
        };
        this.sendReturn = function (xMLHttpRequest, event, data) {
            if (xMLHttpRequest.readyState === 4) {
                if (xMLHttpRequest.status === 200) {
                    //派发请求成功返回数据
                    this.dispatchEventWith(httpEventType.SUCCESS, false, xMLHttpRequest.responseText);
                } else {
                    //派发请求错误
                    this.dispatchEventWith(httpEventType.ERROR);
                }
            }
        };
        this.sendFile = function (fileList, data, url, header, type, isAsync) {
            this.data = data;
            this.url = url;
            this.header = header;
            var xMLHttpRequest = new XMLHttpRequest();
            if (xMLHttpRequest === null || xMLHttpRequest === undefined) {
                return false;
            }
            if (isAsync === null || isAsync === undefined) {
                isAsync = true;
            }
            if (type === null || type === undefined) {
                type = "post";
            }
            this.type = type;
            this.isAsync = isAsync;
            xMLHttpRequest.open(type, url, isAsync);
            for (var headName in header) {
                xMLHttpRequest.setRequestHeader(headName, header[headName]);
            }
            this.addHttpListener(this, xMLHttpRequest, this.sendReturn, data);
            var form = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                var file = fileList[i];
                form.append("file" + i, file);
            }
            if (data !== null && data !== undefined) {
                for (var key in data) {
                    form.append(key, data[key]);
                }
            }
            xMLHttpRequest.send(form);
        }
    };
    window.juggle.HttpClient = HttpClient;
})(window);

(function (window) {
    if (!window.juggle) window.juggle = {};
    function ResourceEventType() {
        /**
         * 加载完成
         * @type {string}
         */
        this.LOAD_COMPLETE = "loadComplete";
        /**
         * 加载失败
         * @type {string}
         */
        this.LOAD_FAIL = "loadFail";
    }

    window.juggle.resourceEventType = new ResourceEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var EventDispatcher = window.juggle.EventDispatcher;
    var HttpClient = window.juggle.HttpClient;
    var httpEventType = window.juggle.httpEventType;
    var resourceEventType = window.juggle.resourceEventType;
    var Loader = function (loadList, data) {
        /**
         * 加载成功
         * @param event
         */
        this.loadSuccess = function (event) {
            this.resultArray[event.mTarget.url] = event.mData;
            this.successNum++;
            if (this.successNum + this.failNum === this.loadList.length) {
                if (this.failNum > 0) {
                    this.dispatchEventWith(resourceEventType.LOAD_FAIL);
                } else {
                    this.dispatchEventWith(resourceEventType.LOAD_COMPLETE);
                }
            }
        };
        /**
         * 加载失败
         * @param event
         */
        this.loadError = function (event) {
            this.failNum++;
            if (this.successNum + this.failNum === this.loadList.length) {
                this.dispatchEventWith(resourceEventType.LOAD_FAIL);
            }

        };
        this.loadList = loadList;
        this.resultArray = [];
        this.successNum = 0;
        this.failNum = 0;
        this.data = data;
        EventDispatcher.apply(this);
        //获取资源
        for (var i = 0; i < this.loadList.length; i++) {
            var httpClient = new HttpClient();
            httpClient.send(null, this.loadList[i]);
            httpClient.addEventListener(httpEventType.SUCCESS, this.loadSuccess, this);
            httpClient.addEventListener(httpEventType.ERROR, this.loadError, this);
        }
    };
    window.juggle.Loader = Loader;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var Loader = window.juggle.Loader;
    var resourceEventType = window.juggle.resourceEventType;
    var ResourceManager = function () {
        this.resource = [];
        this.loadResource = function (url, success, fail, obj) {
            var loader = new Loader(url, [success, fail, obj]);
            loader.addEventListener(resourceEventType.LOAD_COMPLETE, this.loadComplete, this);
            loader.addEventListener(resourceEventType.LOAD_FAIL, this.loadFail, this);
        };
        /**
         * 成功回调
         * @param event
         */
        this.loadComplete = function (event) {
            event.mTarget.removeEventListener(resourceEventType.LOAD_COMPLETE, this.loadComplete);
            event.mTarget.removeEventListener(resourceEventType.LOAD_FAIL, this.loadComplete);
            for (var i = 0; i < event.mTarget.loadList.length; i++) {
                var url = event.mTarget.loadList[i];
                this.resource[url] = event.mTarget.resultArray[url];
            }
            event.mTarget.data[0].call(event.mTarget.data[2], event.mTarget.loadList);
        };
        /**
         * 失败回调
         * @param event
         */
        this.loadFail = function (event) {
            event.mTarget.removeEventListener(resourceEventType.LOAD_COMPLETE, this.loadComplete);
            event.mTarget.removeEventListener(resourceEventType.LOAD_FAIL, this.loadComplete);
            event.mTarget.data[1].call(event.mTarget.data[1], event.mTarget.loadList);
        };
        this.getResource = function (url) {
            return this.resource[url];
        }
    };
    window.juggle.resourceManager = new ResourceManager();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var ViewManager = function () {
        this.observerMap = [];
        this.registerObserver = function (notificationName, observer) {
            if (notificationName === null || notificationName === undefined || observer === null || observer === undefined) {
                return;
            }
            var observers = this.observerMap[notificationName];
            if (observers) {
                var isHave = false;
                for (var i = 0; i < observers.length; i++) {
                    if (observers[i] === observer) {
                        isHave = true;
                        break;
                    }
                }
                if (!isHave) {
                    observers.push(observer);
                }
            } else {
                this.observerMap[notificationName] = [observer];
            }
        };
        this.registerObserverArray = function (notificationNameArray, observer) {
            if (notificationNameArray === null || notificationNameArray === undefined) {
                return;
            }
            if (observer === null || observer === undefined) {
                return;
            }
            for (var i = 0; i < notificationNameArray.length; i++) {
                this.registerObserver(notificationNameArray[i], observer);
            }
        };
        this.getNotification = function (name, body) {
            var obj = {};
            obj.name = name;
            obj.body = body;
            return obj;
        };
        this.notifyObservers = function (notification) {
            var obj = viewManager.observerMap[notification.name];
            if (obj) {
                // 这里最好复制这个数组，防止回调的时候，在注册新的监听
                var observers = obj.concat();
                for (var i = 0; i < observers.length; i++) {
                    var observer = observers[i];
                    observer.handleNotification.call(observer, notification);
                }
            }
        };
        this.removeObserverArray = function (notificationNameArray, observer) {
            if (notificationNameArray === null || notificationNameArray === undefined) {
                return;
            }
            if (observer === null || observer === undefined) {
                return;
            }
            for (var i = 0; i < notificationNameArray.length; i++) {
                this.removeObserver(notificationNameArray[i], observer);
            }
        };
        this.removeObserver = function (notificationName, observer) {
            if (notificationName === null || notificationName === undefined || observer === null || observer === undefined) {
                return;
            }
            var observers = this.observerMap[notificationName];
            if (observers !== undefined && observers !== null) {
                for (var i = 0; i < observers.length; i++) {
                    if (observers[i] === observer) {
                        observers.splice(i, 1);
                        break;
                    }
                }
                if (observers.length === 0) {
                    delete this.observerMap[notificationName];
                }
            }
        };
        this.reset = function () {
            this.observerMap = [];
        }
    };

    var Proxy = function () {
        this.notifyObservers = viewManager.notifyObservers;
        this.getNotification = viewManager.getNotification;
    };
    var Mediator = function () {
        this.init = function () {
            viewManager.registerObserverArray(this.listNotificationInterests, this);
        };
        this.dispose = function () {
            viewManager.removeObserverArray(this.listNotificationInterests, this);
        };
        this.notifyObservers = viewManager.notifyObservers;
        this.getNotification = viewManager.getNotification;
        this.init();
    };
    var viewManager = new ViewManager();
    window.juggle.Mediator = Mediator;
    window.juggle.Proxy = Proxy;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var resourceManager = window.juggle.resourceManager;
    var ModuleManager = function () {
        this.moduleUrlToData = [];
        this.moduleTypeToData = [];
        /**
         * 加载模块
         * @param url 地址
         * @param container 该模块容器
         * @param type 类型，如果已经该类型则将原模块卸载，加载新模块
         * @param mediator 模块控制器
         * @param data 额外数据
         */
        this.loadModule = function (url, container, type, mediator, data) {
            var moduleData = {
                "url": url,
                "container": container,
                "type": type,
                "mediator": mediator,
                "data": data
            };
            this.moduleUrlToData[url] = moduleData;
            resourceManager.loadResource([url], this.loadComplete, this.loadFail, this);
        };
        this.loadFail = function (url) {

        };
        this.loadComplete = function (url) {
            var moduleData = this.moduleUrlToData[url[0]];
            //在未加载完成就卸载，会出现这种情况
            if (moduleData === null || moduleData === undefined) {
                return;
            }
            var resource = resourceManager.getResource(url[0]);
            if (moduleData.type !== null && moduleData.type !== undefined) {
                var oldModuleData = this.moduleTypeToData[moduleData.type];
                if (oldModuleData !== null && oldModuleData !== undefined) {
                    oldModuleData.mediator.dispose();
                }
                this.moduleTypeToData[moduleData.type] = moduleData;
            }
            moduleData.container.innerHTML = resource;
            moduleData.mediator.initView(moduleData.container, moduleData.data);
        };
        this.unLoadModule = function (url) {
            var moduleData = this.moduleUrlToData[url];
            if (moduleData !== null && moduleData !== undefined) {
                moduleData.mediator.dispose();
                delete this.moduleUrlToData[url];
                delete this.moduleTypeToData[moduleData.type];
            }
        }
    };
    window.juggle.moduleManager = new ModuleManager();
})(window);