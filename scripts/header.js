var fnToLoad= "";


$( document ).ready(function() {

	

	cargaHTML(".mainHeader", "views/header.html", "header", function() {

    	
    	
  		
  		if(sessionStorage["nombre"] != undefined){
  			

			$.each( $(".menuitemlogin"), function( key, value ) {
			  
			  $(value).hide();
			});


  			$(".menuitemwelcome").html("<label>Bienvenido: " +sessionStorage["nombre"]+"</label><i class='material-icons'>assignment_ind</i>");
  			$(".menuitemwelcome").prepend("<i id='btnClose' class='material-icons'>exit_to_app</i>");
  			$(".menuitemwelcome").show();


  			$("#divMenuPrincipal > ul").html("");
  			$("#divMenuPrincipal > ul").append('<li><a class="menuitemindex" name="dashboard">INICIO</a></li>');
  			$("#divMenuPrincipal > ul").append('<li><a class="menuitemindex" name="ventaautos">VENTA DE AUTOS</a></li>');
  			$("#divMenuPrincipal > ul").append('<li><a class="menuitemindex" name="MisAutos">MIS AUTOS</a></li>');
	  		if (esAdmin()){
	  			$(".mainHeader").append('');
				$("#divMenuPrincipal > ul").append('<li><a class="dropdown-button" href="#!" data-activates="dropdownAdmn">Dropdown<i class="material-icons right">arrow_drop_down</i></a></li>');
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
		
		$('.dropdown-button').dropdown({
			inDuration : 300,
			outDuration : 225,
			constrainWidth : false, // Does not change width of dropdown to that of the activator
			hover : true, // Activate on hover
			gutter : 0, // Spacing from edge
			belowOrigin : true, // Displays dropdown below the button
			alignment : 'right', // Displays dropdown with edge aligned to the left of button
			stopPropagation : false // Stops event propagation
		}); 

		$(".menuitemindex").click(function(){
			debugger;
			CargaContenidoAdmin(this);
	      
	  	});
	  	$("#btnClose").click(function(){
	  		CargaContenidoMain();
	  	});

	});

 
    function CargaContenidoAdmin(o){
    	
 		fnToLoad = $(o).attr("name");
     	window.location.href = siteurl+"main.php?accion="+$(o).attr("name");
     	

	}

	
});