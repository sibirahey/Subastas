var typingTimer;
var doneTypingIntervalo = 1000;

function LimpiarSubasta() {

	$("#txtNombreSubasta").val("");
	$("#txtIncremento").val("");
	$("#txtNumPujas").val("");
	$("#lstEmpresa").html("");
	$("#cmbEmpresas").val(-1);
	$("#btnGuardarSubasta").attr("attr-idsubasta", "0");
	CargaSubastas(-1, -1);
}

//Administrador Subastas

function AgregaEmpresa(idEmpresa, nombreEmpresa) {

	$("#lstEmpresa").append("<li attr-idx='" + idEmpresa + "' class='empresasSeleccionadas divRegistro'>" + nombreEmpresa + "</li>")
}

function CargaFuncionesAdminSubastas() {
	//debugger;
	$("#modalEmpresa").hide();
	$('.divHeaderContenido').hide();
	$("#txtFechaInicio").datepicker();
	$("#txtFechaFin").datepicker();

	$("#divAdministraUsuarios").hide();

	$("#btnNuevaEmpresa").click(function() {
		$('#labelMsjEmpresa').text('');
		$('#txtNombreEmpresa').val('');
		$('#btnGuardaEmpresa').attr('idEmpresa', '0');
		$('#btnEliminaEmpresa').attr('idEmpresa', '0');
		$('#btnEliminaEmpresa').attr('estatus', '1');
		$('#btnEliminaEmpresa').hide();


		$("#modalEmpresa").modal({
			dismissible : true, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
			startingTop : '4%', // Starting top style attribute
		});

		$("#modalEmpresa").modal("open");

	});
	$("#btnAgregaEmpresa").on('click', function() {
		if ($("#cmbEmpresas option:selected").val() > 0)
			AgregaEmpresa($("#cmbEmpresas option:selected").val(), $("#cmbEmpresas option:selected").text());

	});
	$("#btnGuardaEmpresa").add("#btnEliminaEmpresa").click(function() {
		if ($("#txtNombreEmpresa").val().length <= 0) {
			alert("Se requiere introducir un nombre para poder dar de alta una Empresa.");
			return;
		}
		var vEstatus = 1;
		var vIdempresa = 0;
		if (($(this).attr("idEmpresa")) > 0) {
			vIdempresa = ($(this).attr("idEmpresa"));
			if ($(this).attr("estatus") == "0") {
				vEstatus = 0;
			}
		}

		postrequest("empresas/guardar", {
			"idEmpresa" : vIdempresa,
			"nombreEmpresa" : $("#txtNombreEmpresa").val(),
			"estatus" : vEstatus
		}, function(data) {
			//debugger;
			if (data > 0) {
				alert("La empresa se agregó correctamente");
				CargaEmpresas(data);
				$("#modalEmpresa").modal("close");

			} else {
				alert("Ocurrió un error al agregar la empresa");

			}
		});




	});

	$("#btnFiltrar").click(function() {
		CargaSubastas($("#cmbPublicada option:selected").val(), $("#cmbEmpresasFiltro option:selected").val());
	});

	$("#btnGuardarSubasta").click(function() {
		
		guardarSubasta(this);

	});

	$("#btnAgregarSubasta").click(function() {
		debugger;
		$('#txtNombreSubasta').val('');
		$('#txtFechaInicio').val('');
		$('#txtFechaFin').val('');
		$('.divHeaderContenido').modal("open");
	});

	// $("#btnAgregaAuto").click(function() {
	// 	$("#divRegistroAutos").modal("open");
	// });
	//debugger;
	CargaEmpresas(0);
	CargaTipoSubastas();
	CargaSubastas(-1, -1);
	SoloNumericos("#txtIncremento");
	SoloNumericos("#txtNumPujas");

	eventoFinalizaEscritura('#txtNombreEmpresa', buscaEmpresa, typingTimer, doneTypingIntervalo);

}

