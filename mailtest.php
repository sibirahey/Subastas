<?php
require_once('utilidades/Utilerias.php');

$headers = array(
  'From: "Escudería" <yo@msusano.com>' ,
  'Reply-To: "No responder" <yo@msusano.com>' ,
  'X-Mailer: PHP/' . phpversion() ,
  'MIME-Version: 1.0' ,
  'Content-type: text/html; charset=iso-8859-1' 
);
$headers = implode( "\r\n" , $headers );

echo $headers;

echo envia_mail("miguel.susano@gmail.com", "Bienvenido a Escudería", "<p>Bienvenido a escudería</p><p>Para terminar su registro por favor confirme su mail: </p><p><a href=\"msusano.com/Subastas/usuarios/confirmar/aaaaaaaa\">Confirmar mail</a></p>");
?>
