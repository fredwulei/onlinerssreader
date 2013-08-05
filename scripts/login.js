var boxwidth = 250;
var boxperrow = 4;
var nickname;
var avatarurl;
var timer;
var lang;
var language =
{

};

$(document).ready(function(e) {
    setLangCookie();
    maskReposit();
    autologin();

    $(window).on("resize",function(){
        maskReposit();
    });


    $(document).on("click","#termsbox",function(){
        $(this).fadeOut(300);
    });

    $(document).on("keyup",function(event){
        if(event.keyCode ==13){
            login();
        }
    });

    $("#enterbtn").on("click",function(){
        login();
    });
    $("#signupbtn").on("click",function(){
        $("#logininfo").text("");
        $("#loginbox").hide();
        $("#wrapbox").animate({"width":"600px"},200,function(){
            $("#wrapbox").animate({"height":"200px"},200,function(){
                $("#registerbox").show();
            });
        });
    });
    $("#backbtn").on("click",function(){
        $("#logininfo").text("");
        $("#registerbox").hide();
        $("#wrapbox").animate({"height":"120px"},200,function(){
            $("#wrapbox").animate({"width":"300px"},200,function(){
                $("#loginbox").show();
            });
        });
    });
    $("#submitbtn").on("click",function(){
        if(checkRegister()){
            var data = $("#registerform").serialize();
            $.getJSON("php/signup.php",data,function(msg){
                if(msg=="0"){
                    $("#logininfo").text(lang.unavailable);
                }else{
                    $("#logininfo").text(lang.signupok);
                    $("#registerbox").hide();
                    $("#wrapbox").animate({"height":"150px"},200,function(){
                        $("#wrapbox").animate({"width":"300px"},200,function(){
                            $("#loginbox").show();
                        });
                    });
                }
            });
        }
    });
    $("#englishswitch").on("click",function(){
        changeLang(language.en);
        document.cookie="userlang=0";
        $("#langswitch > span").removeClass("langswitch-on");
        $("#englishswitch").addClass("langswitch-on");
    });
    $("#chineseswitch").on("click",function(){
        $.getScript("language/cn.js",function(){
            changeLang(language.cn);
            document.cookie="userlang=1";
            $("#langswitch > span").removeClass("langswitch-on");
            $("#chineseswitch").addClass("langswitch-on");
        });
    });
    $("#japaneseswitch").on("click",function(){
        $.getScript("language/jp.js",function(){
            changeLang(language.jp);
            document.cookie="userlang=2";
            $("#langswitch > span").removeClass("langswitch-on");
            $("#japaneseswitch").addClass("langswitch-on");
        });
    });

    $(".loginforminput").on("focusin",function(){
        $("#logininfo").text("");
    });
    $("#terms").on("click",function(){
        $.ajax({
            dataType:'text',
            url:"terms_of_service.txt",
            success: function(txt){
                $("#wraper").append("<div id='termsbox'>"+txt+"</div>");
                $("#termsbox").fadeIn(300);
            }
        })
    });
    

    function checkForm(){
        if($("#username").val()==""){
            $("#logininfo").text(lang.enterusername);
            return false;
        }
        if($("#password").val()==""){
            $("#logininfo").text(lang.enterpassword);
            return false;
        }
        return true;
    }

    function checkRegister(){
        if($("#registerusername").val()==""){
            $("#logininfo").text(lang.enterusername);
            return false;
        }
        if($("#registerpassword").val()==""){
            $("#logininfo").text(lang.enterpassword);
            return false;
        }
        if($("#registerpassword").val()!=$("#confirm").val()){
            $("#logininfo").text(lang.notmatch);
            return false;
        }
        return true;
    }

    function maskReposit(){
        var w = $(window).width();
        var h = $(window).height();
        $("#abovemask").height(h*0.38);
        $("#belowmask").height(h-$("#abovemask").height()-1);
        // $("#belowmask").css("top",$("#abovemask").height()+1);
        $("#wraper").width(w);
        $("#wraper").height(h);
    }
    function changeLang(l){
        $("#logininfo").text("");
        lang=l;
        document.title = l.appname;
        $("#appname").text(l.appname);
        $("#titlediv > .smalltext").text(l.alpha);
        $("#slogan").text(l.slogan);
        $("#signupbar").text(l.signupnow);
        $(".username").text(l.username);
        $(".password").text(l.password);
        $(".nickname").text(l.nickname);
        $(".confirm").text(l.confirm);
        $("#autologinspan").text(l.autologin);
        $("#termtextbefore").text(l.termtextbefore);
        $("#termtextafter").text(l.termtextafter);
        $("#terms").text(l.terms);
        $("#enterbtn").val(l.signin);
        $("#signupbtn").val(l.signup);
        $("#submitbtn").val(l.submit);
        $("#backbtn").val(l.back);
        $("#webinfo").text(l.license);
        
    }

    function login(){
        if (checkForm()){
            var data;
            if($("#autologincheck").attr("checked")=="checked"){
                data = $("#loginform").serialize()+"&autologin=1";
            }else{
                data = $("#loginform").serialize()+"&autologin=0";
            }
            $.getJSON("php/login.php",data,function(msg){
                if(msg!="0"){
                    $("#logininfo").text(lang.loading);
                    $("#loading1").show();
                    var i = 0;
                    timer = setInterval(function(){
                       $("#loading1").css("background-position","0px "+(-i*40)+"px");
                        i++;
                    },100);
                    nickname=msg.name;
                    avatarurl=msg.avatar;
                    $.getScript("scripts/main.js",function(){

                    });
                    loadCSS("css/main.css");
                }else{
                    $("#logininfo").text(lang.checkusername);
                }
            });
        }
    }

    function loadCSS(url){
        var cssfile = document.createElement('link');
        cssfile.setAttribute("rel","stylesheet");
        cssfile.setAttribute("type","text/css");
        cssfile.setAttribute("href",url);
        document.getElementsByTagName("head")[0].appendChild(cssfile);
    }

    function autologin(){
        $.getJSON("php/autologin.php",function(msg){
            if(msg!="0"){
                $("#logininfo").text(lang.loading);
                $("#loading1").show();
                var i = 0;
                timer = setInterval(function(){
                   $("#loading1").css("background-position","0px "+(-i*40)+"px");
                    i++;
                },100);
                nickname=msg.name;
                avatarurl=msg.avatar;
                $.getScript("scripts/main.js",function(){

                });
                loadCSS("css/main.css");
            }
        });
    }
    function setLangCookie(){
        var strCookie=document.cookie;
        var arrCookie=strCookie.split("; ");
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if(arr[0]=="userlang"){ 
                switch(arr[1]){
                    case "0":
                        $.getScript("language/en.js",function(){
                            changeLang(language.en);
                            $("#langswitch > span").removeClass("langswitch-on");
                            $("#englishswitch").addClass("langswitch-on");
                        });
                        return;
                    case "1":
                        $.getScript("language/cn.js",function(){
                            changeLang(language.cn);
                            $("#langswitch > span").removeClass("langswitch-on");
                            $("#chineseswitch").addClass("langswitch-on");
                        });
                        return;
                    case "2":
                        $.getScript("language/jp.js",function(){
                            changeLang(language.jp);
                            $("#langswitch > span").removeClass("langswitch-on");
                            $("#japaneseswitch").addClass("langswitch-on");
                        });
                        return;
                    default:
                }
                break;
            }

        }
        changeLang(language.en);
        document.cookie="userlang=0";
    }
});