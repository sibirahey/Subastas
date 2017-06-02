var typingTimer;
var doneTypingIntervalo = 1000;


function CargaFuncionesRegistroAuto(idSubasta){
	$("#dialog").modal();
	$('#btnActualizaCatalogo').hide();
	$('#btnEliminaCatalogo').hide();
	$('#labelMensaje').hide();
	$("#cbAnioAuto").html(CargaAnioAutos(0));
	$("#cbAnioAuto").material_select();
	$("#btnAddModelo").hide();
	$("#btnAddFeature").click(function(){
		
		$("#divFeatureContainer").append(
			"<div class='feature btn light-blue lighten-2' attr-featureid='" + $("#cbFeaturesAutos").val() + "' attr-id='feature-"+$("#cbFeaturesAutos").val()+"'>"+
			"<i class='material-icons orange-text darken-2' onclick='removeFeature(this);' attr-id='" +$("#cbFeaturesAutos").val()+ "' attr-text='"+ $("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").text()+"'>cancel</i>"+
			"<span>"+ 
			$("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").text() + 
			"</span></div>"
		);	
		
		$("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").remove();
		$('.cbFeaturesAutos').find('.select-dropdown').val('');
		$('select').material_select();
	});

	
	CargaSelectEstados("#cbEstadoAuto");
	CargaSelectMunicipios("#cbCiudadAuto", $("#cbEstadoAuto").val());
	CargaSelectMarcas("#cbMarcaAuto", 0,1);
	CargaSelectModelos("#cbModeloAuto", "#cbMarcaAuto", 0, 1);
	CargaSelectTipoTransmision("#cbTipoTransmisionAuto", 0, 1);
 	CargaSelectFeatures("#cbFeaturesAutos","",1);
	
	
	
	$("#cbCiudadAuto").append("<opcion value='0'>== Seleccione == </option>");
	$("#cbEstadoAuto").change(function() {
		CargaSelectMunicipios("#cbCiudadAuto", $("#cbEstadoAuto").val());
	});
	$("#cbFeaturesAutos").change(function(){
		if($(this).val() > 0){
			$("#btnAddFeature").removeClass('disabled');
			
		}
	});
	$("#cbMarcaAuto").change(function(){
		if($(this).val() >0){
			$("#btnAddModelo").show();
		}else{

			$("#btnAddModelo").hide();

		}
		$("#btnAddMarca").attr('idItem',$(this).val());
		$("#btnAddMarca").attr('Nombre',$(this).val());
		CargaSelectModelos("#cbModeloAuto", "#cbMarcaAuto", 0, 1);
	});
	
	$('.fotoAuto').find('.file-path').change(function(){
		$("#btnUpload").addClass('pulse');
	});
	
	$("#btnUpload").click(function() {
		    
		    var file_data = $('#fotoAuto').prop('files')[0];   
		    var form_data = new FormData();                  
		    form_data.append('file', file_data);
		    $.ajax({
		                url: 'upload.php', // point to server-side PHP script 
		                dataType: 'text',  // what to expect back from the PHP script, if anything
		                cache: false,
		                contentType: false,
		                processData: false,
		                data: form_data,                         
		                type: 'post',
		                success: function(php_script_response){

		                
		                	if(php_script_response.substring(0, 2) == "ERR"){
								alert(php_script_response);
								

		                	}else{
		                		debugger;
		                		var filename = $("#fotoAuto").val().replace(/C:\\fakepath\\/i, '');
								$("#fotosSubidas").append("<div class='fotosAuto' attr-id='"+php_script_response.trim()+"'><img  class='materialboxed' data-caption='"+filename+"' width='100px' src='" + siteurl +  "uploads/" + php_script_response.trim() + "' /><span>"+filename+"</span></div>");
								clearFileInput('fotoAuto');
		                		$('.materialboxed').materialbox();
		                	}
		                    
		                }
		     });
		     $("#btnUpload").removeClass('pulse');
      $('.fotoAuto').find('.file-path').val('');
		    
		});
	    
	 
	  SoloNumericos("#precioAuto");
	  SoloNumericos("#cbKMAuto");


	$("#btnGuardaAuto").click(function (){
		
		GuardaDetalleAuto("guardar");
	});
	
	CargaSelectColores("#cbColorAuto", 0, 1);
	
	
   	$("#btnAddMarca").add("#btnAddModelo").add("#btnAddColor").add("#btnAddCaracteristicas").click(function(){
   		debugger;
   		$('#labelMensaje').hide();
   		$("#txtDescripcion").val("");
   		$("#labelMensaje").text("");
   		$('#btnActualizaCatalogo').hide();
		$('#btnEliminaCatalogo').hide();
		$( "#dialog" ).attr("title", $(this).attr("title"));
		$( "#dialog" ).attr("operacion", $(this).attr("operacion") );
   		$("#labelTxtDescripcion").html($(this).attr("desc"));
   		$( "#dialog" ).modal("open");
   });


    $("#btnGuardarCatalogo").add("#btnActualizaCatalogo").add('#btnEliminaCatalogo').click(function(){
   		
   		oObj = null;
   		var operacion = $( "#dialog" ).attr("operacion");
   		
   		switch(operacion){
   			case "marcas":
   				oObj = new Marca();
				break;
			case "modelos":
				oObj = new Modelo();
				oObj.idMarca = $("#cbMarcaAuto").val();
				if ($("#cbMarcaAuto").val() == 0 ){
					alert("Seleccione una marca para poder agregar el modelo.");
					return;
				}
   			break;
   			case "colores":
   				oObj = new Colores();
   				break;
   			case "features":
   				oObj = new Caracteristicas();
   				break;
   			default:
   			 alert("Operación no valida");
   			 break;

   		}


   		oObj.estatus = 1;
   		if($(this).attr('idMarca') >0){
   			oObj.id = $(this).attr('idMarca');
   			if($(this).attr('estatus')==0)
   				oObj.estatus = 0;
   		}
   		else{
   			oObj.id = 0;
   		}
   		
   		oObj.descripcion = $("#txtDescripcion").val();
   			
   			

   		postrequest($( "#dialog" ).attr("operacion")+"/guardar", oObj, function(data){
   			if(data > 0){
				alert("La operación se realizó con éxito");
				if($( "#dialog" ).attr("operacion") == "marcas"){
					$("#cbMarcaAuto").html("");
					CargaSelectMarcas("#cbMarcaAuto", 0,1);
				}
				if($( "#dialog" ).attr("operacion") == "modelos"){
					$("#cbModeloAuto").html("");
					CargaSelectModelos("#cbModeloAuto", "#cbMarcaAuto", 0, 1);
				}
				if($( "#dialog" ).attr("operacion") == "colores"){
					$("#cbColorAuto").html("");
					CargaSelectColores("#cbColorAuto", 0, 1);
				}
				if($( "#dialog" ).attr("operacion") == "features"){
					$('#cbFeaturesAutos').material_select("destroy");
					$("#cbFeaturesAutos").html("");
					CargaSelectFeatures("#cbFeaturesAutos","",1);
					$('#cbFeaturesAutos').material_select();
					$('#cbFeaturesAutos').val();
				}

				

			}
			$('#dialog').modal('close');
   		});

   });
	
	eventoFinalizaEscritura('#txtDescripcion',buscaexistente,typingTimer,doneTypingIntervalo);



}
function buscaexistente(){

	var txtDesc=$("#txtDescripcion").val().toUpperCase();
	var tipomsj = "";
	var elemento;
	switch($( "#dialog" ).attr("operacion") ){
		case "marcas":
			tipomsj = "una Marca";
			elemento = $('#cbMarcaAuto').find("option:icontains('"+txtDesc+"')");
		break;
		case "modelos":
			tipomsj = "un Modelo";
			elemento = $('#cbModeloAuto').find("option:icontains('"+txtDesc+"')");
		break;

		case "colores":
			tipomsj = "un Color";
			elemento = $('#cbColorAuto').find("option:icontains('"+txtDesc+"')");
		break;

		case "features":
			tipomsj = "una Característica";
			elemento = $('#cbFeaturesAutos').find("option:icontains('"+txtDesc+"')");
		break;
	}

	if (elemento.text().toUpperCase() == txtDesc ){
		$('#labelMensaje').append('<i class="material-icons red-text">warning</i><span>Ya existe '+tipomsj+' con este nombre</span>');
		$('#labelMensaje').show();
		$('#btnActualizaCatalogo').attr('idMarca',elemento.val());
		$("#btnActualizaCatalogo").show();
		
		$('#btnEliminaCatalogo').attr('idMarca',elemento.val());
		$('#btnEliminaCatalogo').attr('estatus','0');
		$("#btnEliminaCatalogo").show();
		

	}else{
		$('#labelMensaje').text('');
		$('#btnActualizaCatalogo').attr('idMarca','0');
		$('#btnActualizaCatalogo').hide();

		$('#btnEliminaCatalogo').attr('idMarca','0');
		$('#btnEliminaCatalogo').attr('estatus','1');
		$('#btnEliminaCatalogo').hide();
		

		
	}


}

