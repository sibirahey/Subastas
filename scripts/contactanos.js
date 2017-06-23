
function cargaFuncionesMisContactos(){

		$("select").material_select();
		//$("#miscontactos").load("views/MisCotizaciones.html?rand="+Math.random(), function() {
			
			
		$("#txtFechaInicio").datepicker();
		$("#txtFechaFin").datepicker();

		$("#btnFiltrar").click(function(){
			cargaContactanos();

		});
		cargaContactanos(1);

		

}

function cargaContactanos(pagina){


	$(".rows").remove();
	
	var oContactanos = new contactanos();
	oContactanos.id = $("#txtFiltro").val();
	oContactanos.fechaInicio = $("#txtFechaInicio").val();
	oContactanos.fechaFin= $("#txtFechaFin").val();
	oContactanos.estatus = $("#cbEstatus").val();
	oContactanos.pagina = pagina;

	

		postrequest("contactanos/listar", oContactanos,function(data){

			$("#tblcontenido").html("");

			if (data.totalresultados > -1) {
				$.each(data.resultados, function(i,item){
					var renglon = "<tr>";
					renglon += "<td>"+ item.id+"</td>";
					renglon += "<td>"+ item.nombre+"</td>";
					renglon += "<td>"+ item.correo+"</td>";	
					renglon += "<td>"+item.telefono+"</td>";
					renglon += "<td>"+item.mensaje+"</td>";
					renglon += "<td>"+item.fecha+"</td>";
					renglon += "<td>"+ ((item.estatus== 0)?"NUEVO":"ATENDIDA") +"</td>";
					renglon += "<td><div class='btn waves-effect light-blue lighten-1'  attr-id='"+item.id+"' onclick='marcarLeido("+item.id+","+item.estatus+")'><i class='material-icons'>done</i></div></td>";
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


function muestraDetalle(obj){
	
 	var idCotizacion = $(obj).attr("cotizacion");
 	var oCotizacion = 1;
	for(i in cotizacionesTemp){
		debugger;
		if(cotizacionesTemp[i].idCotizacion ==idCotizacion){

			oCotizacion = cotizacionesTemp[i];
			break;
		}

	}


	$("#idCotizacion").val(idCotizacion );

	$("#marcaModeloTipo").val(oCotizacion["Marca"] + " "+ oCotizacion["Modelo"] + " - " + oCotizacion["Tipo"]);

	$("#fechaCotizacion").html(oCotizacion["fecha"] + " ["+ ((oCotizacion["Estatus"] == 1)? "PENDIENTE" : "ATENDIDA" ) +"] ");
	$("#cotizacionNombre").val(oCotizacion["Nombre"]);
	$("#cotizacionCorreo").val(oCotizacion["Correo"]);
	$("#cotizaDetalle").val(oCotizacion["subservicios"]);
	$("#cotizaComentario").val(oCotizacion["comentario"]);
	$("#cotizacionTelefono").val(oCotizacion["Telefono"])
	Materialize.updateTextFields();
  	$('.materialize-textarea').trigger('autoresize');
	$("#detalleCotizaciones").modal("open");
	


	// debugger;
	// var mAuto = new miAuto();

	// mAuto.correoUsua = sessionStorage.getItem('correo');
	
	// mAuto.idMarca = $("#cbMarcaAuto").val();
	// mAuto.idModelo = $("#cbModeloAuto").val();
	// mAuto.numPlaca = $("#numdePlaca").val();
	// mAuto.estatus = 1;
	// if($(obj).attr("marca") != undefined){

	// 	mAuto.idMarca = $(obj).attr("marca");
	// 	mAuto.idModelo = $(obj).attr("modelo");
	// 	mAuto.numPlaca = $(obj).attr("placa");
	// 	mAuto.estatus = 0;


	
	// 	postrequest("cotizacion/detalle",{},function(data){
	
	// 			if (data) {
	// 				alert(data);
	// 					if (data.indexOf("eliminado") ==-1)
	// 						$("#altaMisAutos").dialog("close");
			

	// 				cargaMisVehiculos();

	// 			}

	// 	});
	// }
	
}



