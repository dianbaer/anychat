function ExpressionConvert() {
    //表情图片存放路径
    this.imagePath = "js/lib/kindeditor/plugins/emoticons/images/";

    this.expressionType = [];   //存储表情类型
    this.expressionImage = [];  //存储表情类型对应的表情图片
    this.expressionSymbol = []; //存储表情类型对应的表情符号

    //类型
    this.AIMU = "aimu";            //爱慕
    this.BEISHAGN = "beishang";    //悲伤
    this.BIZUI = "bizui";          //闭嘴
    this.DAXIAO = "daxiao";        //大笑
    this.EMO = "emo";              //恶魔
    this.FENNU = "fennu";          //愤怒
    this.GAOXING = "gaoxing";      //高兴
    this.HAIXIU = "haixiu";        //害羞
    this.HENG = "heng";            //heng
    this.JINGYA = "jingya";        //惊讶
    this.KU = "ku";                //酷
    this.KUNHUO = "kunhuo";        //困惑
    this.LENGMO = "lengmo";        //冷漠
    this.SHETOU = "shetou";        //舌头
    this.TIAOPI = "tiaopi";        //调皮
    this.WEIXIAO = "weixiao";      //微笑

    this.init = function () {
        this.expressionType.push(this.AIMU);
        this.expressionType.push(this.BEISHAGN);
        this.expressionType.push(this.BIZUI);
        this.expressionType.push(this.DAXIAO);
        this.expressionType.push(this.EMO);
        this.expressionType.push(this.FENNU);
        this.expressionType.push(this.GAOXING);
        this.expressionType.push(this.HAIXIU);
        this.expressionType.push(this.HENG);
        this.expressionType.push(this.JINGYA);
        this.expressionType.push(this.KU);
        this.expressionType.push(this.KUNHUO);
        this.expressionType.push(this.LENGMO);
        this.expressionType.push(this.SHETOU);
        this.expressionType.push(this.TIAOPI);
        this.expressionType.push(this.WEIXIAO);

        this.expressionSymbol[this.AIMU] = "/:*";
        this.expressionSymbol[this.BEISHAGN] = "/:(";
        this.expressionSymbol[this.BIZUI] = "/:X";
        this.expressionSymbol[this.DAXIAO] = "/:D";
        this.expressionSymbol[this.EMO] = "/:emo";
        this.expressionSymbol[this.FENNU] = "/:@";
        this.expressionSymbol[this.GAOXING] = "/:~";
        this.expressionSymbol[this.HAIXIU] = "/:$";
        this.expressionSymbol[this.HENG] = "/:heng";
        this.expressionSymbol[this.JINGYA] = "/:O";
        this.expressionSymbol[this.KU] = "/:ku";
        this.expressionSymbol[this.KUNHUO] = "/:?";
        this.expressionSymbol[this.LENGMO] = "/:-";
        this.expressionSymbol[this.SHETOU] = "/:d";
        this.expressionSymbol[this.TIAOPI] = "/:P";
        this.expressionSymbol[this.WEIXIAO] = "/:)";
        //console.log(this.expressionSymbol);

        this.expressionImage[this.AIMU] = "0.png";
        this.expressionImage[this.BEISHAGN] = "1.png";
        this.expressionImage[this.BIZUI] = "15.png";
        this.expressionImage[this.DAXIAO] = "2.png";
        this.expressionImage[this.EMO] = "3.png";
        this.expressionImage[this.FENNU] = "4.png";
        this.expressionImage[this.GAOXING] = "5.png";
        this.expressionImage[this.HAIXIU] = "6.png";
        this.expressionImage[this.HENG] = "7.png";
        this.expressionImage[this.JINGYA] = "8.png";
        this.expressionImage[this.KU] = "9.png";
        this.expressionImage[this.KUNHUO] = "10.png";
        this.expressionImage[this.LENGMO] = "11.png";
        this.expressionImage[this.SHETOU] = "12.png";
        this.expressionImage[this.TIAOPI] = "13.png";
        this.expressionImage[this.WEIXIAO] = "14.png";
        //console.log(this.expressionImage);
    }

    //根据给定的表情符号，找到指定的图片
    this.getImageFromSymbol = function (symbol) {
        for (var i = 0; i < this.expressionType.length; i++) {
            if ((this.expressionSymbol[this.expressionType[i]]) == symbol) {
                return (this.expressionImage[this.expressionType[i]]);
            }
        }
        return "";         //没有找到 返回空
    }
    //根据图片，找到对应定义的表情符号
    this.getSymbolFromImage = function (image) {
        for (var i = 0; i < this.expressionType.length; i++) {
            if ((this.getImageSrc(this.expressionImage[this.expressionType[i]]) == image)) {
                console.log("找到表情类型为：" + this.expressionType[i])
                return (this.expressionSymbol[this.expressionType[i]]);
            }
        }
        return "";        //没有找到，返回空
    }

    //根据图片名称拼接图片显示的路径
    this.getImageSrc = function (imageName) {
        var imgSrc = '<img src="' + this.imagePath + imageName + '" data-ke-src="' + this.imagePath + imageName + '" border="0" alt="">'
        return imgSrc;
    }

    //将表情图片替换成表情符号
    this.replace_Image_to_symbol = function (str) {
        var reg = /<img src="js\/lib\/kindeditor\/plugins\/emoticons\/images\/([0-9]|(1[0-5]))\.png" data-ke-src="js\/lib\/kindeditor\/plugins\/emoticons\/images\/([0-9]|(1[0-5]))\.png" border="0" alt="">/gm;
        //var reg = new RegExp(/<img src="js\/lib\/kindeditor\/plugins\/emoticons\/images\/[0-9]|(1[0-5]).png" data-ke-src="js\/lib\/kindeditor\/plugins\/emoticons\/images\/[0-9]|(1[0-5]).png" border="0" alt="">/g);
        if (str) {
            var match_str = str.match(reg);
            //console.log(match_str);
            if (match_str) {  //说明有匹配成功的字符串
                for (var i = 0; i < match_str.length; i++) {
                    str = str.replace(match_str[i], this.getSymbolFromImage(match_str[i]));
                }
            }
        }
        return str;
    }
    //将表情符号替换成对应的表情图片
    this.replace_symbol_to_image = function (str) {
        //定义需要替换的内容
        //var  re =/\/:[*|(|X|D|(emo){1}|@|~|$|(heng){1}|O|+|?|-|d|P|)]/;
        var reg = /(\/:\*)|(\/:\()|(\/:X)|(\/:D)|(\/:emo)|(\/:@)|(\/:~)|(\/:\$)|(\/:heng)|(\/:O)|(\/:ku)|(\/:\?)|(\/:-)|(\/:d)|(\/:P)|(\/:\))/gm;
        if (str) {
            var match_str = str.match(reg);
            //console.log(match_str);
            if (match_str) {
                for (var i = 0; i < match_str.length; i++) {
                    str = str.replace(match_str[i], this.getImageSrc(this.getImageFromSymbol(match_str[i])));
                }
            }
        }
        return str;
        console.log(str);
    }
}
$T.expressionConvert = new ExpressionConvert();
$T.expressionConvert.init();
