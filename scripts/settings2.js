
function cargaCatalogosEmpresas(empresa)
{

	$.ajax({
				dataType: "json",
				url: "data/settings.json",
				data: "data",
				success: function( data ) {
					
	  	 			$.each( data["empresas"], function( i, item ) {
					
	     				if(item.id == empresa){
	     					$("#cmbEmpresa").append('<option value="'+item.id+'" selected="selected">'+item.empresa +'</option>');
	     				}else
	     				{
	     					$("#cmbEmpresa").append('<option value="'+item.id+'">'+item.empresa +'</option>');
	     				}

	     				var toogleItem = '<label for="empresa'+i+'">'+ item.empresa +'</label>';
      					toogleItem += '<input type="checkbox" name="empresa'+i+'" id="empresa'+i+'">';
						$(".toggles").append(toogleItem);
	  	 			});
			}
		});
}
function muestraGaleria(idx){

	var dialog = $( "#gallery"+idx ).dialog({
						      autoOpen: false,
						      height: 400,
						      width: 350,
						      modal: true
						    });
	dialog.dialog( "open" );
}

function seleccionaImagen(obj){
	if($($(obj).parent()).attr("class") == "galleryunselected")
	{
		$($(obj).parent()).attr("class", "galleryselected");
	}else{

		$($(obj).parent()).attr("class", "galleryunselected");
	}
}
function cargaVehiculos()
{
	$.ajax({
				dataType: "json",
				url: "data/vehiculos-subasta.json",
				data: "data",
				success: function( data ) {
					var total = 0;
	  	 			$.each( data["vehiculos"], function( i, item ) {
						
	     				
	     					
	     					var renglon = "<div>";
								renglon += '<div><input type="checkbox" attr="attr-idx'+item.idVehiculo+'"  /></div>';
								renglon += '<div><img alt="'+ item.vehiculo+'" width="40px" src="'+ item.foto+'"  /></div>';
								renglon += "<div>";
									renglon += "<div>"+ item.vehiculo + "</div>";
									renglon += "<div>"+ item.descripcion + "</div>";
								renglon += "</div>";
							
								renglon += "<div>"+ item.ubicacion+ "</div>";
								renglon += "<div>"+ item.kms+ "</div>";
								renglon += "<img src='images/image-gallery.jpg' width='40px' onclick='muestraGaleria(" + item.idVehiculo +");' />";
								renglon += "<div>"+ item.salida+ "</div>";
								renglon += "<div style='display:none;' id='gallery"+item.idVehiculo+"'>";
									$.each( item.imagenes, function( j, item2 ) {
										renglon += "<div class='galleryunselected'><img width='80px' src='fotos/"+item2+"' onclick='seleccionaImagen(this);' /></div>"
									});
								renglon += "</div>";
								
							renglon += "</div>";


	     					$("#grdVehiculos").append(renglon);

	     						
	     				
	     			
	  	 			});
	  	 			
			}
		});

}


$( document ).ready(function() {


	$( ".mainBody" ).load( "views/settings2.html", function() {

		cargaCatalogosEmpresas(-1);

		    $( "#dp1" ).datepicker({
      			showOn: "button",
      			buttonImage: "images/calendar-icon.png",
      			buttonImageOnly: false,
      			buttonText: "Select date"
    		});

    		 $( "#dp2" ).datepicker({
      			showOn: "button",
      			buttonImage: "images/calendar-icon.png",
      			buttonImageOnly: false,
      			buttonText: "Select date"
    		});
    		$( ".toggles" ).controlgroup( {
      			direction: "vertical"
    		} );

			cargaVehiculos();
	
		
	});
	


});
