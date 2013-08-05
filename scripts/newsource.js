var isCustomUrl = false;
initReadingPanel();
$(document).on("click", ".reccata", function(){
	//alert("f");
	$(".reccata").removeClass("reccata-on");
	$(this).addClass("reccata-on");
	$(".recitemlist").hide();
	$(".recitem").show();
	$(".recitemlist:eq(" + $(this).index() + ")").show();
});

$(document).on("click",".recitem",function(){
	$(".recitem").removeClass("recitem-on");
	$(this).addClass("recitem-on");
	isCustomUrl = false;
});

$(document).on("focusin","#newsource",function(){	
	if($(this).hasClass("hinttext")){
		$(this).val("");
		$(this).removeClass("hinttext");
	}
});

$(document).on("change","#newsource",function(){
	$("#sourceicon").css("visibility","hidden");
	$("#newtitle").val("");
	$("#newtitle").hide();
});

$(document).on("focusout","#newsource",function(){
	if($(this).val() == ""){
		$(this).addClass("hinttext");
		$(this).val(lang.urlhint);
	}
});


$(document).on("focusin","#searchsourcetext",function(){	
	if($(this).hasClass("hinttext")){
		$(this).val("");
		$(this).removeClass("hinttext");
	}
});

$(document).on("keyup","#searchsourcetext",function(){
	var txt = trim($("#searchsourcetext").val());
	$(".reccata").removeClass("reccata-on");
	$(".recitem").hide();
	$(".recitemlist").show();
	$.each($("#newsourcepanelrecbody").children(".recitemlist"),function(){
		$.each($(this).children(".recitem"),function(){
			if($(this).children(".recname").text().match(new RegExp(txt,"i"))){
				$(this).show();
			}
		});
	});
});

$(document).on("focusout","#searchsourcetext",function(){
	if($(this).val() == ""){
		$(this).addClass("hinttext");
		$(this).val(lang.search);
	}
});


$(document).on("click","#checkbtn",function(){
	var data = "sourceurl=" + trim($("#newsource").val());
	$.getJSON("php/get_source_title.php", data, function(json){
		if(json[0]!="0"){
			$("#sourceicon").removeClass("crossicon").addClass("tickicon");
			$("#sourceicon").css("visibility","visible");
			$("#newtitle").val(json[0]);
			$("#newtitle").show();
			isCustomUrl = true;
		}else{
			$("#sourceicon").removeClass("tickicon").addClass("crossicon");
			$("#sourceicon").css("visibility","visible");
		}
    });
});


$(document).on("click","#sourcebackbtn",function(){
	$("#newsourcepanel").animate({"top":"1000px"},500,function(){
		isToolbarShow = false;
		$("#mask").fadeOut(200);
    });
});

