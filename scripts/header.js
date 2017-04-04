var fnToLoad= "";


$( document ).ready(function() {

	

	cargaHTML(".mainHeader", "views/header.html", "header", function() {

    	debugger;
    	
  		
  		if(sessionStorage["nombre"] != undefined){
  			

			$.each( $(".menuitemlogin"), function( key, value ) {
			  
			  $(value).hide();
			});


  			$(".menuitemwelcome").html("Bienvenido: " +sessionStorage["nombre"]);
  			$(".menuitemwelcome").show();
  			$(".menuitemwelcome").css("width","160px");


  			$("#divMenuPrincipal").html("");
  			$("#divMenuPrincipal").append('<li class="menuitemindex" name="dashboard"><label>DASHBOARD</label></li>');
  			$("#divMenuPrincipal").append('<li class="menuitemindex" name="ventaautos" ><label>VENTA DE AUTOS</label></li>');
	  		if (esAdmin()){
				$("#divMenuPrincipal").append('<li class="menuitemindex" name="homeadmin"> <label>ADMININISTRADOR DE HOME</label></li>');
				$("#divMenuPrincipal").append('<li class="menuitemindex" name="subastasadmin" ><label>ADMININISTRADOR DE SUBASTAS</label></li>');
				$("#divMenuPrincipal").append('<li class="menuitemindex" name="subastasadmin" ><label>ADMININISTRADOR VENTA DE AUTOS</label></li>');
			}


  		}else{

  			$.each( $(".menuitemlogin"), function( key, value ) {
			  
			  $(value).show();
			});
  			$(".menuitemwelcome").hide();
  		}
  				
		

		$(".menuitemindex").click(function(){
			
			CargaContenidoAdmin(this);
	      
	  	});
	  	$("#btnClose").click(function(){
	  		CargaContenidoMain();
	  	});

	});

    function CargaContenidoAdmin(o){
 		fnToLoad = $(o).attr("name");
     	cargaHTML(".mainBody","views/main/admin/"+ $(o).attr("name")+".html", $(o).attr("name"),function() {
      		CargaFunciones();
      	});

	}

	
});


/*
	<li><label>NOSOTROS</label></li>
	<li><label>SUBASTAS</label></li>
	<li><label>TUTORIALES</label></li>
	<li><label>PREGUNTAS FRECUENTES</label></li>
	<li><label>CONTACTO</label></li>

	*/