 var modelos;

function cargaVehiculos() {

	$.ajax({
		dataType : "json",
		url : "data/vehiculos-subasta.json",
		data : "data",
		success : function(data) {
			var total = 0;

			$.each(data["vehiculos"], function(i, item) {
				var renglon = "<div>";
				renglon += '<div><input type="checkbox" attr="attr-idx' + item.idVehiculo + '"  /></div>';
				renglon += '<div><img alt="' + item.vehiculo + '" width="40px" src="' + item.foto + '"  /></div>';
				renglon += "<div>";
				renglon += "<div>" + item.vehiculo + "</div>";
				renglon += "<div>" + item.descripcion + "</div>";
				renglon += "</div>";
				renglon += "<div>" + item.ubicacion + "</div>";
				renglon += "<div>" + item.kms + "</div>";
				renglon += "<div><img src='images/icoCamara.svg' width='40px' onclick='muestraGaleria(" + item.idVehiculo + ");' /></div>";
				renglon += "<div>" + item.salida + "</div>";
				renglon += "<div style='display:none;' id='gallery" + item.idVehiculo + "'>";
				$.each(item.imagenes, function(j, item2) {
					renglon += "<div class='galleryunselected'><img width='80px' src='fotos/" + item2 + "' onclick='seleccionaImagen(this);' /></div>"
				});
				renglon += "</div>";

				renglon += "</div>";

				$("#grdVehiculos").append(renglon);
			});

		}
	});
	checkCB();
};


function cargaCombos(){

	$.ajax({
			dataType : "json",
			url : "data/settings.json",
			data : "data",
			success : function(data) {
				cargaMarcas(data["marcas"]);
				modelos = data["modelos"];
				cargaEstados(data["estados"]);
				cargaVFUS(data["vfus"]);
				cargaModelos(0);
				cargacboCombustibles(data["combustibles"]);
				cargaUbicaciones(data["ubicaciones"]);
				cargaAnioDesde();
				cargaKMHasta();
				
			}
		});

}

function cargaMarcas(datos){

	$.each(datos, function(i, item) {
			$("#cboMarca").append('<option value="'+item.id+'">'+item.marca+'</option>')
	});
}

function cargaModelos(marcaID){
	

	$.each(modelos, function(i, item) {
		if(item.marcaid == marcaID){
			$("#cboModelo").append('<option value="'+item.id+'">'+item. modelo+'</option>');
		}
	});
}

function cargaEstados(datos){
	$.each(datos, function(i, item) {
			$("#cboEstado").append('<option value="'+item.id+'">'+item.estado+'</option>')
	});

}

function cargaVFUS(datos){

	$.each(datos, function(i, item) {
			$("#cboVFU").append('<option value="'+item.id+'">'+item.vfu+'</option>')
	});
}

function cargacboCombustibles(datos){

	$.each(datos, function(i, item) {
			$("#cboCombustible").append('<option value="'+item.id+'">'+item.combustible+'</option>')
	});
}

function cargaUbicaciones(datos){

	$.each(datos, function(i, item) {
			$("#cboUbicacion").append('<option value="'+item.id+'">'+item.ubicacion+'</option>')
	});
}

function cargaAnioDesde(){
	anioActual = (new Date()).getFullYear();
	anioActual++;
	for (anioActual; anioActual >= 1930; anioActual-- ){
		$("#cboAnioDesde").append('<option value="'+anioActual+'">'+anioActual+'</option>')

	}
}

function cargaKMHasta(){
	
	var km = 10000;
	for (km; km <  410000; ){
		$("#cboKMHasta").append('<option value="'+km+'">'+km+'</option>')
		km = km + 	10000;

	}
	

}

$(document).ready(function() {
	
	
	$(".mainBody").load("views/busqueda.html", function() {
	
		$("#cboMarca").change(function(){
			cargaModelos($("#cboMarca").val());
		})
		cargaCombos();
		

	});
	
});
