
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

debugger;
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
				//var paginador = "<label class='col s2 offset-s2'>Total de resultados</label><label class='col s1'> " + data.totalresultados+ "</label>";
				var paginador = "<span class='new badge col s2 offset-s2' data-badge-caption='Total de resultados'>(" + data.totalresultados+ ")</span>"
				//paginador += "<span onclick='cargaContactanos(1);'><i class='material-icons'>skip_previous</i></span>";
				paginador += "<ul class='pagination col s6'>"
				paginador += "<li class='disabled'><a href='#!'><i class='material-icons'>chevron_left</i></a></li>";

				for(i = 1; i <= data.paginas; i++){
					
					//paginador +="<span onmouseover='cursor=pointer' onclick='cargaContactanos(" +i +");'>&nbsp;"+((i==data.pagina) ? "<b>": "") + i+ ((i==data.pagina) ? "</b>": "") +"&nbsp;</span>";
					paginador += "<li class='waves-effect'><a onclick='cargaContactanos("+ i +");' href='#!'>"+((i==data.pagina) ? "<b>": "") + i+ ((i==data.pagina) ? "</b>": "") +"</a></li>"

				}
				//paginador += "<span onclick='cargaContactanos("+data.paginas+");'><i class='material-icons'>skip_next</i></span>";
				paginador += "<li class='waves-effect'><a href='#!' onclick='cargaContactanos("+data.paginas+");'><i class='material-icons'>chevron_right</i></a></li>";
				paginador += "</ul>"
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



