function cargaCatalogos(idDef) {

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

	var dialog = $("#gallery" + idx).dialog({
		autoOpen : false,
		height : 400,
		width : '60%',
		modal : true,
		resizable: false,
		dialogClass : 'no-titlebar'
	});

	$("#gallery" + idx).addClass('muestraGaleria');

	dialog.dialog("open");
}

function seleccionaImagen(obj) {
	if ($($(obj).parent()).attr("class") == "galleryunselected") {
		$($(obj).parent()).attr("class", "galleryselected");
	} else {

		$($(obj).parent()).attr("class", "galleryunselected");
	}
}

function cargaVehiculos() {
	cargaCatalogos(-1);
	$(".toggles").controlgroup({
		direction : "vertical"
	});

	$(".rows").remove();

	$.ajax({
		dataType : "json",
		url : "data/venta-autos.json",
		data : "data",
		success : function(data) {
			var total = 0;

			$.each(data["vehiculos"], function(i, item) {
				// if (FiltrarAutos(item)) {
					var renglon = "<div value class='rows'>";
					renglon += '<div><img alt="' + item.vehiculo + '" src="' + item.foto + '"  /></div>';
					renglon += "<div>" + item.descripcion + "</div>";					renglon += "<div>" + item.estado + "</div>";
					renglon += "<div>" + item.kms + "</div>";
					renglon += "<div><img src='images/icoCamara.svg' onclick='muestraGaleria(" + item.idVehiculo + ");' /></div>";
					renglon += "<div>" + item.precio + "</div>";
					renglon += "<div><button>AGREGAR</button></div>";
					renglon += "<div style='display:none;' id='gallery" + item.idVehiculo + "'>";
					$.each(item.imagenes, function(j, item2) {
						renglon += "<div class='galleryunselected'><img src='fotos/" + item2 + "' onclick='seleccionaImagen(this);' onerror='images/missingImage.jpg' /></div>"
					});
					renglon += "</div>";

					renglon += "</div>";
					
					$("#grdVehiculos").append(renglon);

				//º }
					
			});

		}
	});

};

function FiltrarAutos(item) {
	 var precioMax = $('#cmbPrecio option:selected').attr('max');
	 var precioMin = $('#cmbPrecio option:selected').attr('min');
 
	 var kmMax = $('#cmbKilometros option:selected').attr('max');
	 var kmMin = $('#cmbKilometros option:selected').attr('min');
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
		cargaVehiculos();
		
		$('.dateTimeHeader').hide();
	
	});
});
