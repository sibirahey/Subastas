function cargaServicios(idServicio) {
	
	postrequest("servicios/listar",{"estatus":"1"},function(data){

		for(serv in data){
			$("#divLstServicios").append('<div><div class:"submenuitem" idServicio ="'+data[serv].idServicios+'" onClick="cargaServiciosCotizar(this)">'+data[serv].nombre+'</div></div>');
			
		}

		
	})

}


function cargaServiciosCotizar(O) {
	
	$(".rows").remove();
	var idServicio = $(O).attr('idServicio');

	postrequest('subservicio/listar',{"estatus":"0","idServicio":idServicio},function(data){
		for (subServ in data){

			if (data[subServ].idSubservicio != undefined){
				var Renglon;
			
				var ids='idSubServicio="' + data[subServ].idSubservicio + '" idServicio="' + data[subServ].idServicio+'" ';
				var idNombre=data[subServ].idServicio+ data[subServ].idSubservicio;
			
				Renglon = '<div class="rows" id="1">';
				Renglon+= '<div class:"servicioeditado" id ="Subservicio' + data[subServ].idSubservicio + '">' + data[subServ].nombre + '</div>';			
				if(sessionStorage.getItem('esAdministrador')==1)
					Renglon+= '<input type="text" class="editarServicio" name ="servicio" id ="txt' +data[subServ].idServicio+ data[subServ].idSubservicio + '" value = "' + data[subServ].nombre + '" style="display: none;"/>';			
				
				Renglon+= '<button id="btnAgregarS" '+ids+ ' onClick="AgregarServicio(this);">Cotizar</button>';
				
				if(sessionStorage.getItem('esAdministrador')==1)
					Renglon+= '<button id="btnGuardarS"  idSubServicio="' + data[subServ].idSubservicio + '" idServicio="' + data[subServ].idServicio + '" onClick="ActualizarSubServicio(this);">Editar</button>';
				
				if (idServicio ==3 && sessionStorage.getItem('esAdministrador') == 1){

					Renglon+='<div id="uploadFile'+idNombre+'" style="display:none;" >';
					Renglon+='<div id="divFile'+idNombre+'" style="display:none;" >Archivo</div>';
					Renglon+='<button id="btnSubir"'+ids+ ' onClick="SubirArchivo(this);">Subir Archivo</button>';
					Renglon+='</div>'
				}

				if (idServicio ==3 ){

					Renglon+='<div id="requisitos'+idNombre+'"  >';
					Renglon+='<a target="_blank" href ="data/CambioPropEdoMex.pdf">Requisitos</a> ';
					Renglon+=  '</div>';
				}
				Renglon+='</div>';

			if(sessionStorage.getItem('esAdministrador')!=1){

			}

				$("#divDetalleServicios").append(Renglon);
			}

		}

		if(sessionStorage.getItem('esAdministrador') == 1){
			
			var Renglon = '<div class="rows" id="0">';
				Renglon+= '<input type="text" name ="servicio" class="txtNuevoServ" id ="txtNuevoServicio" value ="Agregar" style="display:none;"/>';			
				Renglon+= '<button id="btnGuardarS" idSubServicio="0" idServicio="'+idServicio+'" onClick="NuevoSubServicio(this);">Agregar</button>';
				if (idServicio ==3){
					Renglon+='<div id="uploadnewFile" style="display:none;" >';
				
					Renglon+= agregaControlUpload('idSubServicio="0" idServicio="' + idServicio + '"') + '</div>';
				}
				Renglon+='</div>';

				$("#divDetalleServicios").append(Renglon);

		}

	});

}

function ActualizarSubServicio(obj){

	if ($("#txt"+$(obj).attr("idServicio")+$(obj).attr("idSubServicio")).is(":visible")){
	 	var objSubServicio = new SubServicios();

		objSubServicio.idServicio= $(obj).attr("idServicio");
		objSubServicio.idSubServicio = $(obj).attr("idSubServicio");
		objSubServicio.nombre = $("#txt"+objSubServicio.idServicio+objSubServicio.idSubServicio).val();
		objSubServicio.estatus = '1';
		objSubServicio.requisitos = 'X';
		if (objSubServicio.idSubServicio >0){

			postrequest('subservicio/actualizar',objSubServicio,function(data){

				if(data ==1){
					$(obj).text('Editar');
					$("#txt"+$(obj).attr("idServicio")+$(obj).attr("idSubServicio")).hide();
					$("#Subservicio" + $(obj).attr("idSubServicio")).show();
					cargaServiciosCotizar(obj);

					alert("Se actualizo correctamente");

				}else{

					alert("no fue posible actualizar, Intentelo nuevamente");
				}


			});
		}else{

			postrequest('subservicio/registro',objSubServicio,function(data){
				cargaServiciosCotizar(obj);
				debugger;
			});

		}	
	} else {
		$(obj).text('Guardar');
		$("#txt"+$(obj).attr("idServicio")+$(obj).attr("idSubServicio")).show();
		$("#Subservicio" + $(obj).attr("idSubServicio")).hide();
		if($(obj).attr("idServicio") ==3){
			$("#uploadFile"+$(obj).attr("idServicio")+$(obj).attr("idSubServicio")).show();
			$("#requisitos"+$(obj).attr("idServicio")+$(obj).attr("idSubServicio")).hide();

		}
	}

}

function SubirArchivo(obj){



}

function NuevoSubServicio(obj){

	if ($("#txtNuevoServicio").is(":visible")){
	 	var objSubServicio = new SubServicios();

		objSubServicio.idServicio= $(obj).attr("idServicio");
		objSubServicio.idSubServicio = $(obj).attr("idSubServicio");
		objSubServicio.nombre = $("#txtNuevoServicio").val();
		objSubServicio.estatus = '1';
		objSubServicio.requisitos = 'X';
		

			postrequest('subservicio/registro',objSubServicio,function(data){
				$(obj).text('Nuevo');
				$("#txtNuevoServicio").hide();
				cargaServiciosCotizar(obj);
				debugger;
			});

		
	} else {
		$(obj).text('Guardar');
		$("#txtNuevoServicio").show();
		if(idServicio ==3)
			$("#uploadnewFile").show();
	}

}



function AgregarServicio(obj) {

	
	var sc = sessionStorage.getItem('serviciosCotizar');
	var serviciosCotizar=[];
	var objServicioCotizar = new CotizacionServicio();
	objServicioCotizar.idServicio = $(obj).attr('idServicio');
	objServicioCotizar.idSubServicios= $(obj).attr('idSubServicio');
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

function initCargaServicios() {
		
		cargaServicios(-1);

		$("#SolicitarCotizacion").click(function(){
			enviarCotizacion();
	
		
		});
		sessionStorage.removeItem('serviciosCotizar');

	
}

function agregaControlUpload(ids){


	var uploadControl = '<form action="" method="POST" enctype="multipart/form-data">';
    uploadControl += '<input type="file" name="userFile">';
    uploadControl += '<input type="submit" name="upload_btn" value="subirArchivo">';
	uploadControl += '</form>';
	 return uploadControl;
}



