<?php
session_start();
$url = $_GET['sourceurl'];
$rss = simplexml_load_file($url);
if(count($rss->channel->title)>0){
	echo json_encode($rss->channel->title);
}elseif (count($rss->title)>0) {
	echo json_encode($rss->title);
}else{
	echo json_encode('0');
}
?>