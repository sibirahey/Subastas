
var calendars = {};

$( document ).ready(function() {
	//carga el contenido del index
  cargaHTML(".mainBody", "views/index.html","", function() {
    console.log( "Cargo index." );
    //asigna función click a cada elemento del menú
  	asignaFunciones();
	
  	$("h1").click(function(){
      cargaHTML(".mainBody","views/index.html", "", function() {
  		  console.log( "carga home");

      });

    });
    

  });
	
	function asignaFunciones(){
		jssor_1_slider_init();
		$(".menuitem").click(function(){

       //obtiene la propiedad name del elemento del menu y busca la vista con el mismo nombre y lo carga con ajax
      cargaHTML(".mainBody","views/main/"+ $(this).attr("name")+".html", $(this).attr("name"),function() {
        
        if($(".mainBody").attr("name") == "registro"){

          cargaFuncionesRegistro();
        }else if ($(".mainBody").attr("name") == "login"){
          cargaFuncionesLogin();
        }
        console.log( "cargo info ");
			 	//Oculta los divs que contienen la información de los serivicios
			 	$(".serviciosInfo").hide();

			 	//asigna funcion click a los submenus
			 	$(".submenuitem").click(function(){
			 		 $(".serviciosInfo").hide();
			 		 $(".serviciosInfo[name='"+$(this).attr("name")+"']").show();

			 	});
			});

		});
	}

  function cargaFuncionesRegistro(){
    $(".divError").hide();
    $(".divErrorPassword").hide();
    $.dobPicker({
      // Selectopr IDs
        daySelector: '#dobday',
        monthSelector: '#dobmonth',
        yearSelector: '#dobyear',
        // Default option values
        dayDefault: 'Day',
        monthDefault: 'Month',
        yearDefault: 'Year',
        // Minimum age
        minimumAge: 12,
        // Maximum age
        maximumAge: 100    // OPTIONS
    });

    postrequest("categorias/listar", {"estatus":"1"}, function(data){
        
      for (cat in data.responseJSON){
     
        $("#divPreferencias").append('<div><input type="checkbox" attr-data="'+ data.responseJSON[cat].id+'" class="chkPref" />'+data.responseJSON[cat].descripcion +"</div>" );
      }

    });

    $("#btnEula").click(function(){

      $( function() {
        $( "#dialogEula" ).dialog();
      });

    });

 /*
  *
  *Registro
  *
  */
    $("#btnGuardar").click(function(){

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
        
        var foo = new UsuarioCategorias(-1, $(this).attr( "attr-data" ));
        oUsuario.categorias.push(foo);
      });

      if(!ValidaRegistro(oUsuario)){
        return false;
      }else{
        oUsuario.fecha_nacimiento = new Date(oUsuario.yyyy, oUsuario.mm -1, oUsuario.dd );

      }

      
       postrequest("usuarios/registro", oUsuario, function(data){
            if(data.responseJSON=="OK"){
              /// ir a main    
            };
          });


    });

    $("#registroRepetirPass").focusout(function() {
        if($("#registroRepetirPass").val() != $("#registroPassword").val().trim()){

          $(".divErrorPassword").show();
        }else{
          $(".divErrorPassword").hide();
        }
    });

    function ValidaRegistro(oUsuario){
      
      var i = 0;
      var msj = "";
      if(oUsuario.nombre.trim() == ""){
        i++;
        msj += "Nombre, ";
      }
      if(oUsuario.appaterno.trim() == ""){
        i++;
        msj += "Apellido paterno, ";
      }
      if(oUsuario.apmaterno.trim() == ""){
        i++;
        msj += "Apellido materno, ";
      }
      if(oUsuario.email.trim() == ""){
        i++;
        msj += "Correo electrónico, ";
      }
      if(oUsuario.password.trim() == ""){
        i++;
        msj += "Password,";
      }
      if(oUsuario.password.trim() == ""){
        i++;
        msj += "Repetir password,";
      }
      if(oUsuario.dd.trim() == ""){
        i++;
        msj += "Día de nacimiento,";
      }
      if(oUsuario.mm.trim() == ""){
        i++;
        msj += "Mes de nacimiento,";
      }
      if(oUsuario.yyyy.trim() == ""){
        i++;
        msj += "Año de nacimiento,";
      }
      var j = 0;
      $(".chkPref:checked").each(function() {
        j++;
      });
      if(j == 0){
        i++;
        msj += "Temas de interés,";
      }
      if(!$('#registroEULA')[0].checked) {
         i++;
        msj += "Aceptar términos y condiciones,";
      }

      if(i > 0){
          $(".divError").show();
          $(".divError").text("Algunos de los campos están vacíos: " + msj);
          return false;

      }else{
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
  function cargaFuncionesLogin(){
    $("#btnLogin").click(function(){
      
      oLogin = new Login();
      oLogin.email = $("#loginMail").val();
      oLogin.password = $("#loginPassword").val();

       postrequest("usuarios/login", oLogin, function(data){
            var data = data.responseJSON;


            if(data["valido"] == 1){
              window.location.href = "main.html";
              sessionStorage.setItem('usuario', 'data');
            }else{
              alert("Error de usuario o contraseña");
            }

          });
    });
  }

}); 


