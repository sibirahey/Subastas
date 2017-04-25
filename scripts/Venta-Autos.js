function cargaCatalogos(idDef) {
	debugger;
	CargaSelectEstados("#cmbEstados");
	//CargaSelectMunicipios("#cbCiudadAuto", $("#cbEstadoAuto").val());
	CargaSelectMarcas("#cmbMarcas", 0,1);
	CargaSelectModelos("#cmbModelos", "#cmbMarcas", 0, 1);
	//CargaSelectTipoTransmision("#cbTipoTransmisionAuto", 0, 1);
 	//CargaSelectFeatures("#cbFeaturesAutos","",1);
 	$("#cmbAnio").html(CargaAnioAutos(0));
	$("#cmbMarcas").change(function(){
		CargaSelectModelos("#cmbModelos", "#cmbMarcas", 0, 1);
	});
}

function muestraGaleria(idx) {
	debugger;
	
	var dialog = $("#gallery" + idx).dialog({
		autoOpen : false,
		height : 400,
		width : '60%',
		modal : true,
		resizable: false,
		dialogClass : 'no-titlebar'
	});

	$("#gallery" + idx).addClass('muestraGaleria');

	//dialog.dialog("open");
}

function seleccionaImagen(obj) {
	if ($($(obj).parent()).attr("class") == "galleryunselected") {
		$($(obj).parent()).attr("class", "galleryselected");
	} else {

		$($(obj).parent()).attr("class", "galleryunselected");
	}
}

function buscarAutos(){

debugger;
	$(".rows").remove();

	busAutos = new busquedaAuto();
	busAutos.descripcion = $("#desc").val();
	busAutos.precioIni = ($("#txtPrecioIni").val() == undefined || $("#txtPrecioIni").val() == "" ) ? "0" : $("#txtPrecioIni").val();
	busAutos.precioFin = ($("#txtPrecioFin").val() ==undefined || $("#txtPrecioFin").val() == "" ) ? "0":$("#txtPrecioFin").val();
	busAutos.kmIni = ($("#txtKmIni").val() == undefined || $("#txtKmIni").val() == "") ? "0": $("#txtKmIni").val();
	busAutos.kmFin = ($("#txtKmFin").val() ==undefined || $("#txtKmFin").val() == "") ? "0":$("#txtKmFin").val();
	busAutos.estadoId = ($("#cmbEstados option:selected").val() == undefined) ? "0" : $("#cmbEstados option:selected").val();
	busAutos.marcaId = ($("#cmbMarcas option:selected").val() == undefined) ? "0" : $("#cmbMarcas option:selected").val();
	busAutos.modeloId = ($("#cmbModelos option:selected").val() == undefined) ? "0" : $("#cmbModelos option:selected").val();
	busAutos.anio = ($("#cmbAnio option:selected").val() == undefined) ? "0" : $("#cmbAnio option:selected").val();



	postrequest("autos/busqueda",busAutos,function(data){
		debugger;
		var total = 0;

		if (data){
			$.each(data, function(i, item) {
				
					var renglon = "<div value class='rows'>";
					renglon += '<div><img alt="' + item.idAuto + '" src="' + item.foto + '" onerror=\'imgError(this)\'; /></div>';
					renglon += "<div>" + item.descripcion + "</div>";					renglon += "<div>" + item.estado + "</div>";
					renglon += "<div>" + item.km + "</div>";
					//renglon += "<div><button class='btn waves-effect light-blue lighten-1'  onclick='muestraGaleria(" + item.idVehiculo + ");'><i class='material-icons'>photo_camera</i></button></div>";
					renglon += "<div><button class='btn waves-effect waves-light light-blue lighten-1'  data-target='gallery"+ item.idVehiculo +"'><i class='material-icons'>photo_camera</i></button></div>";
					renglon += "<div>" + item.precio + "</div>";
					renglon += "<div class='center-btn'><button class='btn waves-effect waves-light light-blue lighten-1'><i class='material-icons'>add</i></button></div>";
					//renglon += "<div style='display:none;' id='gallery" + item.idVehiculo + "'>";
					renglon += "<div id='gallery"+ item.idAuto +"'  class='modal modal-fixed-footer'>";
				    renglon += "	<div class='modal-content'>";
			        renglon += "	<h4>Modal Header</h4>";
			        if(item.fotos != undefined){
						$.each(item.fotos.split("|"), function(j, item2) {
							renglon += "<div class='galleryunselected'><img src='fotos/" + item2 + "' onclick='seleccionaImagen(this);' onerror='imgError(this)';/></div>"
						});

					}
					renglon += "	</div>";
					renglon += " </div>";
					renglon += "</div>";
					renglon += "</div>";
					
					$("#grdVehiculos").append(renglon);
					$('.modal').modal();

			});

		}

	});

}


function cargaVehiculos() {
	cargaCatalogos(-1);
	$(".toggles").controlgroup({
		direction : "vertical"
	});
	SoloNumericos("[name='txtKmIni']");
		SoloNumericos("#txtKmFin");

		SoloNumericos("#txtPrecioIni");

		SoloNumericos("#txtPrecioFin");
	buscarAutos();


};

function imgError(image) {
    image.onerror = "";
    $(image).attr('src','images/imagenNoDisponible.svg');
    return true;
}

function FiltrarAutos(item) {
	 var precioMax = $('#cmbPrecio').attr('max');
	 var precioMin = $('#cmbPrecio').attr('min');
 
	 var kmMax = $('#cmbKilometros').attr('max');
	 var kmMin = $('#cmbKilometros').attr('min');
	 var valida = true;
	if ($('#cmbPrecio').val() != -1) {
		if (((precioMin < item.precioint && item.precioint < precioMax) || (precioMax == 0 && precioMin > 0 && item.precioint > precioMin))) {

			valida = true;

		} else {

			valida = false;
		}

	}

	if ($('#cmbKilometros').val() != -1) {

		if ((kmMin < item.kmsint && item.kmsint < kmMax) || (kmMax == 0 && kmMin > 0 && item.kmsint > kmMin)) {

			valida = true;

		} else {
			return false;

		}
	}

	if ($('#cmbEstados').val() != -1) {
		if ($('#cmbEstados').val() == item.estadocve) {
			valida = true;
		} else {
			return false;
		}

	}

	if ($('#cmbModelos').val() != -1) {
		if ($('#cmbModelos').val() == item.modelocve) {

			valida = true;
		} else {
			return false;
		}
	}

	if ($('#cmbMarcas').val() != -1) {

		if ($('#cmbMarcas').val() == item.marcacve) {
			valida = true;
		} else {
			return false;
		}
	}

	if ($('#cmbAnio').val() != -1) {

		if ($('#cmbAnio').val() == item.anio) {
			valida = true;
		} else {
			return false;
		}
	}
	return valida;

}
	
$(document).ready(function() {
	$(".mainBody").load("views/main/admin/ventaautos.html", function() {
		cargaCatalogos(-1);
		
		

		$(".toggles").controlgroup({
			direction : "vertical"
		});
		//cargaVehiculos();
		
		$('.dateTimeHeader').hide();
	
	});
	
});
