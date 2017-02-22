function CargaDatos(){

	$.ajax({
		dataType : "json",
		url : "data/subastas.json",
		data :"data",
		success: function(data){

			$.each(data["datos"],function(i,item){

				var renglon = "<div class='rows_Ofertas'>";
				renglon += "<div>"+ item.empresa+"</div>";
				renglon += "<div>"+ item.estatus+"</div>";
				renglon += "<div>"+ item.fechaInicio+"</div>";
				renglon += "<div>"+ item.fechaFin+"</div>";
				renglon += '<div><button type="button" attr-id="'+item.id+'" onclick="VerSubasta(this);">Ver Subasta</button></div>';				
				renglon += "</div>";

				$("#grdResultados").append(renglon);

			});


		}
	});


}
function VerSubasta(o){
	alert($(o).attr("attr-id"));


}
$(document).ready(function(){

  cargaHTML(".mainBody", "views/main.html","", function() {
  		
  		CargaDatos();




  	});

  });

