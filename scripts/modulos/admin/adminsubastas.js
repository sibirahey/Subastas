
function CargaFunciones(){

	switch(fnToLoad){
		case "subastasadmin":
			CargaFuncionesAdminSubastas();
			break;
		case "homeadmin":
			CargaFuncionesAdminHome();
			break;
	}

}

function LimpiarSubasta(){

	$("#txtNombreSubasta").val("");
	$("#txtIncremento").val("");
	$("#lstEmpresa").html("");
	$("#cmbEmpresas").val(-1);
	$("#btnGuardarSubasta").attr("attr-idsubasta","0");
	CargaSubastas(-1,-1);
}

//Administrador Subastas

function AgregaEmpresa(idEmpresa, nombreEmpresa){

	$("#lstEmpresa").append("<div attr-idx='"+idEmpresa+"' class='empresasSeleccionadas divRegistro'>"+nombreEmpresa+"</div>")
}
function CargaFuncionesAdminSubastas(){

	$("#modalEmpresa").hide();		
	$(".divHeaderContenido").hide();
	$("#txtFechaInicio" ).datepicker();
	$("#txtFechaFin" ).datepicker();
	$("#divRegistroAutos").hide();


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
			AgregaEmpresa($("#cmbEmpresas option:selected").val(), $("#cmbEmpresas option:selected").text());
		
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
		oSubastas.incremento = $("#txtIncremento").val(); 
		if($(this).attr("attr-idsubasta") == "0"){
			oSubastas.idSubasta = 0;
		}else{

			oSubastas.idSubasta = $(this).attr("attr-idsubasta");
		}
		

		$.each( $(".empresasSeleccionadas"), function( key, value ) {
		  
		  
		  oSubastas.empresas.push( $(value).attr("attr-idx"));
		});
		

		console.log(JSON.stringify(oSubastas));
		postrequest("subastas/guardar", oSubastas, function(data){
			debugger;
			if(data > 0){
				alert("La subasta fue creada con éxito");
				CargaSubastas(-1,-1);

			}
		});

	});





	$("#btnFiltrar").click(function() {
		
			CargaSubastas( $("#cmbPublicada option:selected").val() ,$("#cmbEmpresasFiltro option:selected").val());
			
	});
	$("#btnAgregarSubasta").click(function(){
		if($(".divHeaderContenido").css("display") == "none"){
			$(".divHeaderContenido").show();
			$("#btnAgregarSubasta").attr("class",$("#btnAgregarSubasta").attr("class").replace("-down","-up"));
		}else{
			$(".divHeaderContenido").hide();
			$("#btnAgregarSubasta").attr("class",$("#btnAgregarSubasta").attr("class").replace("-up","-down"));;

		}
	
	});

	$("#btnAgregaAuto").click(function(){
		if($("#divRegistroAutos").css("display") == "none"){
			$("#divRegistroAutos").show();
			$("#btnAgregaAuto").attr("class",$("#btnAgregaAuto").attr("class").replace("-down","-up"));
		}else{
			$("#divRegistroAutos").hide();
			$("#btnAgregaAuto").attr("class",$("#btnAgregaAuto").attr("class").replace("-up","-down"));;

		}
	
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
	postrequest("subastas/listar", {"estatus":estatus, "empresa":  empresa, "subastaId":-1 }, function(data){
		$("#divListaContenido").html("");	
		for (i in data){
			var div = '';
			div += '<div class="divRenglonTabla">';
			div += '	<div>';
			div += '		<label>Subata: </label><label>'+data[i].nombreSubasta + "</label>";
			div += '	</div>';
			div += '	<div>';
			div += '		<div type="button" class="fa fa-pencil-square-o fa-2x button btnEditarSubasta" attr-id="' + data[i].idSubasta +'" alt="editar" ></div>';
			div += '		<div attr-id="' + data[i].idSubasta +'" attr-nombresubasta="'+data[i].nombreSubasta+'" class="btnAdministraAutos fa fa-plus-circle fa-2x button" text="administrar autos" ></div>';
			div += '		<div attr-id="' + data[i].idSubasta +'" attr-nombresubasta="'+data[i].nombreSubasta+'" class="btnVerAutos fa fa-car fa-2x button" text="administrar autos" ></div>';
			div += '	</div>';
			div += '	<div><label>Tipo de subasta: </label>'+data[i].tipoSubasta+'</div>';		
			div += '	<div><label>Vigencia: </label>'+data[i].fechaInicio+' - ' + data[i].fechaFin +'</div>';		
			div += '	<div><label>Estatus: </label>'+data[i].estatus + '</div>';		
			div += '	<div><label>Empresas:</label>'+data[i].empresas + '</div>';		
			div += '	<div><label>Publicada:</label>'+data[i].publicada + '<input type="checkbox" attr-id="' + data[i].idSubasta +'" class="btnPublicar" '+ ((data[i].visible == 0) ? "" : "checked" )+ ' /></div>';
			div += '	<div></div>';	
			div += '</div>';

			$("#divListaContenido").append(div);
		}

		
		
		$(".btnAdministraAutos").click(function(){
			 var nombreSubasta = $(this).attr("attr-nombresubasta");
			 var idSubasta = $(this).attr("attr-id");

			 
			if(idSubasta > 0){
			 	$( "#divRegistroAutos").load( "views/main/admin/altaautos.html?rand="+Math.random(), function() {
			 		 

			 		 $("#divRegistroAutos").show();
			 		 $("#btnAgregaAuto").attr("class",$("#btnAgregaAuto").attr("class").replace("-down","-up"));
			 		 $("#divSubastaNombre").html(nombreSubasta);
			 		 $("#divSubastaNombre").show();
			 		 $("#divSubastaNombre").css("display","");
		 		 	 $("#btnGuardaAuto").attr("attr-nombresubasta", nombreSubasta);
			 		 $("#btnGuardaAuto").attr("attr-subastaid", idSubasta);
			 		 CargaFuncionesRegistroAuto();
			 		 
				 });
			 }
		});

		$(".btnVerAutos").click(function(){
		 	var nombreSubasta = $(this).attr("attr-nombresubasta");
			 var idSubasta = $(this).attr("attr-id");

			 cargaAutosPorSubasta(idSubasta, "#divAutos" );


		});

		$(".btnEditarSubasta").click(function(){
			
			CargaInfoSubasta($(this).attr("attr-id"));

		});

		

		function CargaInfoSubasta(idSubasta){

			postrequest("subastas/listar", {"estatus":-1, "empresa":  -1, "subastaId":idSubasta }, function(data){
				
				$("#txtNombreSubasta").val(data[0].nombreSubasta);
				var parts = data[0].fechaInicio.split('-');
				var parts2 = data[0].fechaFin.split('-');
				
				$("input[name=tiposubastas][value=" + data[0].idTipoSubasta + "]").attr('checked', 'checked');
				$('#txtFechaInicio').datepicker("setDate", parts[1]+"/"+parts[2]+"/"+parts[0]);
				$('#txtFechaFin').datepicker("setDate", parts2[1]+"/"+parts2[2]+"/"+parts2[0]);
				$("#txtIncremento").val(data[0].incremento);
				$("#btnGuardarSubasta").attr("attr-idsubasta", data[0].idSubasta);
				$("#lstEmpresa").html("");
				var empresas = data[0].empresas.split(',');
				var empresasIds = data[0].empresasId.split(',');
				for(var i = 0; i < empresas.length; i++){
					AgregaEmpresa(empresasIds[i], empresas[i]);

				}



				
				
			});
		}



		$(".btnPublicar").click(function(){
			var visible = ($(this).prop("checked")) ? 1 : 0; 
			var idSubasta = $(this).attr("attr-id");

			oSubastas = new Subastas();
			oSubastas.idSubasta = idSubasta;
			oSubastas.visible = visible;
			postrequest("subastas/publicar", oSubastas, function(data){

				if(data > 0){
				alert("La operación se realizó exitosamente");
			}
			})
			

		});
		
	
	}); //end postrequest
}


//Home
function CargaFuncionesAdminHome(){

}
