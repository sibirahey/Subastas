<?php

function envia_mail($to, $titulo, $mensaje){
	// multiple recipients
	//$to = 'miguel.susano@gmail.com';

	// subject
	$subject = 'Prueba html';

	
	// message
	/*
	$message = '
	  <p>Here are the birthdays upcoming in August!</p>
	  <a href="google.com">google</a>
	';
	*/

	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";

	// Additional headers
	$headers .= 'From: yo@msusano.com' . "\r\n";


	// Mail it
	return mail($to, $subject, $mensaje, $headers);

}

?>
