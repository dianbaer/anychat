$(document).ready(function () {
    //不在线状态处理开始
    // window.onload=function(){
    //    $(".windowL_P").find(".downLine_P").each(function(){
    //        var shadow="<i class='shadow_P'></i>";
    //        $(this).append(shadow)
    //    })
    // };
    //不在线状态处理结束
    // $(".return_P").on("click",function(){
    //     $(this).parents(".windowR_P.left2_P").hide().prev().show();
    // });
    //富文本编辑器,items为显示的工具图标
    KindEditor.ready(function (K) {
        window.editor = K.create('.mytext_P', {
//                    themeType : 'my',
            width: "200px",
            height: "40px",
            resizeType: 0,
            items: [
                'emoticons'
            ]
        })
    });

    // 时间组件
    $(".timeBox_P a").on("click", function () {
        $(this).next().on("change", function () {

        }).trigger("click")
    });
    // 历史记录
    // $(".history_P").on("click",function(){
    //     $(".windowR_P.left2_P").show().prev().hide()
    // });
    // 通讯录右侧删除按钮
    //$(".closeBtn_P").on("click",function(){
    //    $(".window_P").addClass("hide");
    //});
    // 通讯录导航
    // $(".windowL_P").on("click",".talkGroup_P",function(){
    //     $(".windowL_P li").removeClass("on_P");
    //     $(this).addClass("on_P");
    //     $(".title_P").html($(this).find("span").html());
    //     $(".windowR_P").show().next().hide();
    // });
    // $(".windowL_P").on("click",".group li",function(){
    //     $(".windowL_P li").removeClass("on_P");
    //     $(this).addClass("on_P");
    //     $(".title_P").html($(this).find("span").html());
    //     $(".windowR_P").show().next().hide();
    // });
    var talkButton = 1;
    $(".windowL_P .group").on("click", "p", function () {
        if (talkButton == 1) {
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
    // $(".windowL_P .group").each(function(){
    //     var all=$(this).find("ul li").length;
    //     var cur=$(this).find("ul li.online_P").length;
    //     $(this).find(".cur_P").html(cur);
    //     $(this).find(".all_P").html(all);
    // })
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
});
/**
 * Created by Administrator on 2017/4/7 0007.
 */
//时间组件位置
// function timeFun(){
//     var height2=$(window).height();
//     if(height2/2-217-183<0){
//         return WdatePicker({dateFmt:'yyyy-MM-dd',skin:'my',position:{left:10,top:-8}})
//     }else{
//         return WdatePicker({dateFmt:'yyyy-MM-dd',skin:'my',position:{left:8,top:-205}})
//     }
//
// }
