<?php
session_start();
$userid = $_SESSION['userid'];
//$userid = 1;
require("mysql_conn.php");

$sql = mysql_query("select * from `usersub` where `userid`='$userid';");
$url_array = array();
$title_array = array();
if($row=mysql_fetch_object($sql)){
	do{
		array_push($url_array, $row->url);
		array_push($title_array, $row->title);
	}while($row=mysql_fetch_object($sql));
}else{
	echo "0";
	mysql_close($conn);
	exit();
}
$file  = '../cache/_cache_'.$userid.'.xml';
$st = array('\\',"\"","\n","\t","\r");
$re = array("\\\\",'\"',"","","");
echo '{"site":[';
if(file_exists($file)){
	$rss = simplexml_load_file($file);
	$node = $rss->site;
	//echo $node->item->article->title;
	$i=0;
	$nodemax=count($node);
	foreach ($node as $site) {
		echo "{\"name\":\"".str_replace($st,$re,$site->title)."\",\"id\":\"".$site['id']."\",\"address\":\"".$site->address."\",\"summary\":[";
		//echo $node->item->title;
		for ($k=0;$k<count($site->item->article);$k++) {
			echo '{"title":"'.str_replace($st,$re,$site->item->article[$k]->title).'",';
			echo '"time":"'.$site->item->article[$k]->time.'"}';
			if($k<count($site->item->article)-1){
				echo ",";
			}
		}
		$i++;
		if($i<$nodemax){
			echo "]},";
		}else{
			echo "]}]}";
		}
	}
}else{
	$xml = new DOMDocument("1.0","utf-8");
	$xml_rss = $xml->createElement("rss");
	$xml->appendChild($xml_rss);
	for($i=0;$i<count($url_array);$i++){
		echo "{\"name\":\"".$title_array[$i]."\",\"address\":\"$url_array[$i]\",\"summary\":[";
		$rss=simplexml_load_file($url_array[$i]);
		$xml_site = $xml->createElement("site");
		$xml_site_title = $xml->createElement("title");
		$xml_site_address = $xml->createElement("address");
		$xml_site_item = $xml->createElement("item");
		$xml_rss->appendChild($xml_site);
		$xml_site->appendChild($xml_site_title);
		$xml_site->appendChild($xml_site_address);
		$xml_site->appendChild($xml_site_item);
		$xml_site_title->appendChild($xml->createTextNode($title_array[$i]));
		$xml_site_address->appendChild($xml->createTextNode($url_array[$i]));
		$k=0;
		$node=null;
		$rsstype =0; //0: rss2.0 1:atom1.0
		$max =  count($rss->channel->item);
		if($max>0){
			$rsstype=0;
			$node = $rss->channel->item;
		}else{
			$rsstype=1;
			$node = $rss->entry;
			$max =  count($rss->entry);
			//echo $rss->feed->title;
		}
		$st = array('\\',"\"","\n","\t","\r");
		$re = array("\\\\",'\"',"","","");
		$nodemax=count($node);
		foreach($node as $item){
			$xml_site_item_article = $xml->createElement("article");
			$xml_site_item->appendChild($xml_site_item_article);
			$xml_site_item_title = $xml->createElement("title");
			$xml_site_item_article->appendChild($xml_site_item_title);
			$xml_site_item_link = $xml->createElement("link");
			$xml_site_item_article->appendChild($xml_site_item_link);
			$xml_site_item_time = $xml->createElement("time");
			$xml_site_item_article->appendChild($xml_site_item_time);
			$xml_site_item_content = $xml->createElement("content");
			$xml_site_item_article->appendChild($xml_site_item_content);
			if($rsstype==0){
				$titlestr= str_replace($st,$re,$item->title);
				$t=strtotime($item->pubDate);
				$timestr= date('Y-m-d H:i:s',$t);
				$contentstr= str_replace($st,$re,$item->description);
			}else{
				$titlestr= str_replace($st,$re,$item->title);
				$t=strtotime($item->updated);
				$timestr= date('Y-m-d H:i:s',$t);
				$contentstr= str_replace($st,$re,$item->content);
			}
			$xml_site_item_title->appendChild($xml->createTextNode($titlestr));
			$xml_site_item_link->appendChild($xml->createTextNode($item->link));
			$xml_site_item_time->appendChild($xml->createTextNode($timestr));
			$xml_site_item_content->appendChild($xml->createTextNode($contentstr));
			echo '{"title":"'.$titlestr.'",';
			echo '"time":"'.$timestr.'"}';
			$k++;
			if($k<$nodemax){
				echo ",";
			}else{
				echo ']}';
				break;
			}
		}
		if($i==count($url_array)-1){
			echo ']}';
			break;
		}else{
			echo ',';
		}
		
	}
	$xml->save($file);
}
mysql_close($conn);
?>