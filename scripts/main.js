$(document).ready(function(){
	
  
	var urlvars = getUrlVars();
	
	if(urlvars["accion"] == undefined || urlvars["accion"] == "dashboard"){
		
		$(".mainBody").load("views/main/dashboard.html", function() {});
	}else{
 		
 		fnToLoad = urlvars["accion"];
  		
  		cargaHTML(".mainBody","views/main/admin/"+ urlvars["accion"] +".html", urlvars["accion"],function() {
     		
			if(urlvars["accion"] == "homeadmin")
			{

				CargaFuncionesAdminHome();
			}else{

      			CargaFunciones();
      		}
      	});
	}
$(document).ready(function() {

	var urlvars = getUrlVars();
	if (urlvars["accion"] != undefined) {

		$(".mainBody").load("views/interna2.html?id=" + urlvars["id"], function() {
		});
	} else {

		CargaContenidoMain();
	}

});

function CargaContenidoMain() {

	cargaHTML(".mainBody", "views/main.html", "", function() {

		
			
		postrequest("subastas/xusuario", {"idusuario":sessionStorage.claveApi },function(data){

			alert(data.length);

		});
  	});


	$("#searchBox").keypress(function(e) {
	    if(e.which == 13) {
	        $("#searchBody").html("");
	  		if(sessionStorage.getItem('publico') == 1){
	  			CargaDatosPrivado();
	  		}else{
	  			CargaDatosPublico();
	  		}

	    }
	});
	console.log("key:"+sessionStorage.getItem('publico'));

	if(sessionStorage.getItem('publico') == 1){
		CargaDatosPrivado();
	}else{
		CargaDatosPublico();
	}


};

		postrequest("subastas/xusuario", {
			"idusuario" : sessionStorage.claveapi
		}, function(data) {

			alert(data.length);

			// <div id="seccInfoSeguridad" class="divSeccion divSeguridad">
			// 	<h2>Infografías de Seguridad</h2>
			// 	<img class="infoSeguridad" src="images/infoSeguridad.png">
			// 	<img class="banner300x600" src="images/banner300x600.png">
			// </div>

		});
	});

	$("#searchBox").keypress(function(e) {
		if (e.which == 13) {
			$("#searchBody").html("");
			if (sessionStorage.getItem('publico') == 1) {
				CargaDatosPrivado();
			} else {
				CargaDatosPublico();
			}

		}
	});

	if (sessionStorage.getItem('publico') == 1) {
		CargaDatosPrivado();
	} else {
		CargaDatosPublico();
	}

}

function CargaDatosPublico() {
	postrequest("data/venta-autos.json", '', function(data) {

		$.each(data.vehiculos, function(i, item) {

			// if($("#searchBox").val()== "" || item.marca.toLowerCase().indexOf($("#searchBox").val().toLowerCase())>=0 || item.modelo.toLowerCase().indexOf($("#searchBox").val().toLowerCase())>=0){
			// 	$("#searchBody").append(regresaRenglonVenta(item))
			// }

		});
	});

}

function CargaDatosPrivado() {

	postrequest("data/subastas.json", '', function(data) {

		$.each(data["datos"], function(i, item) {

			if ($("#searchBox").val() == "" || item.empresa.toLowerCase().indexOf($("#searchBox").val().toLowerCase()) >= 0) {
				$("#searchBody").append(regresaRenglonSubasta(item))
			}

		});
	});

}

function VerSubasta(o) {
	CargaSubasta($(o).attr("attr-id"));

}

function regresaRenglonSubasta(item) {

	var renglon = '<div class="searchItem">';
	renglon += '			<div class="searchItemHead" attr-id="' + item.id + '" onclick="VerSubasta(this);"><h3>' + item.empresa + '</h3></div>';

	renglon += '		<div class="searchItemBody">';
	renglon += '			<div>';
	renglon += '				<h4>Subasta </h4>';
	renglon += '				<label>[' + item.estatus + ']</label>';
	renglon += '				</div>';
	renglon += '				<div>';
	renglon += '					<h4>Inicia:</h4>';
	renglon += '					<label>' + item.fechaInicio + '</label>';
	renglon += '				</div>';
	renglon += '				<div>';
	renglon += '					<h4>Finaliza:</h4>';
	renglon += '					<label>' + item.fechaFin + '</label>';
	renglon += '				</div>';
	renglon += '				<div>';
	renglon += '					<h4>Tipo de oferta:</h4>';
	renglon += '					<label>' + item.tipo + '</label>';
	renglon += '				</div>';
	renglon += '			</div>';
	renglon += '</div>';
	return renglon;

}

function CargaSubasta(subasta) {

	$(".mainBody").load("views/settings3.html", function() {

		cargaCatalogosEmpresas(subasta);

		$("#dp1").datepicker({
			showOn : "button",
			buttonImage : "images/time.svg",
			buttonImageOnly : false,
			buttonText : "Select date"
		});

		$("#dp2").datepicker({
			showOn : "button",
			buttonImage : "images/time.svg",
			buttonImageOnly : false,
			buttonText : "Select date"
		});
		$(".toggles").controlgroup({
			direction : "vertical"
		});

		cargaVehiculos();
		$('.dateTimeHeader').hide();

	});
}

function VerDetalleAuto(o) {
	$(".mainBody").load("views/interna2.html", function() {
	});
}

//***********************
//***********************
//Carga Subastas
//***********************
//***********************
function cargaCatalogosEmpresas(empresa) {

	$.ajax({
		dataType : "json",
		url : "data/settings.json",
		data : "data",
		success : function(data) {

			$.each(data["empresas"], function(i, item) {

				if (item.id == empresa) {
					$("#cmbEmpresa").append('<option value="' + item.id + '" selected="selected">' + item.empresa + '</option>');
				} else {
					$("#cmbEmpresa").append('<option value="' + item.id + '">' + item.empresa + '</option>');
				}

				var toogleItem = '<input class="empresaCB" type="checkbox" name="empresa' + i + '" id="empresa' + i + '">';
				toogleItem += '<label for="empresa' + i + '">' + item.empresa + '</label>';

				$(".toggles").append(toogleItem);
			});
		}
	});
}

function muestraGaleria(idx) {

	var dialog = $("#gallery" + idx).dialog({
		autoOpen : false,
		height : 200,
		width : 380,
		modal : true,
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

	$.ajax({
		dataType : "json",
		url : "data/vehiculos-subasta.json",
		data : "data",
		success : function(data) {
			var total = 0;

			$.each(data["vehiculos"], function(i, item) {
				var renglon = "<div>";
				renglon += '<div onclick="verDetalle(' + item.idVehiculo + ');"><input type="checkbox" attr="attr-idx' + item.idVehiculo + '"  /></div>';
				renglon += '<div><img alt="' + item.vehiculo + '" width="40px" src="' + item.foto + '" onclick="verDetalle(' + item.idVehiculo + ');"  /></div>';
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

function checkCB() {

	$('#chkMulti').change(function() {
		if ($(this).is(":checked")) {
			$('.toggles ').show();
		}
	});

	$('.closeMulti').on('click', function() {
		$('.toggles ').hide();
	});

	$('.toggles > input[type="checkbox"]:first-of-type').change(function() {
		if ($(this).is(":checked")) {
			$('.toggles').find('input[type="checkbox"]').addClass('cunts');
		}
	});
}

function verDetalle(idVehiculo) {

	$(".mainBody").load("views/interna2.html", function() {

	});

}
