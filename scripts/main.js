var itemnum=0;
var isToolbarShow = false;
var isCatalogLoaded = false;
var isReadingPanelLoaded = false;
var xmlurl;
var rssindex = 0;
var itemindex=0;
var isUserExtraShow = false;

$boxtemplate = $("<div class='itembox'></div>");
$boxtemplate.append("<div class='itemtitle'></div>");
$boxtemplate.append("<div class='preview'></div>");
$boxtemplate.append("<div class='itemfooter'></div>");
$boxtemplate.children(".itemtitle").append("<span class='itemname'></span>");
$boxtemplate.children(".itemtitle").append("<div class='itemaddress'></div>");
$boxtemplate.children(".itemfooter").append("<div class='toolicon refreshicon' title='"+lang.refresh+"'><span></span></div>");
$boxtemplate.children(".itemfooter").append("<div class='toolicon deleteicon' title='"+lang.delete+"'><span></span></div>");
$boxtemplate.children(".itemfooter").append("<div class='toolicon staricon' title='"+lang.star+"'><span></span></div>");
$boxtemplate.children(".itemfooter").append("<div class='toolicon infoicon' title='"+lang.info+"'><span></span></div>");
init();

$(window).on("resize",function(){
    reposit();
});

$(document).on("click",".refreshicon",function(){
	$("#loading2").show();
	var i = 0;
	var timer2 = setInterval(function(){
	   $("#loading2").css("background-position","0px "+(-i*40)+"px");
	    i++;
	},100);
	$.getJSON("php/refresh_source.php", function(){
		clearInterval(timer2);
		$("#loading2").hide();
	});
});
$(document).on("click",".deleteicon",function(){
	$removebox = $(this).parents(".itembox");
	var data = "rssid="+$removebox.attr('rssid');
	$.getJSON("php/delete_source.php", data, function(){
		$removebox.fadeOut(200,function(){
			$removebox.remove();
		});
	});
});

$(document).on("click","#usernamediv",function(){

});


$(document).on("click",".feedbackicon",function(){
	location.href = "mailto:fred.wulei@gmail.com?subject="+lang.appname+" - "+lang.feedback+"&body=";
});

$(document).on("click",".signouticon",function(){
    $("#userinfobar").remove();
    $("#belowmask").show();
	$("#abovemask").css("position","relative");
	$("#abovemask").animate({"top":0},800,function(){
    });
    $("#belowmask").animate({"bottom":"0"},800,function(){
        $.each($("#wraper").children(),function(){
	    	if(($(this).attr("id")!="abovemask")&&($(this).attr("id")!="belowmask")){
	    		$(this).remove();
	    	}
	    });
    });
    $(document).off();
});


$(document).on("click",".itemtitle",function(){
	rindex = $(this).parents(".itembox").index();
	iindex = 0;
	getArticle(rindex,iindex);
});
$(document).on("click",".previewitembar",function(){
	rindex = $(this).parents(".itembox").index();
	iindex = $(this).index();
	getArticle(rindex,iindex);
});
$(document).on("click","#newitem",function(){
	if(isCatalogLoaded == false){
		/*var cssfile = document.createElement('link');
        cssfile.setAttribute("rel","stylesheet");
        cssfile.setAttribute("type","text/css");
        cssfile.setAttribute("href","css/newsource.css");
        document.getElementsByTagName("head")[0].appendChild(cssfile); */
        isCatalogLoaded = true;
		isToolbarShow = true;		
		$.getScript("scripts/newsource.js",function(){
			
		});
	}else{
		$("#mask").fadeIn(200);
		$("#newsourcepanel").animate({"top":"100px"},500,function(){
		});
	}
});
$(document).on("click","#userpic",function(){
	if(isUserExtraShow){
		$("#userextra").hide();
		$("#usernamediv").animate({"top":"10px","font-size":"20px"},100,function(){
		});
		isUserExtraShow = false;
	}else{
		$("#usernamediv").animate({"top":"5px","font-size":"14px"},100,function(){
			$("#userextra").show();
		});
		isUserExtraShow = true;
	}
	// $("#wraper").append("<div id='userextrapanel'></div>");
	// $("#userextrapanel").append("<div>sign out</div>");
});

