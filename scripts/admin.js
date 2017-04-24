
function CargaFunciones(){

	switch(	){
		case "subastasadmin":
			CargaFuncionesAdminSubastas();
			break;
		case "homeadmin":
			CargaFuncionesAdminHome();
			break;
	}

}

//Administrador Subastas
function CargaFuncionesAdminSubastas(){

	$("#modalEmpresa").hide();		
	$( "#txtFechaInicio" ).datepicker({ minDate: 0});
	$( "#txtFechaFin" ).datepicker(	{ minDate: +1});

	$("#btnNuevaEmpresa").click(function(){
	  		
			$("#modalEmpresa").dialog({
	        	height:200,
	        	width:500,
	        	modal:true,
	        	title: "Agrega empresa",
	        	buttons: {
			        Cerrar: function() {
			          $( this ).dialog( "close" );
			        }, 

			      }
		        });

	  	});
	$("#btnAgregaEmpresa").click(function () {
		if($("#cmbEmpresas option:selected").val() > 0)
		
		$("#lstEmpresa").append("<div attr-idx='"+$("#cmbEmpresas option:selected").val()+"' class='empresasSeleccionadas divRegistro'>"+$("#cmbEmpresas option:selected").text()+"</div>")
	});
	$("#btnGuardaEmpresa").click(function(){
		postrequest("empresas/guardar", {"nombreEmpresa": $("#txtNombreEmpresa").val(),"estatus":"1"}, function(data){
			debugger;
			if(data > 0){
				alert("La empresa se agregó correctamente");
				CargaEmpresas(data);
				$("#modalEmpresa").dialog("close");

			}else{
				alert("Ocurrió un error al agregar la empresa");

			}
		});

	});
	$("#btnGuardarSubasta").click(function(){
		
		oSubastas = new Subastas();
		oSubastas.nombreSubasta = $("#txtNombreSubasta").val();
		oSubastas.IdTipoSubasta = $('input[name=tiposubastas]:checked').val();
		oSubastas.fechaInicio = $("#txtFechaInicio").datepicker('getDate').getFullYear() + "-"+($("#txtFechaInicio").datepicker('getDate').getMonth() + 1)+"-"+$("#txtFechaInicio").datepicker('getDate').getDate();
		oSubastas.fechaFin = $("#txtFechaFin").datepicker('getDate').getFullYear() + "-"+($("#txtFechaFin").datepicker('getDate').getMonth() + 1)+"-"+$("#txtFechaFin").datepicker('getDate').getDate();;
		oSubastas.empresas = [];
	
		
		$.each( $(".empresasSeleccionadas"), function( key, value ) {
		  
		  oSubastas.empresas.push( $(value).attr("attr-idx"));
		  
		});
		

		console.log(JSON.stringify(oSubastas));
		postrequest("subastas/guardar", oSubastas, function(data){
			debugger;
			if(data > 0){
				alert("La subasta fue creada con éxito");
			}
		});

	});


	$("#btnFiltrar").click(function() {
		alert("entro");
			CargaSubastas( $("#cmbPublicada option:selected").val() ,$("#cmbEmpresasFiltro option:selected").val());
			
	});

	CargaEmpresas(0);
	CargaTipoSubastas();
	CargaSubastas(-1, -1);
	
}



function CargaEmpresas(idx){
	
	$("#cmbEmpresas").html("");
	$("#cmbEmpresas").append('<option value="-1"> == Seleccione ==</div>' );
	$("#cmbEmpresasFiltro").append('<option value="-1"> == TODAS ==</div>' );
	
	postrequest("empresas/listar", {"estatus":"1"}, function(data){
        var selected = "";
      for (i in data){
      	selected = (data[i].idEmpresa == idx) ? 'selected="selected"' : "";
        $("#cmbEmpresas").append('<option value="'+data[i].idEmpresa+'" '+selected+ '>'+data[i].nombreEmpresa +"</option>" );
        $("#cmbEmpresasFiltro").append('<option value="'+data[i].idEmpresa+'">' + data[i].nombreEmpresa + ' </option>' );
      }

    });

	$("#cmbEmpresas").val(idx);
}
function CargaTipoSubastas(estatus){
	postrequest("tiposubastas/listar", {"estatus":"1"}, function(data){
		for (i in data){
			$("#divTipoSubastas").append('<div class="divRegistro"><input type="radio" name="tiposubastas" id="tiposubastas" value="'+data[i].idTipo+'" >'+data[i].tipoSubasta+'</input></div>');
		}
	});

}

function CargaSubastas(estatus, empresa){
	postrequest("subastas/listar", {"estatus":estatus, "empresa":  empresa }, function(data){
		$("#divListaContenido").html("");	
		for (i in data){
			var div = '';
			div += '<div class="divRenglonTabla">';
			div += '	<div><label>Subata: </label>'+data[i].nombreSubasta+ '<input type="button" attr-id="' + data[i].idSubasta +'" class="btnEditar" text="editar" /><input type="button" attr-id="' + data[i].idSubasta +'" class="btnAgregar" text="administrar autos" /></div>';
			div += '	<div><label>Tipo de subasta: </label>'+data[i].tipoSubasta+'</div>';		
			div += '	<div><label>Vigencia: </label>'+data[i].fechaInicio+' - ' + data[i].fechaFin +'</div>';		
			div += '	<div><label>Estatus: </label>'+data[i].estatus + '</div>';		
			div += '	<div><label>Empresas:</label>'+data[i].empresas + '</div>';		
			div += '	<div><label>Publicada:</label>'+data[i].publicada + '<input type="checkbox" attr-id="' + data[i].idSubasta +'" class="btnPublicar" '+ ((data[i].visible == 0) ? "" : "checked" )+ ' /></div>';
			div += '	<div></div>';	
			div += '</div>';

			$("#divListaContenido").append(div);
		}
	});

}


//Home
function CargaFuncionesAdminHome(){

	
	
}
