
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

		$(".menuitem").click(function(){

       //obtiene la propiedad name del elemento del menu y busca la vista con el mismo nombre y lo carga con ajax
      cargaHTML(".mainBody","views/main/"+ $(this).attr("name")+".html", $(this).attr("name"),function() {
        
        if($(".mainBody").attr("name") == "registro"){

          cargaFuncionesRegistro();
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
        maximumAge: 80    // OPTIONS
    });

    postrequest("categorias/listar", {"estatus":"1"}, function(data){
        
      for (cat in data.responseJSON){
        debugger;
        $("#divPreferencias").append('<div><input type="checkbox" attr-data="'+ data.responseJSON[cat].id+'" class="chkPref" />'+data.responseJSON[cat].descripcion +"</div>" );
      }

    });

    $("#btnEula").click(function(){

      $( function() {
        $( "#dialogEula" ).dialog();
      });

    });

   

  };

}); 


