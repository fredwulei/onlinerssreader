<?php
session_start();
$userid = $_SESSION['userid'];
$rssindex =(int)$_GET['rssid'];
$index = (int)$_GET['itemid'];

$file  = "../cache/_cache_$userid.xml";
$rss = simplexml_load_file($file);

$node= $rss->site[$rssindex]->item->article[$index];
$st = array('\\',"\"","\n","\t","\r");
$re = array("\\\\",'\"',"","","");
echo "{";
echo "\"title\":\"".str_replace($st,$re,$node->title)."\",";
echo "\"link\":\"".$node->link."\",";
echo "\"time\":\"".$node->time."\",";
echo "\"content\":\"".str_replace($st,$re,$node->content)."\"";
echo "}";

?>