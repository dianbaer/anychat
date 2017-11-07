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