

function cargaFuncionesMisCotizaciones(){

		$("#miscotizaciones").load("views/MisCotizaciones.html", function() {
			
			
			$("#txtFechaInicio").datepicker();
			$("#txtFechaFin").datepicker();
			if(sessionStorage.getItem('correo') != undefined){
				$("#nolog").hide();
				cargaMisCotizaciones(sessionStorage.getItem('correo'));
			}

			$("#btnFiltrar").click(function(){
				debugger;

					cargaMisCotizaciones(sessionStorage.getItem('correo'));

			});

			$("#detalleCotizaciones").modal({
				dismissible : true, // Modal can be dismissed by clicking outside of the modal
				opacity : .5, // Opacity of modal background
				inDuration : 300, // Transition in duration
				outDuration : 200, // Transition out duration
			});
			
		});

		

}

function cargaMisCotizaciones(obj){


	$(".rows").remove();
	
	var bAutoCotiza = new busquedaAuto();
	bAutoCotiza.descripcion = $("#txtFiltro").val();
	bAutoCotiza.fechaIni = $("#txtFechaInicio").val();
	bAutoCotiza.fechaFin= $("#txtFechaFin").val();
	bAutoCotiza.correoUsua = obj;
	bAutoCotiza.esAdmin = sessionStorage.getItem('es_admin');

		postrequest("cotizacion/listar",bAutoCotiza,function(data){

			if (data) {

				$.each(data,function(i,item){

					var renglon = "<tr>";
					renglon += "<td>"+ item.Nombre+"</td>";
					renglon += "<td>"+item.Correo+"</td>";
					renglon += "<td>"+item.Marca+"</td>";
					renglon += "<td>"+item.Modelo+"</td>";
					renglon += "<td>"+item.Tipo+"</td>";
					renglon += "<td><div class='btn waves-effect light-blue lighten-1'  cotizacion='"+item.idCotizacion+"' onclick='muestraDetalle(this)'><i class='material-icons'>assignment</i></div></td>";
					renglon +="</tr>";

					$("#grdMisCotizaciones").append(renglon);

				});

			}

		});


}


function muestraDetalle(obj){
	$("#detalleCotizaciones").modal("open");
	debugger;
	var mAuto = new miAuto();

	mAuto.correoUsua = sessionStorage.getItem('correo');
	
	mAuto.idMarca = $("#cbMarcaAuto").val();
	mAuto.idModelo = $("#cbModeloAuto").val();
	mAuto.numPlaca = $("#numdePlaca").val();
	mAuto.estatus = 1;
	if($(obj).attr("marca") != undefined){

		mAuto.idMarca = $(obj).attr("marca");
		mAuto.idModelo = $(obj).attr("modelo");
		mAuto.numPlaca = $(obj).attr("placa");
		mAuto.estatus = 0;


	
		postrequest("cotizacion/detalle",{},function(data){
	
				if (data) {
					alert(data);
						if (data.indexOf("eliminado") ==-1)
							$("#altaMisAutos").dialog("close");
			

					cargaMisVehiculos();

				}

		});
	}
	
}



