<?php
session_start();
require("mysql_conn.php");
$userid = $_SESSION['userid'];
$rssid = $_GET['sourceid'];
mysql_query("insert into `usersub` (`userid`,`rssid`,`title`) values ('$userid','$rssid','$title');");
$sql = "select * from `rsslist` where `id`='$rssid';";
$res = mysql_query($sql);
$rows = mysql_fetch_object($res);
$url = $rows->url;
$title = $rows->title;
$file  = '../cache/_cache_'.$userid.'.xml';
// $file = '../cache/test.xml';

class SimpleXMLExtended extends SimpleXMLElement
{
  public function addCData($cdata_text)
  {
    $node= dom_import_simplexml($this); 
    $no = $node->ownerDocument; 
    $node->appendChild($no->createCDATASection($cdata_text)); 
  } 
}
if(file_exists($file)){
	$string = file_get_contents($file);
}else{
	$string = <<<XML
<?xml version='1.0' encoding='utf-8'?>
<rss>
</rss>
XML;
}

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
$xml_site = $xml->addChild("site");
$xml_site->addAttribute('id', "$rssid");
$xml_site_title = $xml_site->addChild("title")->addCData($title);
$xml_site_address = $xml_site->addChild("address",$url);
$xml_site_item = $xml_site->addChild("item");
$k=0;
$st = array('\\',"\"","\n","\t","\r");
$re = array("\\\\",'\"',"","","");
echo "{\"name\":\"$title\",\"id\":\"$rssid\",\"address\":\"$url\",\"summary\":[";
foreach($node as $item){
	if($rsstype==0){
		// $titlestr= str_replace($st,$re,$item->title);
		$titlestr = $item->title;
		$t=strtotime($item->pubDate);
		$timestr= date('Y-m-d H:i:s',$t);
		// $contentstr= str_replace($st,$re,$item->description);
		$contentstr = $item->description;
	}else{
		// $titlestr= str_replace($st,$re,$item->title);
		$titlestr = $item->title;
		$t=strtotime($item->updated);
		$timestr= date('Y-m-d H:i:s',$t);
		// $contentstr= str_replace($st,$re,$item->content);
		$contentstr = $item->content;
	}
	$xml_site_item_article = $xml_site_item->addChild("article");
	$xml_site_item_article->addChild("title")->addCData($titlestr);
	$xml_site_item_article->addChild("link",$item->link);
	$xml_site_item_article->addChild("time",$timestr);
	$xml_site_item_article->addChild('content')->addCData($contentstr);
	if($k<3){
	echo '{"title":"'.$titlestr.'",';
	echo '"time":"'.$timestr.'"}';
		if($k<2){
			echo ",";
		}
	}
	$k++;
}
echo ']}';

file_put_contents($file, $xml->asXML());
mysql_close($conn);
?>