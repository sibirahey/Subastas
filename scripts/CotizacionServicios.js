function cargaServicios(idServicio) {

	$.ajax({
		dataType : "json",
		url : "data/Servicios.json",
		data : "data",
		success : function(data) {

			$.each(data["Servicio"], function(i, item) {
//$("#lstServicios").append('<li class:"submenuitem" id ="'+item.idServicio+'">'+item.Nombre+'</li>');
					$("#divLstServicios").append('<div><div class:"submenuitem" id ="'+item.idServicio+'" onClick="cargaServiciosCotizar(this)">'+item.Nombre+'</div></div>');
			
				
				
			});
		}
	});
	

}


function cargaServiciosCotizar(O) {
	$(".rows").remove();
	var idServicio = $(O).attr('id');
	$.ajax({
		dataType : "json",
		url : "data/Servicios.json",
		data : "data",
		success : function(data) {

			$.each(data["Servicio"], function(i, item) {

				if (idServicio>0){
					
					if (item.idServicio == idServicio){

						$.each(item["Servicios"],function(j,subitem){

							//$("#DetalleServicio").append('<li class:"servicioRow" id ="'+subitem.idServicios+'">'+item.nombreServicios+'</li>');
							var Renglon = '<div class="rows">';
							Renglon+= '<div class:"servicioRow" id ="'+subitem.idServicios+'">'+subitem.nombreServicios+'</div>';
							Renglon+= '<button id="btnAgregarS" idServicios="'+subitem.idServicios+'" idServicio="'+item.idServicio+'" onClick="AgregarServicio(this);">Cotizar</button>';
							Renglon+='</div>';

							$("#divDetalleServicios").append(Renglon);

						});

					}

				}
			});
		}
	});
	

}





function AgregarServicio(obj) {

	var servicio = $(obj).attr('idServicio');
	var servicios= $(obj).attr('idServicios');
	var sc = sessionStorage.getItem('serviciosCotizar');
	var serviciosCotizar=[];

	if(sc != undefined){

	 serviciosCotizar= JSON.parse(sc);


	}
	
	serviciosCotizar.push({servicio:servicio,servicios:servicios });

	sessionStorage.setItem('serviciosCotizar',JSON.stringify(serviciosCotizar));

	if (serviciosCotizar.length !=0){

		$('#divCotizacion').show();

	}


}

function enviarCotizacion(){

	var nombre =$("input[name=cotizaNombre]").val(); 
	var correo =$("input[name=cotizaCorreo]").val()
	var telefono= $("input[name=cotizaTelefono]").val();
	var marca = $("input[name=cotizaMarca]").val();
	var modelo =$("input[name=cotizaModelo]").val();
	var tipo = $("input[name=cotizaTipo]").val();

	if(nombre != "" && correo != "" && telefono != "" && marca != ""
		&& modelo != "" && tipo != "" && nombre != undefined && correo != undefined && telefono != undefined && marca != undefined
		&& modelo != undefined && tipo != undefined ){

		var datos ={"nombre":"Sergio Angel Meza Cervantes","correo":"serch_scm@hotmail.com","telefono":"555555555555","marca":"NISSAN","modelo":"SENTRA","tipo":"SEDAN"};
		 postrequest("Cotizacion/registro", datos, function(data){
        debugger;
      for (cat in data){
        
        $('#divCotizacion').hidden();

       }

    },errorinserta);


	}else{

		alert("Debe Llenar todos los campos");

	}

}
function errorinserta(e){
	debugger;
	alert(e);
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

$(document).ready(function() {
	$(".mainBody").load("views/CotizacionServicios.html", function() {
	
		cargaServicios(-1);

		$("#SolicitarCotizacion").click(function(){
		enviarCotizacion();
	});
		
	});
	sessionStorage.removeItem('serviciosCotizar');
	
});
