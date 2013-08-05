<?php
session_start();
$userid = $_SESSION['userid'];
//$userid = 1;
require("mysql_conn.php");

$sql = mysql_query("select * from `usersub` a,`rsslist` b where a.`rssid`=b.`id` and a.`userid`='$userid';");
$id_array = array();
$url_array = array();
$title_array = array();

if($row=mysql_fetch_object($sql)){
	do{
		array_push($id_array, $row->rssid);
		array_push($url_array, $row->url);
		array_push($title_array, $row->title);
	}while($row=mysql_fetch_object($sql));
}else{
	echo "0";
	mysql_close($conn);
	exit();
}

$file  = '../cache/_cache_'.$userid.'.xml';


class SimpleXMLExtended extends SimpleXMLElement
{
  public function addCData($cdata_text)
  {
    $node= dom_import_simplexml($this); 
    $no = $node->ownerDocument; 
    $node->appendChild($no->createCDATASection($cdata_text)); 
  } 
}

$string = <<<XML
<?xml version='1.0' encoding='utf-8'?>
<rss>
</rss>
XML;

$xml = new SimpleXMLExtended($string);

$rss = simplexml_load_file($url);
$node=null;
$rsstype =0; //0: rss2.0 1:atom1.0
$max =  count($rss->channel->item);
if($max>0){
	$rsstype = 0;
	$node = $rss->channel->item;
}else{
	$rsstype = 1;
	$node = $rss->entry;
	$max =  count($rss->entry);
}

echo '{"site": [';
for($i=0;$i<count($url_array);$i++){
	echo "{\"name\":\"".$title_array[$i]."\",\"address\":\"$url_array[$i]\",\"summary\":[";
	
	$rss=simplexml_load_file($url_array[$i]);

	$xml_site = $xml->addChild("site");
	$xml_site->addAttribute('id', $id_array[$i]);
	$xml_site_title = $xml_site->addChild("title")->addCData($title_array[$i]);
	$xml_site_address = $xml_site->addChild("address",$url_array[$i]);
	$xml_site_item = $xml_site->addChild("item");
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
		if($rsstype==0){
			$titlestr = $item->title;
			$t=strtotime($item->pubDate);
			$timestr= date('Y-m-d H:i:s',$t);
			$contentstr = $item->description;
		}else{
			$titlestr = $item->title;
			$t=strtotime($item->updated);
			$timestr= date('Y-m-d H:i:s',$t);
			$contentstr = $item->content;
		}
		$xml_site_item_article = $xml_site_item->addChild("article");
		$xml_site_item_article->addChild("title")->addCData($titlestr);
		$xml_site_item_article->addChild("link",$item->link);
		$xml_site_item_article->addChild("time",$timestr);
		$xml_site_item_article->addChild('content')->addCData($contentstr);
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
file_put_contents($file, $xml->asXML());
mysql_close($conn);

?>