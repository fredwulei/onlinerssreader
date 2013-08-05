<?php
require("mysql_conn.php");
$username=$_GET['username'];
$nickname=$_GET['nickname'];
$password=md5($_GET['password']);
$sql = "select * from `userinfo` where `username` = '$username';";
$res = mysql_query($sql);
$rows = mysql_fetch_object($res);
$createtime=date("Y-m-d H:i:s");
if($rows){
	echo '0';
}else{
	mysql_query("insert into `userinfo` (`username`,`nickname`,`password`,`avatarurl`,`createtime`) values ('$username','$nickname','$password','avatar.png','$createtime');");
	echo "1";
}
mysql_close($conn);
?>