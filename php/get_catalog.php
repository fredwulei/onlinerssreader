<?php
require("mysql_conn.php");
$catasql = mysql_query("select * from `rsscata`;");
$cata_array = array();
while($catarow=mysql_fetch_object($catasql)){
	array_push($cata_array, $catarow->name);
}
$sql = mysql_query("select * from `rsslist` where `cataid`!='0' order by `cataid`;");
$k=0;
echo '{"cata":[';
while($row=mysql_fetch_object($sql)){
	if($k!=$row->cataid){
		if($k!=0){
			echo ']},';
		}
		echo '{"name":"'.$cata_array[$k].'",';
		echo '"rss":[{';
		$k++;
	}else{
		echo ',{';
	}
	echo '"id":"'.$row->id.'",';
	echo '"title":"'.$row->title.'",';
	echo '"link":"'.$row->url.'",';
	echo '"lang":"'.$row->language.'",';
	echo '"desc":"'.$row->description.'"';
	echo '}';
}
echo ']}]}';
?>