function removeFeature(o){
	$("#cbFeaturesAutos").append('<option value="'+$(o).attr("attr-id")+'" >' + $(o).attr("attr-text") + '</option>' );
	$(o).parent().remove();
	$('select').material_select();	
}
function clearFileInput(id) 
{ 
    var oldInput = document.getElementById(id); 

    var newInput = document.createElement("input"); 

    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    // TODO: copy any other relevant attributes 

    oldInput.parentNode.replaceChild(newInput, oldInput); 
}

function validatextoVacio(inputElement,elementobloq){

  $(inputElement).blur(function(){

      if($(this).length ==0){
      		$(elementobloq).prop("disabled",true);
      }else{
      	$(elementobloq).prop("disabled", false);
      }

  });

}


function validaCamposAltaAutos(item){
	debugger;
	var validado = true;
		if (item.precio == '' || item.precio == undefined){
			validado = false;
		}
		if (item.marca == '' || item.marca == undefined || item.marca == '0'){
			validado = false;
		}
		if (item.modelo == '' || item.modelo == undefined || item.modelo == '0'){
			validado = false;
		}
		if (item.color == '' || item.color == undefined || item.color == '0'){
			validado = false;
		}
		if (item.anio == '' || item.anio == undefined){
			validado = false;
		}
		if (item.km == '' || item.km == undefined){
			validado = false;
		}
		if (item.transmision == '' || item.transmision == undefined || item.transmision == '0'){
			validado = false;
		}
		if (item.estado == '' || item.estado == undefined || item.estado == '0'){
			validado = false;
		}
		if (item.ciudad == '' || item.ciudad == undefined || item.ciudad == '0'){
			validado = false;
		}


		if (!validado){
			alert("Favor de llenar todos los campos requeridos");
		}
		return validado;

}