$(document).on("click","#sourceaddbtn",function(){
	$("#loading2").show();
	var i = 0;
	var timer2 = setInterval(function(){
	   $("#loading2").css("background-position","0px "+(-i*40)+"px");
	    i++;
	},100);
	$("#newsourcepanel").animate({"top":"1000px"},500,function(){
		isToolbarShow = false;
		$("#mask").fadeOut(200);
		$("#sourceappenddiv").remove();
    });
    if(isCustomUrl == true){
    	var data = "url=" + $("#newsource").val()+"&title="+$("#newtitle").val();
    	$.getJSON("php/add_new_url.php",data,function(json){
			clearInterval(timer2);
			$("#loading2").hide();
			$box = $boxtemplate.clone(true);
			$("#newitem").remove();
			$("#mainpanel").append($box);
			$box.css("display","none");
	        for(i=0;i<3;i++){
	            $previewitembar = $("<div class='previewitembar'></div>");
	            $previewitembar.append("<div class='previewitemtitle'></div>");
	            $previewitembar.append("<div class='previewitemdate'></div>");
	            $box.children(".preview").append($previewitembar);
	        }
	        $itemtitle = $box.children(".itemtitle").children(".itemname");
	        $itemtitle.text(json.name);
	        $itemtitle.css("visibility","hidden");
			$box.children(".itemtitle").children(".itemaddress").text(json.address);
			$box.attr("rssid",json.id);
	        $.each(json.summary,function(k,summary){
	            $box.children(".preview").children(".previewitembar:eq(" + k + ")").children(".previewitemtitle").text(summary.title);
	            $box.children(".preview").children(".previewitembar:eq(" + k +")").children(".previewitemdate").text(summary.time);
	            var $title = $box.children(".preview").children(".previewitembar:eq(" + k + ")").children(".previewitemtitle");
	            if(trim($title.text()).length < 10){
	                $title.css({"font-size":"25px","line-height":"30px"});
	            }else{
	                $title.css({"font-size":"17px","line-height":"19px"});
	            }
	        });
			itemnum++;
			var w = $(window).width();
		    numperrow=parseInt(w/290);
		    $box.css({"margin-left":(w-250*numperrow-22)/(numperrow*2),
		    	"margin-right":(w-250*numperrow-22)/(numperrow*2)});
			$box.fadeIn(500,function(){
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
			    $itemtitle.css("visibility","visible");
				$newitem = $("<div id='newitem'><div>"+lang.addnewsource+"</div></div>");
				$newitem.css({"margin-left":(w-250*numperrow-22)/(numperrow*2),
		    		"margin-right":(w-250*numperrow-22)/(numperrow*2)});
				$("#mainpanel").append($newitem);
			});
		});
    }else{
    	var data = "sourceid=" + $(".recitem-on").attr("sourceid");
		$.getJSON("php/add_new_source.php",data,function(json){
			clearInterval(timer2);
			$("#loading2").hide();
			$box = $boxtemplate.clone(true);
			$("#newitem").remove();
			$("#mainpanel").append($box);
			$box.css("display","none");
	        for(i=0;i<3;i++){
	            $previewitembar = $("<div class='previewitembar'></div>");
	            $previewitembar.append("<div class='previewitemtitle'></div>");
	            $previewitembar.append("<div class='previewitemdate'></div>");
	            $box.children(".preview").append($previewitembar);
	        }
	        $itemtitle = $box.children(".itemtitle").children(".itemname");
	        $itemtitle.text(json.name);
	        $itemtitle.css("visibility","hidden");
			$box.children(".itemtitle").children(".itemaddress").text(json.address);
			$box.attr("rssid",json.id);
	        $.each(json.summary,function(k,summary){
	            $box.children(".preview").children(".previewitembar:eq(" + k + ")").children(".previewitemtitle").text(summary.title);
	            $box.children(".preview").children(".previewitembar:eq(" + k +")").children(".previewitemdate").text(summary.time);
	            var $title = $box.children(".preview").children(".previewitembar:eq(" + k + ")").children(".previewitemtitle");
	            if(trim($title.text()).length < 10){
	                $title.css({"font-size":"25px","line-height":"30px"});
	            }else{
	                $title.css({"font-size":"17px","line-height":"19px"});
	            }
	        });
			itemnum++;
			var w = $(window).width();
		    numperrow=parseInt(w/290);
		    $box.css({"margin-left":(w-250*numperrow-22)/(numperrow*2),
		    	"margin-right":(w-250*numperrow-22)/(numperrow*2)});
			$box.fadeIn(500,function(){
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
			    $itemtitle.css("visibility","visible");
				$newitem = $("<div id='newitem'><div>"+lang.addnewsource+"</div></div>");
				$newitem.css({"margin-left":(w-250*numperrow-22)/(numperrow*2),
		    		"margin-right":(w-250*numperrow-22)/(numperrow*2)});
				$("#mainpanel").append($newitem);
			});
		});
	}
});
function initReadingPanel(){
	$("#wraper").append("<div id='mask'></div>");
	$newsourcepanel = $("<div id='newsourcepanel'></div>");
	$newsourcepanel.append("<div id='newsourcepaneltitle'>"+lang.addnewsource+"</div>");
	$newsourcepanel.append("<div id='newsourcepanelbody'>"+lang.addnewtext+"</div>");
	$("#wraper").append($newsourcepanel);
	$("#newsourcepanelbody").append("<div id='newsourcepanelrec'></div><div id='newsourcepaneldiy'></div><div id='newsourcepanelbtnbar'></div>");
	$("#newsourcepanelrec").append("<div id='newsourcepanelrecnavi'></div><div id='newsourcepanelrecbody'></div>");
	$("#newsourcepaneldiy").append("<input id='newsource' class='newsourceinput hinttext'  type='textfield' value='"+lang.urlhint+"'/>");
	$("#newsourcepaneldiy").append("<div id='sourceicon' class='tickicon' title='"+lang.info+"'><span></span></div>");
	$("#newsourcepaneldiy").append("<input id='checkbtn' class='grey-button' type='button' value='"+lang.check+"' />");
	$("#newsourcepaneldiy").append("<input id='newtitle' class='newsourceinput' type='textfield' />");
	$("#newsourcepanelbtnbar").append("<input id='sourceaddbtn' class='grey-button' type='button' value='"+lang.subscribe+"' />");
	$("#newsourcepanelbtnbar").append("<input id='sourcebackbtn' class='grey-button' type='button' value='"+lang.back+"' />");
	
	
	$.getJSON("php/get_catalog.php",function(json){
		$.each(json.cata,function(i,cata){
			$("#newsourcepanelrecnavi").append("<div class='reccata'>"+cata.name+"</div>");
			$recitemlist=$("<div class='recitemlist'></div>");
			if(i!=0){
				$recitemlist.hide();
			}
			$.each(cata.rss,function(j,rss){
				$recitem = $("<div class='recitem'></div>");
				$recitem.attr("sourceid",rss.id);
				$recitem.append("<div class='recname'>"+rss.title+"</div>");
				switch(rss.lang){
					case "zh-cn":
						$recitem.append("<div class='reclink'><span class='langicon'>中</span>"+rss.link+"</div>");
						break;
					case "en":
						$recitem.append("<div class='reclink'><span class='langicon'>EN</span>"+rss.link+"</div>");
						break;
					case "jp":
						$recitem.append("<div class='reclink'><span class='langicon'>日</span>"+rss.link+"</div>");
						break;
				}
				// $recitem.append("<div class='reclink'>"+rss.link+"</div>");
				$recitem.append("<div class='recinfo'>"+rss.desc+"</div>");
				$recitemlist.append($recitem);
			});
			$("#newsourcepanelrecbody").append($recitemlist);
		});
		$("#newsourcepanelrecnavi").append("<div id='searchsourcediv'></div>");
		$("#searchsourcediv").append("<input id='searchsourcetext' type='textfield' class='newsourceinput hinttext' value='"+lang.search+"'/>");
		// $("#searchsourcediv").append("<input id='searchsourcebtn' type='button' class='grey-icon-button searchicon'  value='search'/>");
		$(".reccata:first").addClass("reccata-on");
    });
	$("#newsourcepanel").animate({"top":"100px"},500,function(){
	});
}

