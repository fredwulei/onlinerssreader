<?php 
require("mysql_conn.php");
$username=$_GET['username'];
$password=md5($_GET['password']);
$autologin=$_GET['autologin'];
if ($username && $password){
	$sql = "select * from `userinfo` where `username` = '$username' and `password` = '$password'";
	$res = mysql_query($sql);
	$rows = mysql_fetch_object($res);
	if($rows){
		session_start();
		if($autologin=="1"){
			$key = md5(time().$username);
			setcookie('sessionkey', $key, time() + (86400 * 7));
			mysql_query("update `userinfo` set `key`='$key' where `username`='$username';");
		}else{
			setcookie('sessionkey', '', time() - 3600);
			mysql_query("update `userinfo` set `key`='' where `username`='$username';");
		}
		echo '{"name":"'.$rows->nickname.'","avatar":"'.$rows->avatarurl.'"}';
		$_SESSION['userid'] = $rows->id;
		exit();
	}else{
		echo "0";
		exit();
	}
}else {
	echo "0";
	exit();
}
mysql_close($conn);
?>