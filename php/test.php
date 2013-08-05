<?php
$file = "../cache/test.xml";
$data  = simplexml_load_file($file);
$doc = new SimpleXMLElement(file_get_contents($file));
// echo $doc->site[0]['id'];
$res    = $doc->xpath('//site[@id="1"]');
$parent = $res[0];
unset($parent[0]);
echo $doc->asXml();

?>