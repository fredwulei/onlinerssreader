<?php

// $xml = new DOMDocument('1.0', 'utf-8'); 
// $xml->load($file);
// $xml_site = $xml->createElement("site");
// $xml_site_title = $xml->createElement("title");
// $xml_site_address = $xml->createElement("address");
// $xml_site_item = $xml->createElement("item");
// $rssrr = $xml->getElementsByTagName("rss");
// $rssrr->item(0)->appendChild($xml_site);
// $xml_site->appendChild($xml_site_title);
// $xml_site->appendChild($xml_site_address);
// $xml_site->appendChild($xml_site_item);
// $xml_site_title->appendChild($xml->createTextNode($title));
// $xml_site_address->appendChild($xml->createTextNode($url));

$string = <<<XML
<?xml version='1.0' encoding='utf-8'?>
<article>
</article>
XML;
$xml = simplexml_load_string($string);


$xml_site = $xml->addCh;
$xml_site_title = $xml->createElement("title");
$xml_site_address = $xml->createElement("address");
$xml_site_item = $xml->createElement("item");
$rssrr = $xml->getElementsByTagName("rss");
$rssrr->item(0)->appendChild($xml_site);
$xml_site->appendChild($xml_site_title);
$xml_site->appendChild($xml_site_address);
$xml_site->appendChild($xml_site_item);
$xml_site_title->appendChild($xml->createTextNode($title));
$xml_site_address->appendChild($xml->createTextNode($url));



// foreach ($data_array as $data) {
//     $item = $xml->addChild('item');
//     if (is_array($data)) {
//         foreach ($data as $key => $row) {
//           $node = $item->addChild($key, $row);
 
//           if (isset($attribute_array[$key]) && is_array($attribute_array[$key]))
//             {
//               foreach ($attribute_array[$key] as $akey => $aval) {
//              //  设置属性值
//                   $node->addAttribute($akey, $aval);
//             }
//           }
//         }
//     }
// }
echo $xml->asXML();
?>