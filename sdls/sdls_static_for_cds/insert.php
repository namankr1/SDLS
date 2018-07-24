<?php
$baseurl = "http://172.16.26.9:6785/";
$url = $baseurl."pireadingslogger/insertReadings/";
$json = file_get_contents('php://input');
$ch = curl_init();
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json')); 
$result = curl_exec($ch);
echo($result);
?>

