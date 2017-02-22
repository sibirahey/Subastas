function cargaCatalogos(idDef) {

	$.ajax({
		dataType : "json",
		url : "data/settings.json",
		data : "data",
		success : function(data) {

			$.each(data["marcas"], function(i, item) {

				if (item.id == idDef) {
					$("#cmbMarcas").append('<option value="' + item.id + '" selected="selected">' + item.marca + '</option>');
				} else {
					$("#cmbMarcas").append('<option value="' + item.id + '">' + item.marca + '</option>');
				}
				
				var toogleItem = '<input class="marcaCB" type="checkbox" name="marca' + i + '" id="marca' + i + '">';
				toogleItem += '<label for="marca' + i + '">' + item.marca + '</label>';
				
				$(".toggles").append(toogleItem);
			});
			$.each(data["modelos"],function(i,item){

				if (item.id == idDef) {
					$("#cmbModelos").append('<option value="' + item.id +'" selected="selected">' + item.modelo + '</option>');
				}else{
					$("#cmbModelos").append('<option value="'+ item.id + '">' + item.modelo +'</option>');
				}

				var toogleItem = '<input class="marcaCB" type="checkbox" name="modelo'+ i +'" id="modelo' + i +'">';
				toogleItem +='<label for="modelo' + i + '">' + item.modelo + '</label>';
				$(".toggles").append(toogleItem);

			});

			$.each(data["estados"],function(i,item){

				if (item.id == idDef) {
					$("#cmbEstados").append('<option value="' + item.id +'" selected="selected">' + item.estado + '</option>');
				}else{
					$("#cmbEstados").append('<option value="'+ item.id + '">' + item.estado +'</option>');
				}

				var toogleItem = '<input class="marcaCB" type="checkbox" name="estado'+ i +'" id="estado' + i +'">';
				toogleItem +='<label for="estado' + i + '">' + item.estado + '</label>';

				$(".toggles").append(toogleItem);

			});

			$.each(data["precios"],function(i,item){

				if (item.id == idDef) {
					$("#cmbPrecio").append('<option value="' + item.id +'" selected="selected' + '" min="'+ item.min +'" max="'+ item.max +'">' + item.precio + '</option>');
				}else{
					$("#cmbPrecio").append('<option value="'+ item.id + '" min="'+ item.min +'" max="'+ item.max +'">' + item.precio +'</option>');
				}

				var toogleItem = '<input class="marcaCB" type="checkbox" name="precio'+ i +'" id="precio' + i +'">';
				toogleItem +='<label for="precio' + i + '">' + item.precio + '</label>';

				$(".toggles").append(toogleItem);

			});

			$.each(data["kilometros"],function(i,item){

				if (item.id == idDef) {
					$("#cmbKilometros").append('<option value="' + item.id +'" selected="selected' + '" min="'+ item.minKM +'" max="'+ item.maxKM +'">' + item.km + '</option>');
				}else{
					$("#cmbKilometros").append('<option value="'+ item.id + '" min="'+ item.minKM +'" max="'+ item.maxKM +'">' + item.km +'</option>');
				}

				var toogleItem = '<input class="marcaCB" type="checkbox" name="kilometro'+ i +'" id="kilometro' + i +'">';
				toogleItem +='<label for="kilometro' + i + '">' + item.km + '</label>';

				$(".toggles").append(toogleItem);

			});
			
		}
	});
	debugger
	var end = 1950;
	var  start = new Date().getFullYear();
	var options = "";
	$("#cmbAnio").append('<option value ="-1">==TODOS==</option>');
	for(var year = start ; year >=end; year--){
  		$("#cmbAnio").append('<option value ="'+ year +'">'+ year +'</option>');
	}
	



}

function muestraGaleria(idx) {

	var dialog = $("#gallery" + idx).dialog({
		autoOpen : false,
		height : 200,
		width : 380,
		modal : true,
		dialogClass: 'no-titlebar'
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
	$(".rows").remove();

	$.ajax({
		dataType : "json",
		url : "data/venta-autos.json",
		data : "data",
		success : function(data) {
			var total = 0;

			$.each(data["vehiculos"], function(i, item) {

				if (FiltrarAutos(item)) {
				var renglon = "<div value class='rows'>";
				renglon += '<div><img alt="' + item.vehiculo + '" width="40px" src="' + item.foto + '"  /></div>';
				
				renglon += "<div>" + item.descripcion + "</div>";
				
				renglon += "<div>" + item.estado + "</div>";
				renglon += "<div>" + item.kms + "</div>";
				renglon += "<div><img src='images/icoCamara.svg' width='40px' onclick='muestraGaleria(" + item.idVehiculo + ");' /></div>";
				renglon += "<div>" + item.precio + "</div>";
				renglon += "<div><button>AGREGAR</button></div>";
				renglon += "<div style='display:none;' id='gallery" + item.idVehiculo + "'>";
				$.each(item.imagenes, function(j, item2) {
					renglon += "<div class='galleryunselected'><img width='80px' src='fotos/" + item2 + "' onclick='seleccionaImagen(this);' /></div>"
				});
				renglon += "</div>";

				renglon += "</div>";

				$("#grdVehiculos").append(renglon);

				}
			});

		}
	});
	
};

function FiltrarAutos(item){
	debugger
	var precioMax = $('#cmbPrecio option:selected').attr('max');
	var precioMin = $('#cmbPrecio option:selected').attr('min');

	var kmMax = $('#cmbKilometros option:selected').attr('max');
	var kmMin = $('#cmbKilometros option:selected').attr('min');
	var valida = true;
 	if ( $('#cmbPrecio').val() != -1){
 		if (((precioMin <item.precioint && item.precioint < precioMax)|| (precioMax ==0 && precioMin >0 && item.precioint>precioMin)) ){

 			valida =true;

 		}else{

 			valida = false;
 		}

 	}
 	

 	if ( $('#cmbKilometros').val() != -1) {

 		if((kmMin < item.kmsint && item.kmsint < kmMax)|| (kmMax ==0 && kmMin >0 && item.kmsint>kmMin) ){

 			valida = true;

 		}else{
 			return false;
 		
 		}
 	}

 	if ($('#cmbEstados').val() !=-1 ){
 		if ($('#cmbEstados').val() == item.estadocve){
 			valida = true;
 		}else{
 			return  false;
 		}

 	}

 	if($('#cmbModelos').val() !=-1){
 		if($('#cmbModelos').val() == item.modelocve){

 			valida = true;
 		}else{
 			return  false;
 		}
 	}

 	if($('#cmbMarcas').val() !=-1){

 		if ($('#cmbMarcas').val() == item.marcacve) {
 			valida = true;
 		}else{
 			return false;
 		}
 	}

if($('#cmbAnio').val() !=-1){

 		if ($('#cmbAnio').val() == item.anio) {
 			valida = true;
 		}else{
 			return false;
 		}
 	}
	return valida;

}

$(document).ready(function() {
	$(".mainBody").load("views/Venta-Autos.html", function() {
	
		cargaCatalogos(-1);
		
		

		$(".toggles").controlgroup({
			direction : "vertical"
		});

		

		cargaVehiculos();
		$('.dateTimeHeader').hide();

	});
	
});
