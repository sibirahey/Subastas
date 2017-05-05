<?php

$headers = array(
  'From: "The Sending Name" <noreply@rilburskryler.net>' ,
  'Reply-To: "The Reply To Name" <noreply@rilburskryler.net>' ,
  'X-Mailer: PHP/' . phpversion() ,
  'MIME-Version: 1.0' ,
  'Content-type: text/html; charset=iso-8859-1' 
);
$headers = implode( "\r\n" , $headers );
mail ( "miguel.susano@gmail.com" , "hola", "hola", $headers, "-f miguel.susano@gmail.com");
echo "mail sent";
?>
