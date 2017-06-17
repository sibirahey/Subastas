$(document).ready(function(){

	
	ValidaSession();
	var urlvars = getUrlVars();
	
	var accion = "";
	if(urlvars["accion"]){
		accion = urlvars["accion"].replace("#!","");
	}
	

	if(accion == undefined || accion == "dashboard" || accion == ""){
		
		$(".mainBody").load("views/main/dashboard.html", function() {
			CargaFunciones("dashboard");

		});
	}else{
 		
 		cargaHTML(".mainBody","views/main/admin/"+ accion +".html", accion,function() {
			
   				CargaFunciones(accion);
   			
      	});
	}
	
  });

function CargaFunciones(o){
	
	switch(o){
		case "altaautos":
			CargaFuncionesRegistroAuto();
			break;
		case "subastasadmin":
			CargaFuncionesAdminSubastas();
			break;
		case "homeadmin":
			CargaFuncionesAdminHome();
			break;
		case "ventaautos":
			InicializaVentaAutos();
			cargaVehiculos();
			break;
		case "subasta":
			CargaInfoSubasta();
			break;
		case "MisAutos":
			cargaFuncionesMisAutos();
			break;	
		case "resultados":
			cargaResultadosSubastas();
			break;
		case "dashboard":
		default:
			CargaJsonHome();
			CargaContenidoMain();
			break;

	}
    CargaMaterial ();

	
}

function CargaMaterial (){

	$(".toggles").controlgroup({
			direction : "vertical"
		});
		
		$('.dateTimeHeader').hide();
		$('select').material_select();

}


function CargaContenidoMain() {

	
//	$(".divMisSubastas").hide();


	
	$.get("views/main/missubastas.html?rand="+Math.floor((Math.random() * 10000000) + 1), function(data){
	debugger;
			var misubastahtml = data;
			postrequest("subastas/xusuario", {"idusuario":sessionStorage.claveapi },function(response){
				//console.log(JSON.stringify(response));
				//console.log(JSON.stringify(data.length));
				if(data.length > 0 )
					 $(".divMisSubastas").hide().show();
		
				for(var o in response){

					
					if(response[o].visible == 1){
						subasta = misubastahtml;
						console.log(subasta);	
						subasta = subasta.replace("#NOMBRESUBASTA#", response[o].nombreSubasta); 
						subasta = subasta.replace("#OFERTAMINIMA#", Number(response[o].incremento).formatMoney()); 
						subasta = subasta.replace("#TIPOSUBASTAS#", response[o].tipoSubasta); 
						subasta = subasta.replace("#ESTATUSSUBASTA#", response[o].estatus); 
						subasta = subasta.replace("#SUBASTAID#", response[o].idSubasta); 
						subasta = subasta.replace("#FECHA_SUBASTA#", new Date(response[o].fechaFin).toLocaleDateString());

						subasta = subasta.replace("#TIPOSUBASTA#", response[o].tipoSubasta);  
						$("#ulMisSubastas").append(subasta);		
					}
				}

				

			});
	});
	



};


function CargaDatosPublico(){
	postrequest("data/venta-autos.json", '', function(data){
				
			$.each(data.vehiculos,function(i,item){
				
				
				// if($("#searchBox").val()== "" || item.marca.toLowerCase().indexOf($("#searchBox").val().toLowerCase())>=0 || item.modelo.toLowerCase().indexOf($("#searchBox").val().toLowerCase())>=0){
				// 	$("#searchBody").append(regresaRenglonVenta(item))
				// }



			});
	});

}

function CargaDatosPrivado(){
	
	postrequest("data/subastas.json", '', function(data){
			
			$.each(data["datos"],function(i,item){
				
				
				if($("#searchBox").val()== "" || item.empresa.toLowerCase().indexOf($("#searchBox").val().toLowerCase())>=0){
					$("#searchBody").append(regresaRenglonSubasta(item))
				}



			});
	});

	
}
function VerSubasta(o){
	CargaSubasta($(o).attr("attr-id"));


}


function regresaRenglonSubasta(item){

	var renglon = '<div class="searchItem">';
	renglon += '			<div class="searchItemHead" attr-id="'+item.id+'" onclick="VerSubasta(this);"><h3>'+item.empresa+'</h3></div>';

	renglon += '		<div class="searchItemBody">';
	renglon += '			<div>';
	renglon += '				<h4>Subasta </h4>';
	renglon += '				<label>['+item.estatus+']</label>';
	renglon += '				</div>';
	renglon += '				<div>';
	renglon += '					<h4>Inicia:</h4>';
	renglon += '					<label>'+item.fechaInicio+'</label>';
	renglon += '				</div>';
	renglon += '				<div>';
	renglon += '					<h4>Finaliza:</h4>';
	renglon += '					<label>'+item.fechaFin+'</label>';
	renglon += '				</div>';
	renglon += '				<div>';
	renglon += '					<h4>Tipo de oferta:</h4>';
	renglon += '					<label>'+item.tipo+'</label>';
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

// function VerDetalleAuto(o) {
// 	$(".mainBody").load("views/interna2.html", function() {
// 	});
	
// }

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

	// var dialog = $("#gallery" + idx).dialog({
		// autoOpen : false,
		// height : 200,
		// width : 380,
		// modal : true,
		// dialogClass : 'no-titlebar'
	// });
// 
	// $("#gallery" + idx).addClass('muestraGaleria');
// 
	// dialog.dialog("open");
	
	var dialog = $("#gallery" + idx).modal({
		dismissible : true, // Modal can be dismissed by clicking outside of the modal
		opacity : .5, // Opacity of modal background
		inDuration : 300, // Transition in duration
		outDuration : 200, // Transition out duration
	}); 
	
	$("#gallery" + idx).addClass('muestraGaleria');
	
	dialog.modal("open");

}

function seleccionaImagen(obj) {
	if ($($(obj).parent()).attr("class") == "galleryunselected") {
		$($(obj).parent()).attr("class", "galleryselected");
	} else {

		$($(obj).parent()).attr("class", "galleryunselected");
	}
}


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
