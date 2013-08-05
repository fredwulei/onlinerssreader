<?php 
require("mysql_conn.php");
$sessionkey =$_COOKIE['sessionkey'];
if($sessionkey==""){
	echo "0";
	exit();
}else{
	$sql = "select * from `userinfo` where `key` = '$sessionkey';";
	$res = mysql_query($sql);
	$rows = mysql_fetch_object($res);
	if($rows){
		session_start();
		echo '{"name":"'.$rows->nickname.'","avatar":"'.$rows->avatarurl.'"}';
		$_SESSION['userid'] = $rows->id;
		exit();
	}else{
		echo "0";
		exit();
	}
}
mysql_close($conn);
?>