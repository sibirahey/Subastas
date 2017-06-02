Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

 Date.prototype.toMXFormat = function(c){
 	alert(c);

 }

function ValidaSession(){
	
	if(getCookie("escuderia-rememberme") == "" && sessionStorage.claveapi == undefined){
		window.location = siteurl;
	}
}

function cargaHTML(contendor, url, name, callback) {

	var rand = Math.floor((Math.random() * 10000000) + 1);
	$(contendor).attr("name", name);
	$(contendor).load(url + "?rand=" + rand, callback);
}


function esAdmin() {
	if (sessionStorage.getItem("es_admin") == 1) {
		return true;
	} else {
		return false;

	}

}

function CargaAnioAutos(anio) {
	var options = "";

	options += '<option value="0" disabled selected>Año</option>';

	for ( i = (new Date().getFullYear() + 1); i > 1950; i--) {

		options += '<option value="' + i + '" ' + ((i == anio) ? 'selected="selected"' : '' ) + ' >' + i + '</option>';

	}

	return options;

}

function CargaSelectEstados(control) {

	postrequest("estados/listar?rand=" + Math.random(), {
		"estatus" : "1"
	}, function(data) {

		$(control).append('<option value="0" disabled selected>Estado</option>');
		for (i in data) {

			$(control).append('<option value="' + data[i].id + '">' + data[i].nombre + '</option>');
		}
		$(control).material_select();
		
	});

}

function CargaSelectMunicipios(control, id_estado) {

	$("#cbCiudadAuto").material_select("destroy");
	postrequest("municipios/listar?rand=" + Math.random(), {
		"estatus" : "1",
		"id_estado" : id_estado
	}, function(data) {
		if (data.mensaje == "OK") {
			return;
		}

		$(control).html("");
		for (i in data) {

			$(control).append('<option value="' + data[i].id + '">' + data[i].nombre + '</option>');
		}
		$("#cbCiudadAuto").material_select();
		
	});

}

function CargaSelectMarcas(control, id_marca, estatus) {

	postrequest("marcas/listar?rand=" + Math.random(), {
		"estatus" : estatus
	}, function(data) {
		$(control).html("");
		$(control).append('<option value="0" disabled selected>Marca</option>');
		for (i in data) {

			$(control).append('<option value="' + data[i].id + '" ' + ((data[i].id == id_marca) ? 'selected="selected"' : '' ) + ' >' + data[i].descripcion + '</option>');
			
		}
		$(control).material_select();
	});
	

}

function CargaSelectModelos(control, control_marca, id_modelo, estatus) {

	$('#cmbModelos').material_select("destroy");
	$('#cbModeloAuto').material_select("destroy");
	postrequest("modelos/listar?rand=" + Math.random(), {
		"estatus" : estatus,
		"id_marca" : $(control_marca).val()
	}, function(data) {

		$(control).html("");
		$(control).append('<option value="0" disabled selected>Modelo</option>');
		if (data.mensaje != "OK") {
			for (i in data) {

				$(control).append('<option value="' + data[i].id + '" ' + ((data[i].id == id_modelo) ? 'selected="selected"' : '' ) + ' >' + data[i].descripcion + '</option>');
			}
			$('#cmbModelos').material_select();
			$('#cbModeloAuto').material_select();
		}

		
	
	});


}

function CargaSelectTipoTransmision(control, id_transmision, estatus) {
	postrequest("transmisiones/listar?rand=" + Math.random(), {
		"estatus" : estatus
	}, function(data) {

		for (i in data) {

			$(control).append('<option value="' + data[i].id + '" ' + ((data[i].id == id_transmision) ? 'selected="selected"' : '' ) + ' >' + data[i].descripcion + '</option>');
		}
		$(control).material_select();

	});

}

function CargaSelectFeatures(control, features, estatus) {

	postrequest("features/listar?rand=" + Math.random(), {
		"estatus" : estatus
	}, function(data) {

		$(control).append('<option value="0" disabled selected>SELECCIONA</option>');

		for (i in data) {

			$(control).append('<option value="' + data[i].id + '" >' + data[i].descripcion + '</option>');

		}
		$(control).material_select();
	});

}

function CargaSelectColores(control, id_color, estatus) {
debugger;
	$(control).append('<option value="0" disabled selected>SELECCIONA</option>');
	postrequest("colores/listar?rand=" + Math.random(), {
		"estatus" : estatus
	}, function(data) {

		for (i in data) {

			$(control).append('<option value="' + data[i].id + '" ' + ((data[i].id == id_color) ? 'selected="selected"' : '' ) + ' >' + data[i].descripcion + '</option>');
		}
		$(control).material_select();

	});

}

