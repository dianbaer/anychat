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