function guardarSubasta(obj) {

	oSubastas = new Subastas();
	oSubastas.nombreSubasta = $("#txtNombreSubasta").val();
	oSubastas.IdTipoSubasta = $('input[name=tiposubastas]:checked').val();
	oSubastas.fechaInicio = (!$("#txtFechaInicio").datepicker('getDate')) ? "" : $("#txtFechaInicio").datepicker('getDate').getFullYear() + "-" + ($("#txtFechaInicio").datepicker('getDate').getMonth() + 1) + "-" + $("#txtFechaInicio").datepicker('getDate').getDate();
	oSubastas.fechaFin = (!$("#txtFechaFin").datepicker('getDate')) ? "" : $("#txtFechaFin").datepicker('getDate').getFullYear() + "-" + ($("#txtFechaFin").datepicker('getDate').getMonth() + 1) + "-" + $("#txtFechaFin").datepicker('getDate').getDate();
	oSubastas.empresas = [];
	oSubastas.incremento = $("#txtIncremento").val();
	oSubastas.ofertas_x_usuarios = $("#txtNumPujas").val();
	oSubastas.autos_x_usuario = $("#txtAutosGanados").val();

	if ($("#btnGuardarSubasta").attr("attr-idsubasta") == "0" || $("#btnGuardarSubasta").attr("attr-idsubasta") == undefined) {
		oSubastas.idSubasta = 0;
	} else {

		oSubastas.idSubasta = $("#btnGuardarSubasta").attr("attr-idsubasta");
	}
	$.each($(".empresasSeleccionadas"), function(key, value) {
		oSubastas.empresas.push($(value).attr("attr-idx"));
	});

	//console.log(JSON.stringify(oSubastas));
	if (ValidaCamposSubasta(oSubastas)) {
		//$(".divHeaderContenido").modal(close);
		postrequest("subastas/guardar", oSubastas, function(data) {
			
			debugger;
			if (data > 0) {
				alert("La subasta fue creada con éxito");
				CargaSubastas(-1, -1);

			}else{
				alert("Ocurrió un error al crear la subasta");
			}
		});
	}

}

function CargaEmpresas(idx) {
	//debugger;
	$("#cmbEmpresas").html("");
	$("#cmbEmpresasFiltro").html("");

	$("#cmbEmpresas").append('<option value="-1"> == Seleccione ==</div>');
	$("#cmbEmpresasFiltro").append('<option value="-1"> == TODAS ==</div>');

	

	postrequest("empresas/listar", {
		"estatus" : "1"
	}, function(data) {
		var selected = "";
		for (i in data) {
			selected = (data[i].idEmpresa == idx) ? 'selected="selected"' : "";
			$("#cmbEmpresas").append('<option value="' + data[i].idEmpresa + '" ' + selected + '>' + data[i].nombreEmpresa + "</option>");
			$("#cmbEmpresasFiltro").append('<option value="' + data[i].idEmpresa + '">' + data[i].nombreEmpresa + ' </option>');
		}
		$("#cmbEmpresas").material_select();
		$("#cmbEmpresasFiltro").material_select();
	});

}

function CargaTipoSubastas(estatus) {
	postrequest("tiposubastas/listar", {
		"estatus" : "1"
	}, function(data) {
		for (i in data) {
			$("#divTipoSubastas").append('<p><input name="tiposubastas" type="radio" id="tiposubastas' + data[i].idTipo + '" value="' + data[i].idTipo + '"/><label for="tiposubastas' + data[i].idTipo + '">' + data[i].tipoSubasta + '</label></p>');

		}
	});

}

