$(document).ready(function () {
	debugger;
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

		$("#btnAgregarCorreo").click(function(){

			if($("#correoNoLog").val() != undefined && $("#correoNoLog")!=""){
				

				cargaMisCotizaciones($("#correoNoLog").val());

			}

		});

}

function cargaMisCotizaciones(obj){


	$(".rows").remove();
	
	var bAutoCotiza = new busquedaAuto();
	bAutoCotiza.descripcion = $("#txtFiltro").val();
	bAutoCotiza.fechaIni = $("#txtFechaInicio").val();
	bAutoCotiza.fechaFin= $("#txtFechaFin").val();
	bAutoCotiza.correoUsua = obj;


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
	if (validaDatosGuardar(mAuto)){
		postrequest("usuarioautomovil/guardar",mAuto,function(data){
	
				if (data) {
					alert(data);
						if (data.indexOf("eliminado") ==-1)
							$("#altaMisAutos").dialog("close");
			

					cargaMisVehiculos();

				}

		});
	}else{
		alert("Debe llenar todos los campos.");
	}
}

function validaDatosGuardar(objAuto){
	var valido = true;

	if (objAuto.idMarca == undefined || objAuto.idMarca ==0) {
		valido = false;
	}
	if (objAuto.idModelo == undefined || objAuto.idModelo ==0){

		valido = false;
	}
	if (objAuto.numPlaca == undefined || objAuto.numPlaca =="") {

		valido = false;
	}

	return valido;

}

function pintaDatosVerificacion(terminacionPlaca){
	
	var color ="";
	var periodo ="";
	var meses = "";
	var vericar = false;
	var items ="";
	if (terminacionPlaca == 6 || terminacionPlaca ==5){
		color ="Amarillo";
		periodo = "ENE - FEB  /   JUL - AGO";
		meses = "0,1,6,7";


	}else if(terminacionPlaca == 7 || terminacionPlaca == 8){
		color ="Rosa";
		periodo="FEB - MAR  /   AGO - SEP";
		meses = "1,2,7,8";

	}else if(terminacionPlaca ==9 || terminacionPlaca ==0)
	{
		color ="Azul";
		periodo="MAR - ABR  /   SEP - OCT";
		meses = "2,3,8,9";

	}else if(terminacionPlaca == 1 || terminacionPlaca == 2){
		color ="Verde";
		periodo="ABR - MAY  /   OCT - NOV";
		meses = "3,4,9,10";

	} else{
		color ="Rojo";
		periodo="MAY - JUN  /   NOV - DIC";
		meses = "4,5,10,11";

	}
	
	items = "<div id='" + color +"'>"+ color +"</div>";
	items +="<div>" + periodo + "</div>";
	items += "<div>";
	if( meses.split(",").indexOf((new Date).getMonth().toString()) !=-1){
		
		items += "Verificar";
	} else{
		items += "          ";
	}
	items += "</div>";

	return items;


}


