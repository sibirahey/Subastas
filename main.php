<!doctype html>

<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		
		<link href="https://fonts.googleapis.com/css?family=Oswald:300,400,700&amp;subset=latin-ext" rel="stylesheet"/>
		<link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700" rel="stylesheet"/>
		<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		
		<link href="css/jquery-ui.css" rel="stylesheet"/>
		<link href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"  rel="stylesheet"/>
		<link href="css/font-awesome.min.css" rel="stylesheet"/>
		<link href="css/colorbox.css" rel="stylesheet"/>
		
		
		<link type="text/css" rel="stylesheet" href="css/materialize.css"  media="screen,projection"/>
		<link href="css/styles.css<?php echo "?" . rand(0, 9999999); ?>" rel="stylesheet"/>
		
		
		<script type="text/javascript" src="scripts/jquery-1.12.4.js"></script>
		<script type="text/javascript" src="scripts/jquery-ui.js"></script>
		<script type="text/javascript" src="scripts/jssor.slider-22.2.8.debug.js" ></script>
		<script type="text/javascript" src="scripts/dobPicker.min.js"></script>
		<script type="text/javascript" src="scripts/jquery.colorbox.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/materialize.js<?php echo "?" . rand(0, 9999999); ?>"></script>

		
		<script type="text/javascript" src="scripts/main.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/header.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/admin.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<!-- <script type="text/javascript" src="scripts/footer.js<?php echo "?".rand(0, 9999999); ?>"></script> -->
		<script type="text/javascript" src="scripts/utilidades.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/request.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/imgSlider.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/uisearch.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/entities.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/modulos/admin/adminsubastas.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/modulos/admin/altaauto.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		<script type="text/javascript" src="scripts/Venta-Autos.js<?php echo "?" . rand(0, 9999999); ?>"></script>
		
	</head>
	<body>
		<!-- contenedor "absoluto"" del sitio -->
		<div class="mainContainer">
			<!-- contenedor del encabezado del sitio -->
			<div class="mainHeader">
				<!-- En ésta parte esta: el titulo de la pagina y los botones principales para registrarse o entrar -->
				<div>
					<h1>ESCUDERIA</h1>
					<div class="menuitem" name="registro">
						Registrate
					</div>
					<div class="menuitem" name="login">
						Entrar
					</div>
				</div>
				<!-- menú principal; botones de redes sociales -->
				<ul>
					<li class="menuitem" name="quienes">
						<label>¿Quienes somos?</label>
					</li>
					<li class="menuitem"  name="mision">
						<label>Misi&oacute;n<label>
					</li>
					<li class="menuitem"  name="vision">
						<label>Visi&oacute;n</label>
					</li>
					<li class="menuitem"  name="objetivos">
						<label>Objetivos</label>
					</li>
					<li class="menuitem"  name="servicios">
						<label>Servicios ofertados</label>
					</li>

					<li>
						<button class="btnTwitter" title="twitter"></button>
					</li>
					<li>
						<button class="btnFacebook" title="facebook"></button>
					</li>
				</ul>
				<!-- apartado de fecha y hora -->
				<!-- <div><label>JUEVES, 19 DE ENERO DE 2017</label><label> 11:28:17</label></div>-->
			</div>
			<!-- contenedor del cuerpo principal del sitio -->
			<div class="mainMinusHeader">
				<!-- <div id="btnClose">[X]</div> -->
				<div class="mainBody"></div>
				<!-- <div class="mainFooter"></div> -->
			</div>
		</div>

		<div class="modalWindow"></div>

	</body>
	<!-- contenedor del cuerpo principal del sitio -->
</html>