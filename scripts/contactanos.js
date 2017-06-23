
function cargaFuncionesMisContactos(){

		$("select").material_select();
		//$("#miscontactos").load("views/MisCotizaciones.html?rand="+Math.random(), function() {
			
			
		$("#txtFechaInicio").datepicker();
		$("#txtFechaFin").datepicker();

		$("#btnFiltrar").click(function(){
			cargaContactanos(1);

		});
		cargaContactanos(1);

		

}

function cargaContactanos(pagina){


	$(".rows").remove();
	
	var oContactanos = new contactanos();
	oContactanos.id = $("#txtFolio").val();
	oContactanos.fechaInicio = $("#txtFechaInicio").val();
	oContactanos.fechaFin= $("#txtFechaFin").val();
	oContactanos.estatus = $("#cbEstatus").val();
	oContactanos.pagina = pagina;

	

		postrequest("contactanos/listar", oContactanos,function(data){

			$("#tblcontenido").html("");
			$("#tblpaginador").html("");

			if (data.totalresultados > -1) {
				$.each(data.resultados, function(i,item){
					var renglon = "<tr>";
					renglon += "<td>"+ item.id+"</td>";
					renglon += "<td>"+ item.nombre+"</td>";
					renglon += "<td>"+ item.correo+"</td>";	
					renglon += "<td>"+item.telefono+"</td>";
					renglon += "<td>"+item.mensaje+"</td>";
					renglon += "<td>"+item.fecha+"</td>";
					renglon += "<td id='estatus"+item.id+"'>"+ ((item.estatus== 0)?"NUEVA ":"ATENDIDA") +"</td>";
					renglon += "<td><div class='btn waves-effect light-blue lighten-1'   onclick='marcarLeido("+item.id+","+item.estatus+", this)'><i class='material-icons'>"+ ((item.estatus == 0) ? "done": "done_all")+"</i></div></td>";
					renglon +="</tr>";
					$("#tblcontenido").append(renglon);
				});
				var paginador = "Total de resultados [" + data.totalresultados+ "] &nbsp; &nbsp; Páginas: ";
				paginador += "<span onclick='cargaContactanos(1);'><i class='material-icons'>skip_previous</i></span>";

				for(i = 1; i <= data.paginas; i++){
					paginador +="<span onmouseover='cursor=pointer' onclick='cargaContactanos(" +i +");'>&nbsp;"+((i==data.pagina) ? "<b>": "") + i+ ((i==data.pagina) ? "</b>": "") +"&nbsp;</span>";

				}
				paginador += "<span onclick='cargaContactanos("+data.paginas+");'><i class='material-icons'>skip_next</i></span>";
				$("#tblpaginador").html(paginador);
				

			}

		});


}


function marcarLeido(id, estatus){
	
 
		postrequest("contactanos/leido", {"id":id, "estatus":estatus},function(data){
			if(data){
				
				if(estatus == 0){
					$(this).html("<i class='material-icons'>done_all</i></div>");
					$("#estatus"+id).html("ATENDIDA");

				}else{
					$(this).html("<i class='material-icons'>done</i></div>");
					$("#estatus"+id).html("NUEVA");
				}
			}else{
				Materialize.toast("Ocurrió un error al procesar la solicitud", 5000);
			}
		});
	
}



