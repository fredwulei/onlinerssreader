<?php 
$conn = mysql_connect("localhost","root","root") or die("Database Server Connection Error".mysql_error());
mysql_select_db("rss") or die("Database Access Error".mysql_error());
mysql_query("set names utf8");
?>