$(document).ready(function () {

	$(".mainBody").load("views/MisCotizaciones.html", function() {
		cargaFuncionesMisCotizaciones();	
		
		
	});
});

function cargaFuncionesMisCotizaciones(){

		$("#detalleCotizaciones").hide();
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

					var renglon = "<div class='rows'>";
					renglon += "<div>"+ item.Nombre+"</div>";
					renglon += "<div>"+item.Correo+"</div>";
					renglon += "<div>"+item.Marca+"</div>";
					renglon += "<div>"+item.Modelo+"</div>";
					renglon += "<div>"+item.Tipo+"</div>";
					renglon += "<div><button cotizacion='"+item.idCotizacion+"' onclick='muestraDetalle(this)'>Ver</bitton></div>";

					renglon +="</div>";

					$("#grdMisVehiculos").append(renglon);

				});

			}

		});


}


function muestraDetalle(obj){
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


	}
		postrequest("cotizacion/detalle",{},function(data){
	
				if (data) {
					alert(data);
						if (data.indexOf("eliminado") ==-1)
							$("#altaMisAutos").dialog("close");
			

					cargaMisVehiculos();

				}

		});
	
}