function CargaSubastas(estatus, empresa) {
	postrequest("subastas/listar", {
		"estatus" : estatus,
		"empresa" : empresa,
		"subastaId" : -1
	}, function(data) {

		$("#divListaContenido").html("");
		for (i in data) {

			var div = '';
			div += '	<div class="divRenglonTabla col s12 m6 l4">';
			div += '		<div class="card">';
			div += '            <span class="card-title">' + data[i].nombreSubasta + '</span>';
			div += '            <div class="divider"></div>';
			div += '			<div class="fixed-action-btn toolbar" style="position: relative; display: inline-block; float:right;">';
			div += '				<a class="btn-floating">';
			div += '					<i class="large material-icons">menu</i>';
			div += '				</a>';
			div += '				<ul>';
			div += '					<li><a class="btn-floating btnEditarSubasta" attr-id="' + data[i].idSubasta + '" title="Editar Subasta"><i class="material-icons">create</i></a></li>';
			div += '					<li><a class="btn-floating btnAdministraAutos" attr-id="' + data[i].idSubasta + '" attr-nombresubasta="' + data[i].nombreSubasta + '" title="Administrar Autos"><i class="material-icons">add</i></a></li>';
			div += '					<li><a class="btn-floating btnAgregarUsuariosAutos" attr-id="' + data[i].idSubasta + '" attr-nombresubasta="' + data[i].nombreSubasta + '" title="Agregar Usuarios"><i class="material-icons">group_add</i></a></li>';
			div += '					<li><a class="btn-floating btnListaUsuarios" attr-id="' + data[i].idSubasta + '" attr-nombresubasta="' + data[i].nombreSubasta + '" title="Ver Usuarios"><i class="material-icons">group</i></a></li>';
			div += '					<li><a class="btn-floating btnVerAutos" attr-id="' + data[i].idSubasta + '" attr-nombresubasta="' + data[i].nombreSubasta + '" title="Ver Autos"><i class="material-icons">drive_eta</i></a></li>';
			div += '				</ul>';
			div += '			</div>';
			div += '			<div class="card-content">';
			div += '				<label>Tipo de subasta: </label><label>' + data[i].tipoSubasta + '</label>';
			div += '				<label>Vigencia: </label><label>' + data[i].fechaInicio + ' - ' + data[i].fechaFin + '</label>';
			div += '				<label>Estatus: </label><label>' + data[i].estatus + '</label>';
			div += '				<label>Empresas:</label><label>' + data[i].empresas + '</label>';
			div += '				<label>Publicada:</label><label>' + data[i].publicada + '</label>';
			div += '			</div>';
			div += '			<div class="card-action">';
			div += '				<div class="switch"><label>No Publicar<input type="checkbox" attr-id="' + data[i].idSubasta + '" class="btnPublicar" ' + ((data[i].visible == 0) ? "" : "checked" ) + '/><span class="lever"></span>Publicar</label></div>';
			//div += '				<label class="switch"><input type="checkbox" attr-id="' + data[i].idSubasta + '" class="btnPublicar" ' + ((data[i].visible == 0) ? "" : "checked" ) + ' /><div class="slider round"></div></label>';
			div += '			</div>';
			div += '		</div>';
			div += '	</div>';

			$("#divListaContenido").append(div);
		}

		$(".btnAdministraAutos").click(function() {
			debugger;
			var nombreSubasta = $(this).attr("attr-nombresubasta");
			var idSubasta = $(this).attr("attr-id");
			$("#divListaAutos").html("");
			if (idSubasta > 0) {
				$("#divListaAutos").load("views/main/admin/altaautos.html?rand=" + Math.random(), function() {

					$("#btnGuardaAuto").show();
	 				$("#bntActualizaAuto").hide();
	 				$('.altaAutosTitle').hide();
					$("#divRegistroAutos").show();
					$("#divSubastaNombre").html(nombreSubasta);
					$("#divSubastaNombre").show();
					$("#divSubastaNombre").css("display", "");
					$("#btnGuardaAuto").attr("attr-nombresubasta", nombreSubasta);
					$("#btnGuardaAuto").attr("attr-subastaid", idSubasta);
					CargaFuncionesRegistroAuto();

				});
			}

			$("#divRegistroAutos").modal("open");
		});

		$("#modalListaAutos").click(function(){
			$("#divDetalleAuto").hide();
			$("#divListaAutos").show();
		});
			
		

		$(".btnVerAutos").click(function() {
			debugger;
			var nombreSubasta = $(this).attr("attr-nombresubasta");
			var idSubasta = $(this).attr("attr-id");
			cargaAutosPorSubasta(idSubasta, "#divListaAutos");
			$('#divListaAutos').modal('open');
			$("#modalListaAutos").show();
			$("#modalListaAutos").show();
		});

		$("#btnCerrarListaAuto").click(function() {
			$("#divAutos").hide();

		});

		$(".btnAgregarUsuariosAutos").click(function() {
			debugger;
			var nombreSubasta = $(this).attr("attr-nombresubasta");
			var idSubasta = $(this).attr("attr-id");
			$("#btnUploadUserList").attr("idSubasta", idSubasta)
			$("#divAdministraUsuarios").modal("open");
		});

		$(".btnListaUsuarios").click(function(){
			debugger;
			var nombreSubasta = $(this).attr("attr-nombresubasta");
			var idSubasta = $(this).attr("attr-id");
			postrequest("subastas/participantes", {"id_subasta":idSubasta}, function(data){
				$("#divListaUsuariosTbl").html("");
				$("#divListaUsuariosTtl").html("Subasta: " + nombreSubasta);
				if(data.code){
					if(data.code == 400){
						alert("Ocurrió un error al obtener la lista de participantes");
						console.log(data.message);
					}
				}
				$("#divListaUsuariosTbl").html("");
				$tabla = "<table class='responsive-table striped centered'><tr><th>Nombre</th><th>Correo</th></tr>"
				for(var item in data){
					$tabla += "<tr><td>"+ data[item].nombre + " "+data[item].appaterno+" "+data[item].apmaterno + "</td><td>"+data[item].correo +"</td></tr>";
					console.log(data);
				}
				$tabla += "</table>";
				
				$("#divListaUsuariosTbl").html($tabla);
				
				$("#divListaUsuariosModal").modal("open");
				
			});
			

		});

		$("#btnUploadUserList").click(function() {

			var file_data = $('#listausuarios').prop('files')[0];
			var form_data = new FormData();
			form_data.append('file', file_data);
			form_data.append('accion', 'listausuarios');
			form_data.append('idsubasta', $(this).attr("idSubasta"));
			$.ajax({
				url : 'upload.php', // point to server-side PHP script
				dataType : 'text', // what to expect back from the PHP script, if anything
				cache : false,
				contentType : false,
				processData : false,
				data : form_data,
				type : 'post',
				success : function(php_script_response) {
					if (php_script_response.substring(0, 2) == "ERR") {
						alert(php_script_response);

						$("#divAdministraUsuarios").modal("close");
					} else {
						alert("La operación se realizó correctamente");
						var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');

					}

				}
			});

		});

		$(".btnEditarSubasta").click(function() {

			CargaInfoSubasta($(this).attr("attr-id"));

		});

		function CargaInfoSubasta(idSubasta) {

			postrequest("subastas/listar", {
				"estatus" : -1,
				"empresa" : -1,
				"subastaId" : idSubasta
			}, function(data) {
				$("#txtNombreSubasta").val(data[0].nombreSubasta);
				var parts = data[0].fechaInicio.split('-');
				var parts2 = data[0].fechaFin.split('-');

				$("input[name=tiposubastas][value=" + data[0].idTipoSubasta + "]").attr('checked', 'checked');
				$('#txtFechaInicio').datepicker("setDate", parts[1] + "/" + parts[2] + "/" + parts[0]);
				$('#txtFechaFin').datepicker("setDate", parts2[1] + "/" + parts2[2] + "/" + parts2[0]);
				$("#txtIncremento").val(data[0].incremento);
				$("#txtNumPujas").val(data[0].ofertas_x_usuarios);
				
				$("#txtAutosGanados").val(data[0].autos_x_usuario);
				$("#btnGuardarSubasta").attr("attr-idsubasta", data[0].idSubasta);
				$("#lstEmpresa").html("");
				var empresas = data[0].empresas.split(',');
				var empresasIds = data[0].empresasId.split(',');
				for (var i = 0; i < empresas.length; i++) {
					AgregaEmpresa(empresasIds[i], empresas[i]);

				}
				Materialize.updateTextFields();
			});

			$(".divHeaderContenido").modal("open");
		}


		$(".btnPublicar").click(function() {

			var visible = ($(this).prop("checked")) ? 1 : 0;
			var idSubasta = $(this).attr("attr-id");

			oSubastas = new Subastas();
			oSubastas.idSubasta = idSubasta;
			oSubastas.visible = visible;
			postrequest("subastas/publicar", oSubastas, function(data) {

				if (data > 0) {
					alert("La operación se realizó exitosamente");
				}
			})
			CargaSubastas($("#cmbPublicada option:selected").val(), $("#cmbEmpresasFiltro option:selected").val());

		});

	});
	//end postrequest
	$(function() {
		// $('#divAutos').dialog({
		// autoOpen : false,
		// modal : true,
		// height: 520,
		// width : 640,
		// resizable : false,
		// dialogClass: 'noTitleStuff',
		// buttons : [{
		// text : "Cancelar",
		// click : function() {
		// $(this).dialog("close");
		// }
		// }],
		// show : {
		// effect : "blind",
		// duration : 500
		// },
		// hide : {
		// effect : "blind",
		// duration : 500
		// }
		// })

		$('#divAutos').modal({
			dismissible : false, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
		});

	});

	$(function() {
		// $(".divHeaderContenido").dialog({
		// //title: "Nueva Subasta",
		// autoOpen : false,
		// modal : true,
		// width : 500,
		// resizable : false,
		// dialogClass: 'noTitleStuff',
		// buttons : [{
		// text : "Cancelar",
		// click : function() {
		// $(this).dialog("close");
		// }
		// }, {
		// text : "Guardar Subasta",
		// "id" : 'btnGuardarSubasta',
		// click: function(){guardarSubasta(this);}
		// }],
		// show : {
		// effect : "blind",
		// duration : 500
		// },
		// hide : {
		// effect : "blind",
		// duration : 500
		// }
		// });
		// $(".ui-dialog-titlebar").hide();
		$(".divHeaderContenido").modal({
			dismissible : false, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
		});
	});

	$(function() {
		// $("#divRegistroAutos").dialog({
		// autoOpen : false,
		// modal : true,
		// maxHeight : 500,
		// width : 500,
		// resizable : false,
		// dialogClass: 'noTitleStuff',
		// show : {
		// effect : "blind",
		// duration : 500
		// },
		// hide : {
		// effect : "blind",
		// duration : 500
		// }
		// });
		$("#divRegistroAutos").modal({
			dismissible : false, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
		});

	});

	$(function() {
		// $("#divAdministraUsuarios").dialog({
		// title : "Invitar usuarios",
		// autoOpen : false,
		// modal : true,
		// width : 500,
		// resizable : false,
		// show : {
		// effect : "blind",
		// duration : 500
		// },
		// hide : {
		// effect : "blind",
		// duration : 500
		// }
		// });
		
		$("#divAdministraUsuarios").modal({
			dismissible : false, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
			startingTop : '4%', // Starting top style attribute
			buttons: {
		        "Close": function () {
		            $(this). modal("close")
		        }
	    	}
	      
		});
		$("#divListaUsuariosModal").modal({
			dismissible : false, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
			startingTop : '4%', // Starting top style attribute
			buttons: {
		        "Close": function () {
		            $(this). modal("close")
		        }
    		}
		});


	});
	
	$('.tooltipped').tooltip({delay: 50});
}

