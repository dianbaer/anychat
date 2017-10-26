function CookieParam() {
    this.getCookieParam = function (name) {
        return $.cookie(name);
    }
    this.setCookieParam = function (name, value) {
        $.cookie(name, value);
    }
    this.deleteCookieParam = function (name) {
        $.cookie(name, null);
    }
}
$T.cookieParam = new CookieParam();