function CargaFuncionesRegistroAuto(){
	$("#cbAnioAuto").html(CargaAnioAutos(0));
	CargaSelectEstados("#cbEstadoAuto");
	CargaSelectMunicipios("#cbCiudadAuto", $("#cbEstadoAuto").val());
	CargaSelectMarcas("#cbMarcaAuto", 0,1);
	CargaSelectModelos("#cbModeloAuto", "#cbMarcaAuto", 0, 1);
	CargaSelectTipoTransmision("#cbTipoTransmisionAuto", 0, 1);
 	CargaSelectFeatures("#cbFeaturesAutos","",1);
	$('#cbFeaturesAutos').multiselect();
	$("#cbCiudadAuto").append("<opcion value='0'>== Seleccione == </option>");
	$("#cbEstadoAuto").change(function() {
		CargaSelectMunicipios("#cbCiudadAuto", $("#cbEstadoAuto").val());
	});

	$("#cbMarcaAuto").change(function(){

		CargaSelectModelos("#cbModeloAuto", "#cbMarcaAuto", 0, 1);
	});

	

}