//Home
function CargaFuncionesAdminHome() {

}

function ValidaCamposSubasta(objItem) {
	//debugger;
	var validado = true;

	if (objItem.nombreSubasta == '' || objItem.nombreSubasta == undefined) {
		validado = false;
	}

	if (objItem.IdTipoSubasta == '' || objItem.IdTipoSubasta == undefined) {
		validado = false;
	}
	if (objItem.fechaInicio == '' || objItem.fechaInicio == undefined) {
		validado = false;
	}
	if (objItem.fechaFin == '' || objItem.fechaFin == undefined) {
		validado = false;
	}
	if (objItem.incremento == '' || objItem.incremento == undefined) {
		validado = false;
	}

	if (objItem.empresas.length <= 0) {
		validado = false;
	}

	if (objItem.ofertas_x_usuarios == '' || objItem.ofertas_x_usuarios == undefined) {
		validado = false;
	}else{

		try{
			objItem.ofertas_x_usuarios = Number(objItem.ofertas_x_usuarios);
		}catch(err){
			validado = false;
		}
	}
	
	if (objItem.autos_x_usuario == '' || objItem.autos_x_usuario == undefined) {
		validado = false;
	}else{

		try{
			objItem.autos_x_usuario = Number(objItem.autos_x_usuario);
		}catch(err){
			validado = false;
		}
	}

	if (!validado) {

		alert("Favor de llenar todos los campos requeridos");

	}
	return validado;
}

function buscaEmpresa() {

	var txtDesc = $("#txtNombreEmpresa").val().toUpperCase();
	var tipomsj = "una Empresa";
	var elemento = $('#cmbEmpresas').find("option:icontains('" + txtDesc + "')");

	if ($(elemento[0]).text().toUpperCase() == txtDesc) {
		$("#labelMsjEmpresa").text('Ya existe ' + tipomsj + ' con este nombre');

		$("#btnGuardaEmpresa").attr('idEmpresa', $(elemento[0]).val());

		$('#btnEliminaEmpresa').attr('idEmpresa', $(elemento[0]).val());
		$('#btnEliminaEmpresa').attr('estatus', '0');
		$("#btnEliminaEmpresa").show();

	} else {
		$('#labelMsjEmpresa').text('');
		$('#btnGuardaEmpresa').attr('idEmpresa', '0');

		$('#btnEliminaEmpresa').attr('idEmpresa', '0');
		$('#btnEliminaEmpresa').attr('estatus', '1');
		$('#btnEliminaEmpresa').hide();

	}

}

