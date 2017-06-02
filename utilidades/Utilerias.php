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

?>
