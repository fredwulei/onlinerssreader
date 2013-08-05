<?php
session_start();
require("mysql_conn.php");
$userid = $_SESSION['userid'];
$rssid = $_GET['rssid'];
mysql_query("delete from `usersub` where `userid`='$userid' and `rssid`='$rssid';");
$file = "../cache/_cache_$userid.xml";
$xml = new SimpleXMLElement(file_get_contents($file));
// echo $xml->site[0]['id'];
$res    = $xml->xpath("//site[@id='$rssid']");
$parent = $res[0];
unset($parent[0]);
file_put_contents($file, $xml->asXML());
mysql_close($conn);
?>