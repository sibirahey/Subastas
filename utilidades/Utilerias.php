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

function envia_mensaje_verificacion($claveApi, $idusuario, $correo){
 	$mensaje = "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><body><h2>Bienvenido a escudería</h2><p>Para terminar su registro por favor confirme su mail: <a href=\"msusano.com/Subastas/home.php?s=valida&claveapi=". $claveApi."&idusuario=".$idusuario."&correo=".$correo."\">Confirmar mail</a><br /><p>Si no puede dar click en el encace puede copiar el código  ". $claveApi." en la pantalla de verificación </p></body></html>";
 	return $mensaje;
	
}
function envia_mensaje_invitacion($claveApi, $idusuario){

 	$mensaje = "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />	<body><h2>Bienvenido a escudería</h2><p>Usted fue invitado a participar en una subasta por favor concluya el registro para poder participar: <a href=\"msusano.com/Subastas/home.php?s=invitacion&claveapi=". $claveApi."&idusuario=".$idusuario."\">Confirmar mail</a><br /><p>Si no puede dar click en el encace puede copiar el código  ". $claveApi." en la pantalla de verificación </p></body></html>";
 	return $mensaje;
 }

 function envia_mensaje_recuperarcontrasena($claveApi, $correo){

 	$mensaje = "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />	<body><h2>Escudería - recuperar contraseña</h2><p>Para recuperar su contraseña de click al link o copie la dirección en su explorado: <a href=\"http://msusano.com/Subastas/home.php?s=nuevacontrasena&claveapi=". $claveApi."&correo=".$correo."\">http://msusano.com/Subastas/home.php?s=nuevacontrasena&claveapi=". $claveApi."&correo=".$correo."</a><br /></body></html>";
 	return $mensaje;
 }
?>
