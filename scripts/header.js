var fnToLoad= "";


$( document ).ready(function() {
    $( ".mainHeader" ).load( "views/header.html", function() {
  		$("#divMenuPrincipal").append("<li><label>NOSOTROS</label></li>");
  		if (esAdmin()){
			$("#divMenuPrincipal").append('<li class="menuitem" name="homeadmin"><label>ADMININISTRADOR DE HOME</label></li>');
			$("#divMenuPrincipal").append('<li class="menuitem" name="subastasadmin" ><label>ADMININISTRADOR DE SUBASTAS</label></li>');
		}

		$(".menuitem").click(function(){
			
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