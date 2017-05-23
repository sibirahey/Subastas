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

	});
	$(control).material_select();

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
		}
		
		$('#cmbModelos').material_select();
		$('#cbModeloAuto').material_select();
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

		$(control).append('<option value="0" disabled selected></option>');

		for (i in data) {

			$(control).append('<option value="' + data[i].id + '" >' + data[i].descripcion + '</option>');

		}
		$(control).material_select();
	});

}

function CargaSelectColores(control, id_color, estatus) {

	$(control).append('<option value="0" disabled selected></option>');
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

function cargaAutosPorSubasta(subastaID, controlid) {
	debugger;
	$(controlid).html("");
	postrequest("autos/subasta", {
		"idsubasta" : subastaID
	}, function(data) {

		for (var val in data) {
			$(controlid).append(regresaRenglonVenta(data[val]));
		}

	});

}

function regresaRenglonVenta(item) {

	var renglon = '<div class="searchItem">';
	renglon += '	<div class="searchItemHead">';
	renglon += '		<label>' + item.marca + ' - ' + item.modelo + '</label>';
	renglon += '		<i class="fa fa-arrow-circle-right" attr-id="' + item.idAuto + '" onclick="VerDetalleAuto(this);"></i>';
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
	renglon += '		<div class="divBtnPujar" style="display:none">';
	renglon += '			<div id="btnPujar" class="btnPujar">Ofertar</label>';
	renglon += '		</div>';
	renglon += '	</div>';
	renglon += '</div>';
	return renglon;

}

function VerDetalleAuto(o) {

	window.location = "?accion=detalleauto&id=" + $(o).attr("attr-id");

}

function ObtieneSubastasPorUsuario() {
	postrequest("subastas/xusuario", {
		"idsubasta" : subastaID
	}, function(data) {

		for (var val in data) {

			$(controlid).append(regresaRenglonVenta(data[val]));
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

		postrequest("subastas/info", {
			"id" : vars["id"]
		}, function(data) {
			
			$("#divTtlSubasta").html(data[0].nombreSubasta);
			$("#divTipoSubasta").html(data[0].tipoSubasta);
			cargaAutosPorSubasta(vars["id"], "#divContenidoSubasta");
			$(".divBtnPujar").show();

			});

	});


	
}

	
