var calendars = {};
$(document).ready(function() {
	//carga el contenido del index

	checkCookie();
	$(".logoHeader").click(function(){

		window.location = siteurl+"home.php";
	});


	cargaHTML(".mainBody", "views/index.html", "", function() {
		
		CargaJsonHome();

	});

	cargaHTML(".mainHeader", "views/header.html", "", function() {
		//debugger;
		
		asignaFunciones();
		jssor_1_slider_init();
		
		$(".button-collapse").sideNav();
		
		$('.jssorContainer').find('video').get(0).play();
		$('.jssorContainer').find('video').get(1).play();
		$(".logoHeader").click(function() {
			cargaHTML(".mainBody", "views/index.html", "", function() {
				console.log("carga home");

			});

		});
		

		
		var urlvars = getUrlVars();
		if(urlvars["s"] != undefined){
				cargaHTMLLogin(urlvars["s"]);
		}

		

	});

	cargaHTML(".mainFooter", "views/footer.html", "", function() {
		console.log("Cargo footer");
	});

	function cargaHTMLLogin(seccion){
		//obtiene la propiedad name del elemento del menu y busca la vista con el mismo nombre y lo carga con ajax

		

		cargaHTML(".mainBody", "views/main/" + seccion+ ".html", $(this).attr("name"), function() {

			if (seccion == "registro") {
				cargaFuncionesRegistro();
			} else if (seccion == "login") {
				
				cargaFuncionesLogin();
				$('.mainHeader').hide();
				$('.mainFooter').hide();
				$('#loginMail').focus();
			}else if (seccion == "servicios"){
				initCargaServicios();
			}
			
		});


	}

	function asignaFunciones() {
		
		$(".menuitem").click(function() {
			window.location = "?s="+$(this).attr("name");
		});

		$(".menuitemindex").click(function() {
			window.location = "?s="+$(this).attr("name");
		});

		$(".submenuitem").click(function() {
				window.location = "?s="+$(this).attr("name");
		});
	}

	

	function cargaFuncionesRegistro() {
		$(".divError").hide();
		$(".divErrorPassword").hide();
		$.dobPicker({
			// Selectopr IDs
			daySelector : '#dobday',
			monthSelector : '#dobmonth',
			yearSelector : '#dobyear',
			// Default option values
			dayDefault : 'Día',
			monthDefault : 'Mes',
			yearDefault : 'Año',
			// Minimum age
			minimumAge : 12,
			// Maximum age
			maximumAge : 100 // OPTIONS
		});
		
		$('select').material_select();
		
		postrequest("categorias/listar", {
			"estatus" : "1"
		}, function(data) {

			for (cat in data) {

				// $("#divPreferencias").append('<div class="divRegistro"><input type="checkbox" attr-data="' + data[cat].id + '" class="chkPref" />' + data[cat].descripcion + "</div>");
				$("#divPreferencias").append('<p><input type="checkbox" id="' + data[cat].id + '" attr-data="' + data[cat].id + '" class="chkPref" /><label for="' + data[cat].id + '">' + data[cat].descripcion + '</label></p>')
			}

		});

		$("#btnEula").click(function() {

			$(function() {
				$("#dialogEula").dialog({
					height : 400,
					width : 500,
					modal : true,
					title : "Terminos y Condiciones",
					buttons : {
						Ok : function() {
							$(this).dialog("close");
						}
					}
				});
			});

		});

		/*
		 *
		 *Registro
		 *
		 */
		$("#btnGuardar").click(function() {

			var oUsuario = new Usuario();
			oUsuario.nombre = $("#registroNombre").val();
			oUsuario.appaterno = $("#registroApPaterno").val();
			oUsuario.apmaterno = $("#registroApMaterno").val();
			oUsuario.email = $("#registroMail").val();
			oUsuario.password = $("#registroPassword").val();
			oUsuario.verificapassword = $("#registroRepetirPass").val();
			oUsuario.dd = $("#dobday").val();
			oUsuario.mm = $("#dobmonth").val();
			oUsuario.yyyy = $("#dobyear").val();
			oUsuario.placa = $("#registroPlaca").val();
			oUsuario.categorias = [];
			var categorias = [];
			$(".chkPref:checked").each(function() {

				var foo = new UsuarioCategorias(-1, $(this).attr("attr-data"));
				oUsuario.categorias.push(foo);
			});

			if (!ValidaRegistro(oUsuario)) {
				return false;
			} else {
				oUsuario.fecha_nacimiento = new Date(oUsuario.yyyy, oUsuario.mm - 1, oUsuario.dd);

			}

			postrequest("usuarios/registro", oUsuario, function(data) {
				//debugger;
				if (data == 1) {
					window.location.href = "home.php";

					sessionStorage.setItem('nombre', $("#registroNombre").val() + " " + $("#registroApPaterno").val() + " " + $("#registroApMaterno").val());
					sessionStorage.setItem('correo', $("#registroMail").val());
					sessionStorage.setItem('publico', 0);
					sessionStorage.setItem('es_admin',0);
					sessionStorage.setItem('claveapi', data["claveApi"]);


				}else{
					alert("Ocurrió un error al realizar el registro");
				}

			},function(data){
				alert("Ocurrió un error al guardar el registro");
			});

		});

		$("#registroRepetirPass").focusout(function() {
			if ($("#registroRepetirPass").val() != $("#registroPassword").val().trim()) {

				$(".divErrorPassword").show();
			} else {
				$(".divErrorPassword").hide();
			}
		});

		function ValidaRegistro(oUsuario) {

			var i = 0;
			var msj = "";
			if (oUsuario.nombre.trim() == "") {
				i++;
				msj += "Nombre, ";
			}
			if (oUsuario.appaterno.trim() == "") {
				i++;
				msj += "Apellido paterno, ";
			}
			if (oUsuario.apmaterno.trim() == "") {
				i++;
				msj += "Apellido materno, ";
			}
			if (oUsuario.email.trim() == "") {
				i++;
				msj += "Correo electrónico, ";
			}else{
				if(!ValidaEmail(oUsuario.email.trim())){
					msj += "Proporcione un correo elecrónico válido, ";
				}
			}
			if (oUsuario.password.trim() == "") {
				i++;
				msj += "Password,";
			}
			if (oUsuario.password.trim() == "") {
				i++;
				msj += "Repetir password, ";
			}
			if (oUsuario.dd.trim() == "") {
				i++;
				msj += "Día de nacimiento, ";
			}
			if (oUsuario.mm.trim() == "") {
				i++;
				msj += "Mes de nacimiento, ";
			}
			if (oUsuario.yyyy.trim() == "") {
				i++;
				msj += "Año de nacimiento, ";
			}
			var j = 0;
			$(".chkPref:checked").each(function() {
				j++;
			});
			if (j == 0) {
				i++;
				msj += "Temas de interés, ";
			}
			if (!$('#registroEULA')[0].checked) {
				i++;
				msj += "Aceptar términos y condiciones";
			}

			if (i > 0) {
				//$(".divError").show();
				//$(".divError").text("Algunos de los campos están vacíos: " + msj);
				Materialize.toast('Algunos de los campos están vacíos:'+ msj , 4000);
				return false;

			} else {
				$(".divError").hide();
				return true;
			}

		}

	};

	/*
	 *
	 *Login
	 *
	 */
	function cargaFuncionesLogin() {
		$('.logoCar').on('click', function() {
			cargaHTML(".mainBody", "views/index.html", "", function() {
				$('.mainHeader').show();
			});
		});

		

		$('.logoLogin').on('click', function() {
			cargaHTML(".mainBody", "views/index.html", "", function() {
				$('.mainHeader').show();
			});
		});
		$("#btnLogin").click(function() {

			doLogin();
		});

		$("#loginPassword").keydown(function( event ) {
		  if ( event.which == 13 ) {
		    doLogin();
		  }
		});

		function doLogin(){

			oLogin = new Login();
			oLogin.email = $("#loginMail").val();
			oLogin.password = $("#loginPassword").val();

			postrequest("usuarios/login", oLogin, function(data) {

				if (data.valido) {

					debugger;
					sessionStorage.setItem('nombre', data["nombre"] + " " + data["appaterno"] + " " + data["apmaterno"]);
					sessionStorage.setItem('correo', data["correo"]);
					sessionStorage.setItem('publico', data["publico"]);
					sessionStorage.setItem('es_admin', data["esadmin"]);
					sessionStorage.setItem('claveapi', data["claveApi"]);
					
					if($("#rememberme").is(':checked')){
						
						setCookie("escuderia-rememberme", data["claveApi"], true);
					}
					window.location.href = "main.php";

				} else {
					alert("Error de usuario o contraseña");
				}

			});
		}
		
	}

});