function init(){
	$("#abovemask").append("<div id='userinfobar'></div>");
	$("#userinfobar").append("<img id='userpic' style='display:none' src='"+avatarurl+"' />");
	$("#userinfobar").append("<div id='usernamediv'>"+nickname+"</div>");
	$("#userinfobar").append("<div id='userextra'></div>");
	$("#userextra").append("<span class='feedbackicon' title='"+lang.feedback+"'></span>");
	$("#userextra").append("<span class='editicon' title='"+lang.edit+"'></span>");
	$("#userextra").append("<span class='signouticon' title='"+lang.signout+"'></span>");
    $("#wraper").append("<div id='mainpanel'></div>");
    getReadingList();
    reposit();
	$("#abovemask").animate({"top":50-$("#abovemask").height()},800,function(){
		$("#userpic").show();
    	$("#userinfobar").fadeIn(200);
    });
    $("#belowmask").animate({"bottom":"-400px"},800,function(){
        $("#belowmask").hide();
        $("#anim").hide();
        clearInterval(timer); 
        $("#abovemask").css("position","fixed");
        $("#loading1").hide();
		$("#logininfo").text("");
		
    });
    
	// $("#loading2").show();
	// var i = 0;
	// var timer2 = setInterval(function(){
	//    $("#loading2").css("background-position","0px "+(-i*40)+"px");
	//     i++;
	// },100);
    
	// $.getJSON("php/refresh_source.php",function(){
	// 	clearInterval(timer2);
	// 	$("#loading2").hide();
	// });
	$(window).off("resize");
}
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function setTitleFontSize(){
    $.each($(".previewitemtitle"),function(){
	    if(trim($(this).text()).length<10){
	        $(this).css({"font-size":"25px","line-height":"30px"});
	    }else{
	        $(this).css({"font-size":"17px","line-height":"19px"});
	    }
	});
}

function reposit(){
    var w = $(window).width();
    var h = $(window).height();
    $("#wraper").width(w);
    $("#wraper").height(h);
    //$("#abovemask").css("top",50-$("#abovemask").height());
    //var bm = (w - 16 - boxwidth * boxperrow)/(boxperrow * 2);
    $("#mainpanel").height(h-50);
    numperrow=parseInt(w/290);
    $(".itembox").css({"margin-left":(w-250*numperrow-22)/(numperrow*2),
    	"margin-right":(w-250*numperrow-22)/(numperrow*2)});
    $("#newitem").css({"margin-left":(w-250*numperrow-22)/(numperrow*2),
    	"margin-right":(w-250*numperrow-22)/(numperrow*2)});
    //(".column").css({"margin-left":bm,"margin-right":bm});
}

function getReadingList(){
	// $("#mainpanel").append('<div class="itembox" style="margin: 0px;"><div class="itemtitle"></div>'+
	// 	'<div class="preview"><div class="previewitembar"><div class="previewitemtitle" style="font-size: 17px; line-height: 19px;">ト'+
	// 	'</div><div class="previewitemdate">20</div></div><div class="previewitembar">'+
	// 	'<div class="previewitemtitle" style="font-size: 17px; line-height: 19px;">PR！</div><div class="previewitemdate">1</div></div></div><div class="itemfooter"></div></div>');
    $.ajax({
        type:'GET',
        dataType:'json',
        async:false,
        timeout:10000,
        url:"php/get_preview.php",
        success: function(json) {
        	if(json!="0"){
	            $.each(json,function(i,data){
	                $.each(data,function(j,site){
	                    $box = $boxtemplate.clone(true);
	                    $("#mainpanel").append($box);
	                    for(i=0;i<3;i++){
	                        $previewitembar=$("<div class='previewitembar'></div>");
	                        $previewitembar.append("<div class='previewitemtitle'></div>");
	                        $previewitembar.append("<div class='previewitemdate'></div>");
	                        $box.children(".preview").append($previewitembar);
	                    }
	                    $itemtitle = $box.children(".itemtitle").children(".itemname");
	                    $itemtitle.text(site.name);
        				$box.children(".itemtitle").children(".itemaddress").text(site.address);
        				$box.attr("rssid",site.id);
        				var boxwidth = 242;
					    var textwidth = $itemtitle.width();
					    var newfontsize = Math.floor((boxwidth/textwidth)*18);
					    if(newfontsize<=18){
					    	$itemtitle.css({"font-size":18,"line-height":"20px"});
					    }else if(newfontsize>32){
					    	$itemtitle.css({"font-size":32});
					    }else{
					    	$itemtitle.css({"font-size":newfontsize-1});
					    }
	                    $.each(site.summary,function(k,summary){
	                        $box.children(".preview").children(".previewitembar:eq("+k+")").children(".previewitemtitle").text(summary.title);
	                        $box.children(".preview").children(".previewitembar:eq("+k+")").children(".previewitemdate").text(summary.time);

	                        var $title=$box.children(".preview").children(".previewitembar:eq("+k+")").children(".previewitemtitle");
	                        if(trim($title.text()).length<10){
	                            $title.css({"font-size":"25px","line-height":"30px"});
	                        }else{
	                            $title.css({"font-size":"17px","line-height":"19px"});
	                        }
	                    });
	                    itemnum++;	                    
	                });
	            });
			}
			$("#mainpanel").append("<div id='newitem'><div>"+lang.addnewsource+"</div></div>");
        },
        error: function(){
            alert("source loading error...");
        }
    });
}

function getArticle(rindex,iindex){
	rssindex = rindex;
	itemindex = iindex;
	if(isReadingPanelLoaded == false){
		/*var cssfile = document.createElement('link');
        cssfile.setAttribute("rel","stylesheet");
        cssfile.setAttribute("type","text/css");
        cssfile.setAttribute("href","css/readingpanel.css");
        document.getElementsByTagName("head")[0].appendChild(cssfile); */
		$.getScript("scripts/readingpanel.js",function(){
			showReadingPanel();
		});
	}else{
		showReadingPanel();
	}
}