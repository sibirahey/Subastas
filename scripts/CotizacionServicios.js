function cargaServicios(idServicio) {

	postrequest("servicios/listar",{"estatus":"1"},function(data){

		for(serv in data){
			$("#divLstServicios").append('<div><div class:"submenuitem" id ="'+data[serv].idServicios+'" onClick="cargaServiciosCotizar(this)">'+data[serv].nombre+'</div></div>');
			
		}

		
	})

}


function cargaServiciosCotizar(O) {
	$(".rows").remove();
	var idServicio = $(O).attr('id');

	postrequest('subservicio/listar',{"estatus":"1","idServicio":idServicio},function(data){
		for (subServ in data){

			if (data[subServ].idSubservicio != undefined){
				var Renglon;
			
				

			if(sessionStorage.getItem('esAdministrador')!=1){
				Renglon = '<div class="rows" id="1">';
				Renglon+= '<div class:"servicioRow" id ="' + data[subServ].idSubservicio + '">' + data[subServ].nombre + '</div>';			
				Renglon+= '<button id="btnAgregarS" idServicios="' + data[subServ].idSubservicio + '" idServicio="' + data[subServ].idServicio + '" onClick="AgregarServicio(this);">Cotizar</button>';
				Renglon+='</div>';


			}else{
				Renglon = '<div class="rows" id="0">';
				Renglon+= '<input type="text" name ="servicio" id ="txt' +data[subServ].idServicio+ data[subServ].idSubservicio + '" value = "' + data[subServ].nombre + '"/>';			
				Renglon+= '<button id="btnGuardarS" idServicios="' + data[subServ].idSubservicio + '" idServicio="' + data[subServ].idServicio + '" onClick="ActualizarSubServicio(this);">Guardar</button>';
				Renglon+='</div>';
			}

				$("#divDetalleServicios").append(Renglon);
			}

		}

		if(sessionStorage.getItem('esAdministrador') == 1){

			
			var Renglon = '<div class="rows" id="0">';
				Renglon+= '<input type="text" name ="servicio" id ="txt'+idServicio+'0" value ="Agregar"/>';			
				Renglon+= '<button id="btnGuardarS" idServicios="0" idServicio="'+idServicio+' onClick="ActualizarSubServicio(this);">Nuevo</button>';
				Renglon+='</div>';

				$("#divDetalleServicios").append(Renglon);

		}

	});

}

function ActualizarSubServicio(obj){
 debugger;
 	var objSubServicio = new SubServicios();

	objSubServicio.idServicio= $(obj).attr("idServicio");
	objSubServicio.idSubServicio = $(obj).attr("idServicios");
	objSubServicio.nombre = $("#txt"+objSubServicio.idServicio+objSubServicio.idSubServicio).val();
	objSubServicio.estatus = '1';
	objSubServicio.requisitos = 'X';
	if (objSubServicio.idSubServicio >0){

		postrequest('subservicio/actualizar',objSubServicio,function(data){

			debugger;
		});
	}else{

		postrequest('subservicio/registro',objSubServicio,function(data){

			debugger;
		});

	}


}



function AgregarServicio(obj) {

	
	var sc = sessionStorage.getItem('serviciosCotizar');
	var serviciosCotizar=[];
	var objServicioCotizar = new CotizacionServicio();
	objServicioCotizar.idServicio = $(obj).attr('idServicio');
	objServicioCotizar.idSubServicios= $(obj).attr('idServicios');
	if(sc != undefined){

	 serviciosCotizar= JSON.parse(sc);


	}


	var i =0;
	var indexRemove;
	var result = $.grep(serviciosCotizar, function(e)
		{ 
			
			if(e.idSubServicios== objServicioCotizar.idSubServicios && e.idServicio== objServicioCotizar.idServicio ){
				indexRemove = i;
				return e;

			}else{

				i++;
			}
			
		});

	if (result.length >0){			

				 	serviciosCotizar.splice(indexRemove,1);


	}else{
		serviciosCotizar.push(objServicioCotizar);

		}
		sessionStorage.setItem('serviciosCotizar',JSON.stringify(serviciosCotizar));
	

	if (serviciosCotizar.length !=0){

		$('#divCotizacion').show();

	}else{

		$('#divCotizacion').hide();
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

		var objcotizacion = new Cotizacion();
		objcotizacion.nombre= nombre;
		objcotizacion.correo = correo;
		objcotizacion.telefono = telefono;
		objcotizacion.marca = marca;
		objcotizacion.modelo = modelo;
		objcotizacion.tipo = tipo;
		objcotizacion.estatus=1;
		objcotizacion.subServicios = JSON.parse( sessionStorage.getItem("serviciosCotizar"));
		 postrequest("cotizacion/registro", objcotizacion, function(data){
    });

	}else{

		alert("Debe Llenar todos los campos");
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

$(document).ready(function() {
	$(".mainBody").load("views/CotizacionServicios.html", function() {
	
		cargaServicios(-1);

		$("#SolicitarCotizacion").click(function(){
		enviarCotizacion();
	});
		
	});
	sessionStorage.removeItem('serviciosCotizar');

	sessionStorage.setItem('esAdministrador','1');
	
});
