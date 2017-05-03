var fnToLoad= "";


$( document ).ready(function() {

	

	cargaHTML(".mainHeader", "views/header.html", "header", function() {

    	//debugger;
    	
  		
  		if(sessionStorage["nombre"] != undefined){
  			

			$.each( $(".menuitemlogin"), function( key, value ) {
			  
			  $(value).hide();
			});


  			$(".menuitemwelcome").html("Bienvenido: " +sessionStorage["nombre"]);
  			$(".menuitemwelcome").show();


  			$("#divMenuPrincipal > ul").html("");
  			$("#divMenuPrincipal > ul").append('<li><a class="menuitemindex" name="inicio">INICIO</a></li>');
  			$("#divMenuPrincipal  > ul").append('<li><a class="menuitemindex" name="ventaautos">VENTA DE AUTOS</a></li>');
	  		if (esAdmin()){
				$("#divMenuPrincipal  > ul").append('<li><a class="menuitemindex" name="homeadmin">ADMININISTRADOR DE HOME</a></li>');
				$("#divMenuPrincipal  > ul").append('<li><a class="menuitemindex" name="subastasadmin">ADMININISTRADOR DE SUBASTAS</a></li>');
				$("#divMenuPrincipal > ul").append('<li><a class="menuitemindex" name="ventassadmin">ADMININISTRADOR VENTA DE AUTOS</a></li>');
			}


  		}else{

  			$.each( $(".menuitemlogin"), function( key, value ) {
			  
			  $(value).show();
			});
  			$(".menuitemwelcome").hide();
  		}
		
		jssor_1_slider_init();
		$('.jssorContainer').find('video').get(0).play();
		$('.jssorContainer').find('video').get(1).play();
		

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