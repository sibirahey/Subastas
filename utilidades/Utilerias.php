<?php

function envia_mail($to, $titulo, $mensaje){
	// multiple recipients
	//$to = 'miguel.susano@gmail.com';

	// subject
	
	$headers = array(
	  'From: "Escudería" <yo@msusano.com>' ,
	  'Reply-To: "No responder" <yo@msusano.com>' ,
	  'X-Mailer: PHP/' . phpversion() ,
	  'MIME-Version: 1.0' ,
	  'Content-type: text/html; charset=iso-8859-1' 
	);
	$headers = implode( "\r\n" , $headers );


	// Mail it
	return mail($to, $titulo, $mensaje, $headers);

}


function envia_mensaje_invitacion($claveApi, $idusuario, $idsubasta){

 	// $mensaje = "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />	<body><h2>Bienvenido a escudería</h2><p>Usted fue invitado a participar en una subasta por favor concluya el registro para poder participar: <a href=\"msusano.com/Subastas/home.php?s=invitacion&claveapi=". $claveApi."&idusuario=".$idusuario."\">Confirmar mail</a><br /><p>Si no puede dar click en el encace puede copiar el código  ". $claveApi." en la pantalla de verificación </p></body></html>";
 	// return $mensaje;

 	$myfile = fopen("utilidades/subastainvitacion.txt", "r") or die("Unable to open file!");
 	$contenido = "";
	while(!feof($myfile)) {
  		$contenido .= fgets($myfile);
		
	}
	$contenido = str_replace("##claveApi##", $claveApi, $contenido);
	$contenido = str_replace("##idusuario##", $idusuario, $contenido);
	$contenido = str_replace("##idsubasta##", $idsubasta, $contenido);
	fclose($myfile);
	return $contenido;
 }

 function envia_mensaje_recuperarcontrasena($claveApi, $correo){

 	
 	$myfile = fopen("utilidades/recuperarcontrasena.txt", "r") or die("Unable to open file!");
 	$contenido = "";
	while(!feof($myfile)) {
  		$contenido .= fgets($myfile);
		
	}
	$contenido = str_replace("##claveApi##", $claveApi, $contenido);
	$contenido = str_replace("##idusuario##", $idusuario, $contenido);
	fclose($myfile);
	return $contenido;
 }

function mensaje_correoregistro($claveApi, $idusuario, $correo){
	
	$myfile = fopen("utilidades/correoregistro.txt", "r") or die("Unable to open file!");
	
	$contenido = "";
	while(!feof($myfile)) {
  		$contenido .= fgets($myfile);
		
	}
	//echo $contenido;
	

	$contenido = str_replace("##claveApi##", $claveApi, $contenido);
	$contenido = str_replace("##idusuario##", $idusuario, $contenido);
	$contenido = str_replace("##correo##", $correo, $contenido);
	fclose($myfile);
	return $contenido;
 }

?>
