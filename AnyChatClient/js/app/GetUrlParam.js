function GetUrlParam() {
    this.getUrlParam = function (name) {
        var search = location.search;
        search = search.substring(1);
        var array = search.split("&");
        var paramValue;
        for (var i = 0; i < array.length; i++) {
            var str = array[i];
            if (str.indexOf(name) != -1) {
                var strArray = str.split("=");
                paramValue = strArray[1];
                break;
            }
        }
        return paramValue;
    }
}
$T.getUrlParam = new GetUrlParam();