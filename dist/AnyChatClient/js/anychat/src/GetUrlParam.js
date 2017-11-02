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