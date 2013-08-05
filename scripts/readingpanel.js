$(document).on("click","#readingpanelbackbtn",function(){
	//alert("g");
	$("#readingpanelextrainfo").hide();
	$("#readingpanel").animate({"top":"-600px"},400,function(){
		$("#readingpaneltitle").empty();
		$("#readingpanelnavi").empty();
		$("#readingpanelcontent").empty();
		$("#readingpanel").hide();
	});
});

$(document).on("click",".readingpanelnaviitem",function(){
	itemindex = $(this).index();
	getContent();
});
$(window).on("resize",function(){
    readingPanelReposit();
});
function showReadingPanel(){
	if(isReadingPanelLoaded==false){
		initReadingPanel();
		isReadingPanelLoaded = true;
	}else{
		//alert("h");
		getTitle();
		getContent();
		$("#readingpanel").show();
		$("#readingpanel").animate({"top":"50px"},400,function(){
		});
	}
}

function initReadingPanel(){
	$readingpanel = $("<div id='readingpanel'></div>");
	$readingpanel.append("<div id='readingpaneltitlebar'></div><div id='readingpanelbody'></div>");
	$("#wraper").append($readingpanel);
	$("#readingpanel").show();
	$("#readingpaneltitlebar").append("<div id='readingpaneltitle'></div><input id='readingpanelbackbtn' type='button' value='"+lang.back+"'/>");
	$("#readingpanelbody").append("<div id='readingpanelnavi'></div><div id='readingpanelmain'></div>");
	$("#readingpanelmain").append("<div id='readingpanelextrainfo'></div><div id='readingpanelcontent'></div>");
	$("#readingpanelextrainfo").append("<a id='readingpanellink' target='_blank'></a><span id='readingpaneltime'></span>");
	/*
	for(i=0;i<6;i++){
		$("#readingpanelnavi").append("<div class='readingpanelnaviitem'>2013 å¹´æ–°å‡ºçš„ Android åº”ç”¨ï¼Œå“ªäº›å€¼å¾—æŽ¨èï¼Ÿ</div>")
	}
	$(".readingpanelnaviitem:eq(2)").text("åº”ç”¨ï¼Œå“ªäº›å€¼å¾—æŽ¨èï¼Ÿ");
	*/
	
	getTitle();
	getContent();
	
	$("#readingpanel").animate({"top":"50px"},400,function(){
	});
	//$(window).off("resize");
	readingPanelReposit();
}

function getTitle(){
	var data ="rssid="+rssindex;
	$.ajax({
		data:data,
		type:"GET",
		dataType:"json",
		async:false,
		timeout:10000,
		url:"php/get_title.php",
		success:function(json){
			$.each(json.article,function(k,article){
				$("#readingpanelnavi").append("<div class='readingpanelnaviitem'>"+article.title+"</div>")
			});
			$("#readingpanelnavi").scrollTop("0px");
		}
	});
}

function getContent(){
	//var data = "itemid=2";
	//var data = "sourceurl="+xmlurl+"&itemid="+itemindex;
	var data = "rssid="+rssindex+"&itemid="+itemindex;
	/*
	$.getJSON("php/get_content.php",data,function(json){
		$("#readingpaneltitle").text(json.title);
    	$("#readingpanelcontent").append("<br />");
    	$("#readingpanelcontent").append(json.content);
    	$("#readingpanelcontent").append("<br />");
    });
	*/
	
	$.ajax({
		data:data,
		type:'GET',
        dataType:'json',
        async:false,
        timeout:10000,
        url:"php/get_content.php",
        success: function(json) {
        	//alert(json.title);
        	$("#readingpaneltitle").empty();
        	$("#readingpanelcontent").empty();
        	$("#readingpaneltitle").text(json.title);
        	$("#readingpanelcontent").append("<br />");
        	$("#readingpanelcontent").append(json.content);
        	$("#readingpanelcontent").append("<br />");
        	$("#readingpanelmain").scrollTop("0px");
        	$("#readingpanelextrainfo").show();
        	$("#readingpanellink").attr("href",json.link);
        	$("#readingpanellink").text(json.link);
        	$("#readingpaneltime").text(json.time);
        },
        error: function(){
        	alert("error");
        }
	});
}

function readingPanelReposit(){
    var w = $(window).width();
    var h = $(window).height();
    $("#wraper").width(w);
    $("#wraper").height(h);
    $("#abovemask").css("top",50-$("#abovemask").height());
    //var bm = (w - 16 - boxwidth * boxperrow)/(boxperrow * 2);
    $("#mainpanel").height(h-50);
    numperrow=parseInt(w/290);
    $(".itembox").css({"margin-left":(w-250*numperrow-15)/(numperrow*2),
    	"margin-right":(w-250*numperrow-15)/(numperrow*2)});
    $("#newitem").css("margin-left",(w-250*numperrow-15)/(numperrow*2));
    $("#readingpanelnavi").height(h-112);
    $("#readingpanelmain").height(h-112);
    $("#readingpanelmain").width(w-250);
    //(".column").css({"margin-left":bm,"margin-right":bm});
}