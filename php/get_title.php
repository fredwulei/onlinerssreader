<?php
session_start();
$userid = $_SESSION['userid'];
require("mysql_conn.php");
$rssindex =(int)$_GET['rssid'];
//$userid=1;
//$rssindex = 1;
$file  = "../cache/_cache_$userid.xml";
$rss = simplexml_load_file($file);
$node= $rss->site[$rssindex]->item->article;
$k=0;
$st = array('\\',"\"","\n","\t","\r");
$re = array("\\\\",'\"',"","","");
echo "{\"article\":[";
foreach ($node as $t) {
	echo "{";
	echo "\"title\":\"".str_replace($st,$re,$t->title)."\",";
	echo "\"time\":\"".$t->time."\"";
	$k++;
	if($k<count($node)){
		echo "},";
	}
}
echo "}]}";


/*
foreach($node as $item){
	if($rsstype==0){
		$titlestr= str_replace($st,$re,$item->title);
		$t=strtotime($item->pubDate);
		$contentstr= date('Y-m-d H:i:s',$t);
	}else{
		$titlestr= str_replace($st,$re,$item->title);
		$t=strtotime($item->updated);
		$contentstr= date('Y-m-d H:i:s',$t);
	}
	echo '{"title":"'.$titlestr.'",';
	echo '"time":"'.$contentstr.'"}';
	if($k>=3){
		echo ']}';
		break;
	}
	if($k<3) {
		echo ",";
	}
	$k++;
}
*/
?>