function getUrlVars() {
	var vars = [],
	    hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {

	var rememberme = getCookie("escuderia-rememberme");
	if (rememberme != "") {
		postrequest("usuarios/rememberme", {
			"claveapi" : rememberme
		}, function(data) {

			if (data.valido) {

				sessionStorage.setItem('nombre', data["nombre"] + " " + data["appaterno"] + " " + data["apmaterno"]);
				sessionStorage.setItem('correo', data["correo"]);
				sessionStorage.setItem('publico', data["publico"]);
				sessionStorage.setItem('es_admin', data["esadmin"]);
				sessionStorage.setItem('claveApi', data["claveApi"]);
				setCookie("escuderia-rememberme", data["claveApi"], true);

				window.location.href = "main.php";

			}

		});

	}
}

function cargaAutosPorSubasta(subastaID, controlid, tiposubasta) {
	debugger;
	$(controlid).html("");
	postrequest("autos/subasta", {
		"idsubasta" : subastaID
	}, function(data) {
		$("#divDetalleAuto").hide();
		for (var val in data) {
			$(controlid).append(regresaRenglonVenta(data[val], subastaID));
		}
		if(tiposubasta){
			$(".divBtnPujar").show();
			if(tiposubasta == 1){
				$(".divVerOfertas").show()
			}
		}

	});

}

function regresaRenglonVenta(item, subastaID) {

	var renglon = '<div class="searchItem">';
	renglon += '	<div class="searchItemHead">';
	renglon += '		<label>' + item.marca + ' - ' + item.modelo + '</label>';
		renglon += '		<div class="waves-effect waves-light"><i class="material-icons" attr-id="' + item.idAuto + '" onclick="VerDetalleAuto(this);">feedback</i></div>';
	if(sessionStorage["es_admin"] == 1 && getUrlVars()["accion"] != "subasta"){
		renglon += '		<div class="waves-effect waves-light editauto"><i class="material-icons" attr-id="' + item.idAuto + '" attr-subastaid="'+subastaID+'" onclick="EditarAuto(this);">mode_edit</i></div>';
	}
	renglon += '	</div>';
	renglon += '	<div class="searchItemImg"><img attr-id="' + item.idAuto + '" width="100px" onclick="VerDetalleAuto(this);" src="' + siteurl + 'uploads/' + item.foto + '" onerror="imgError(this)"; /></div>';
	renglon += '	<div class="searchItemBody">';
	renglon += '		<div>';
	renglon += '			<label>Año: </label>';
	renglon += '			<label>' + item.anio + '</label>';
	renglon += '		</div>';
	renglon += '		<div>';
	renglon += '			<label>Color: </label>';
	renglon += '			<label>' + item.color + '</label>';
	renglon += '		</div>';
	renglon += '		<div>';
	renglon += '			<label>Kilometraje: </label>';
	renglon += '			<label>' + Number(item.km).formatMoney(2, '.', ',') + '</label>';
	renglon += '		</div>';
	renglon += '		<div>';
	renglon += '			<label>Precio: </label>';
	renglon += '			<label>' +"$" +Number(item.precio).formatMoney(2, '.', ',') + '</label>';
	renglon += '		</div>';
	renglon += '		<div>';
	renglon += '			<label>Descripción: </label>';
	renglon += '			<label>' + item.descripcion + '</label>';
	renglon += '		</div>';
	if(subastaID > 0){
		renglon += '		<div class="divBtnPujar" style="display:none">';
		renglon += '			<div id="btnPujar" class="btnPujar" onclick=PujarAuto('+item.idAuto+','+subastaID+','+Number(item.precio)+');>Ofertar</label>';
		renglon += '		</div>';
		renglon += '		<div class="divVerOfertas" style="display:none">';
		renglon += '			<div id="btnVerOfertas" class="btnPujar" onclick=VerOfertas('+item.idAuto+','+subastaID+');>Ver Ofertas</label>';
		renglon += '		</div>';
	}

	renglon += '	</div>';
	renglon += '</div>';
	return renglon;

}

function EditarAuto(o){

	 var subastaid = $(o).attr("attr-subastaid");
	 var autoid = $(o).attr("attr-id");

	 $("#divListaAutos").load("views/main/admin/altaautos.html?rand=" + Math.random(), function() {

	 	$("#btnGuardaAuto").hide();
	 	$("#bntActualizaAuto").show();
	 	debugger;
		$("#divRegistroAutos").show();
		$("#divSubastaNombre").html("");
		$("#divSubastaNombre").show();
		$("#divSubastaNombre").css("display", "");
		$("#btnGuardaAuto").attr("attr-nombresubasta", "");
		$("#btnGuardaAuto").attr("attr-subastaid", subastaid);
		$("#btnGuardaAuto").attr("attr-autoid", autoid);
		CargaFuncionesRegistroAuto();

		postrequest("autos/info",{ "autoid":autoid}, function(data){
			$("#cbMarcaAuto").material_select("destroy");
			$("#cbMarcaAuto").val(data.marcaid);
			$("#cbMarcaAuto").material_select();
			$("#cbMarcaAuto").change();
			

			$("#cbColorAuto").material_select("destroy");
			$("#cbColorAuto").val(data.colorid);
			$("#cbColorAuto").material_select();

			$("#cbAnioAuto").material_select("destroy");
			$("#cbAnioAuto").val(data.anio);
			$("#cbAnioAuto").material_select();

			
			$("#cbKMAuto").val(data.km);
			$("#precioAuto").val(data.precio);

			$("#cbTipoTransmisionAuto").material_select("destroy");
			$("#cbTipoTransmisionAuto").val(data.transmisionid);
			$("#cbTipoTransmisionAuto").material_select();

			$("#cbEstadoAuto").material_select("destroy");
			$("#cbEstadoAuto").val(data.estadoid);
			$("#cbEstadoAuto").material_select();
			$("#cbEstadoAuto").change();

		

			var features = data.caracteristicasids.split(",");
			for(var f in features){

				$("#cbFeaturesAutos").material_select("destroy");
				$("#cbFeaturesAutos").val(features[f]);
				$("#cbFeaturesAutos").material_select();
				$("#btnAddFeature").click();
					
			}

			$("#txtaDescripcionAuto").val(data.descripcion);

			$("#btnGuardaAuto").attr("attr-id", autoid);
			$("#btnGuardaAuto").attr("attr-subastaid",subastaid);

			$("#btnGuardaAuto").click = null;

			$("#bntActualizaAuto").click(function (){
		
				GuardaDetalleAuto("actualiza");
			});


			$("#cbModeloAuto").material_select("destroy");
			$("#cbModeloAuto").val(data.modeloid);
			$("#cbModeloAuto").material_select();

			$("#cbCiudadAuto").material_select("destroy");
			$("#cbCiudadAuto").val(data.ciudadid);
			$("#cbCiudadAuto").material_select();


		});


	});
}


function GuardaDetalleAuto(opc){

	debugger;
		oAuto = new Autos();
		oAuto.idAuto = $("#btnGuardaAuto").attr("attr-idsubasta");
		if(parseInt($("#btnGuardaAuto").attr("attr-subastaid")) > 0){
			oAuto.enVenta  = 0;
			oAuto.idSubasta = $("#btnGuardaAuto").attr("attr-subastaid");
		}else{
			oAuto.enVenta = 1;
			oAuto.idSubasta = 0;

		}
		oAuto.precio = $("#precioAuto").val();
		oAuto.marca = $("#cbMarcaAuto").val();
		oAuto.modelo = $("#cbModeloAuto").val();
		oAuto.color = $("#cbColorAuto").val();
		oAuto.anio = $("#cbAnioAuto").val();
		oAuto.km = $("#cbKMAuto").val();
		oAuto.transmision = $("#cbTipoTransmisionAuto").val();
		oAuto.estado = $("#cbEstadoAuto").val();
		oAuto.ciudad = $("#cbCiudadAuto").val();
		oAuto.descripcion = JSON.stringify($("#txtaDescripcionAuto").val());
		oAuto.estatus = 1;
		oAuto.publicado = 1;
		oAuto.features = [];
		oAuto.fotos = [];

		if(opc =="actualiza"){

			oAuto.idAuto = Number($("#btnGuardaAuto").attr("attr-autoid"));
		}
		

		$.each( $(".feature"), function( key, value ) {
			  oAuto.features.push( $(value).attr("attr-featureid"));
		});

		$.each( $(".fotosAuto"), function( key, value ) {
			  oAuto.fotos.push( $(value).attr("attr-id"));
		});
		
		
		if (validaCamposAltaAutos(oAuto)){
			
			postrequest("autos/"+opc, oAuto, function(data){

				
				if(data > 0){
					alert("Los datos se guardaron correctamente");
					//$("#divRegistroAutos").dialog("close"); 
					
				}else{
					alert("Ocurrió un error al guardar");

				}
			}, function(data){

				alert("Ocurrió un error al guardar los datos")
			});

		}

}

function VerDetalleAuto(o) {
	var subastaid = $(o).attr("attr-subastaid");
	var autoid = $(o).attr("attr-id");

	if(getUrlVars()["accion"] == "subasta"){
			$('#divDetalleAuto').modal({
			dismissible : true, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
		});
		$('#divDetalleAuto').modal("open");
		

		
	}


	

	postrequest("autos/info",{ "autoid":autoid}, function(data){

			var infoAuto = data;
			cargaHTML("#divDetalleAuto", "views/interna2.html", "Detalle Auto",function(){
			

			debugger;
			//$("#divDetalleAuto").show();
			$("#divListaAutos").hide();

			$("#imgPrincipal").attr("src", siteurl+"uploads/"+infoAuto.foto);
			var fotos = infoAuto.fotos.split(",");
			for(i in fotos){

				$("#imgSnapshots").append('<div><img alt="Imagen no disponible" attr-idx="1" src="'+ siteurl+"uploads/"+fotos[i]+ '" onclick="CambiaFotoPrincipal(this);"/></div>');
			}
			$("#detalleTitulo").html(infoAuto.modelo +" " + infoAuto.anio);
			$("#detalleIdAuto").html(infoAuto.idAuto);
			$("#detalleMarca").html(infoAuto.marca);
			$("#detalleModelo").html(infoAuto.modelo);
			$("#detalleKM").html(Number(infoAuto.km).formatMoney());
			$("#detalleAnio").html(infoAuto.anio);

			$("#detalleColor").html(infoAuto.color);
			$("#detallePrecio").html("$"+Number(infoAuto.precio).formatMoney());
			$("#detalleTransmision").html(infoAuto.transmision);
			$("#detalleDescripcion").html(infoAuto.descripcion);
			$("#detalleCaracteristicas").html(infoAuto.caracteristicas);
			$("#detalleUbicacion").html(infoAuto.estado + " - " + infoAuto.ciudad);
			if(getUrlVars["accion"] == "subasta"){


			}
		
		});
	});
	
	

}

function CambiaFotoPrincipal(img){
	
	$("#imgPrincipal").attr("src", $(img).attr("src"));

}
function CierraDetalle(){


				$("#divDetalleAuto").hide();				
				$("#divListaAutos").show();
}

function ObtieneSubastasPorUsuario() {
	postrequest("subastas/xusuario", {
		"idsubasta" : subastaID
	}, function(data) {

		for (var val in data) {

			$(controlid).append(regresaRenglonVenta(data[val],0));
		}

	});

}

function eventoFinalizaEscritura(textdiv, FuncionFinaliza, timer, intervalo) {
	//definir variables timer intervalo

	$(textdiv).on('keyup', function() {

		clearTimeout(timer);
		timer = setTimeout(FuncionFinaliza, intervalo);
	});

	$(textdiv).on('keydown', function() {
		clearTimeout(timer);
	});

}

jQuery.expr[':'].icontains = function(a, i, m) {
	return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

function SoloNumericos(inputItem) {

	$(inputItem).on("keypress keyup", function(event) {
		// Allow: backspace, delete, tab, escape, enter and .
		if (//$.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		// Allow: Ctrl+A, Command+A
		(event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
		// Allow: home, end, left, right, down, up
		(event.keyCode >= 35 && event.keyCode <= 40)) {
			// let it happen, don't do anything
			return;
		}
		//this.value = this.value.replace(/[^0-9\.]/g,'');
		//$(this).val($(this).val().replace(/[^0-9\.]/,''));

		if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
	});
}

function CargaJsonHome(){
		postrequest("data/home.json", {}, 
			function(data) {
				for(obj in data){
					var secc = data[parseInt(obj)];

					if(secc.estatus == 0){
						$("#"+secc.tag).hide();

					}else{
						$("#"+secc.tag).show();						
					}

					if(secc.esimg == 1){
						$("#"+secc.tag).attr("src",secc.url);
					}else{

					}
					if(secc.eslink == 1){
						console.log("es 1");
						$("#"+secc.tag).attr("attr-link",secc.link);
						$("#"+secc.tag).click(function(){
							var o = this;
							window.open($(o).attr("attr-link"));
							
						});	

					}
					
				}
				// debugger;
				// for (secc = 0; data.length < 5; secc++) {
				// 	alert(secc);
				 // 	if(data[secc].esimg == 1){
					// 	$("#".data[i]).attr("src",data[secc].url);
					// }else{

					// }
				// }
		});

}

function CargaInfoSubasta(){
	debugger;
	cargaHTML(".mainBody", siteurl+"views/main/subastas.html","subasta", function(){
		vars = getUrlVars();
		$('#modalPuja').modal({
			dismissible : true, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
			startingTop : '4%', // Starting top style attribute
		});

		$('#modalOfertas').modal({
			dismissible : true, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
			startingTop : '4%', // Starting top style attribute
		});


		
		postrequest("subastas/info", {
			"id" : vars["id"]
		}, function(data) {
				console.log(JSON.stringify(data));
				$("#divTtlSubasta").html(data[0].nombreSubasta);
				$("#divTipoSubasta").html(data[0].tipoSubasta);
				$("#divIncremento").attr("attr-incremento", data[0].incremento); 
				$("#divIncremento").html($("#divIncremento").html().replace("#INCREMENTO#", Number(data[0].incremento).formatMoney()));
				$("#divOfertasXUsuario").html($("#divOfertasXUsuario").html().replace("#TOTALOFERTAS#", Number(data[0].ofertas_x_usuarios)));
				$("#divGanadores").html($("#divGanadores").html().replace("#AUTOSXUSUARIO#", Number(data[0].autos_x_usuario)));
				
				ConsultaOfertasXUsuarioSubasta(data[0].idSubasta);
				
				cargaAutosPorSubasta(vars["id"], "#divContenidoSubasta", data[0].idTipoSubasta);
				debugger;
				var fechaFin = new Date(data[0].fechaFin);
				fechaFin.setHours(42);
				fechaFin.setMinutes(59);
				fechaFin.setSeconds(59);

				if(new Date() > fechaFin){
					$("#btnPujar").hide();
				}else{
					$("#btnPujar").show();
				}
				

			});

	});

}

function ConsultaOfertasXUsuarioSubasta(idSubasta){
	var total = -1;
	postrequest("pujas/ofertasxusuario", { "id_subasta" : idSubasta, "claveapi": sessionStorage.claveapi }, function(data) {
		debugger;
			total = data;
			$("#numOfertasXusuario").html(total);
			
		});

}

function PujarAuto(idAuto, idSubasta, precio){
	
	$('#modalPuja').modal("open");
	$("#btnGuardarOferta").attr("attr-subastaid", idSubasta);
	$("#btnGuardarOferta").attr("attr-idauto", idAuto);
	$("#btnGuardarOferta").attr("attr-precio", idAuto);

	
}

function VerOfertas(idAuto, idSubasta){
	$("#modalOfertas").modal("open");
	$("#divOfertas").html(""); 
	postrequest("pujas/listar", 
		{ "id_auto" : idAuto, "id_subasta": idSubasta }, 
		function (data){
			console.log(JSON.stringify(data));
			for( var val in data){
				$("#divOfertas").append("<div><div>"+ data[val].nombre_usuario+"</div><div>" + Number(data[val].oferta).formatMoney()+"</div><div>" + data[val].hora_puja +"</div></div>");
			}
			

		});


}
function GuardarOferta(o){

	if(ValidaOferta($(o).attr("attr-precio"))){
		postrequest("pujas/ofertar", 
			{"id_subasta" : $(o).attr("attr-subastaid") , "id_auto": $(o).attr("attr-idauto"), "claveapi":sessionStorage["claveapi"], "oferta":$("#txtOferta").val() }, 
			function(data) {
				alert(data);
				ConsultaOfertasXUsuarioSubasta($(o).attr("attr-subastaid") );
			},function(){
				alert("Ocurrió un error al registrar su oferta");
			});
	}else{

		alert("Oferta inválida");
	}
	

}

function ValidaOferta(precio){


	try{
		Number($("#txtOferta").val())
	}catch(err){
		return false;
	}
	var oferta = Number($("#txtOferta").val());
	var incremento = oferta%Number($("#divIncremento").attr("attr-incremento"));
	if(oferta > precio && incremento == 0) {
		return true;
	}else{
		return false;
	}
}

function ValidaEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
	
