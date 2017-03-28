function CargaFuncionesRegistroAuto(){
	$("#dialog").hide();
	$("#cbAnioAuto").html(CargaAnioAutos(0));
	$("#btnAddFeature").click(function(){
		$("#divFeatureContainer").append(
			"<div class='feature' attr-id='feature-"+("#cbFeaturesAutos").val()+"'><span onclick='removeFeature(this);' class='fa fa-times' attr-id='" +$("#cbFeaturesAutos").val()+ "' attr-text='"+ $("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").text()+"'>"+ $("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").text() + "</span></div>"

			);
		$("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").remove();

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

	$("#cbMarcaAuto").change(function(){

		CargaSelectModelos("#cbModeloAuto", "#cbMarcaAuto", 0, 1);
	});

	 $("#btnUpload").click(function() {
		    alert("entro")
		    
		    var file_data = $('#fotoAuto').prop('files')[0];   
		    var form_data = new FormData();                  
		    form_data.append('file', file_data);
		    alert(form_data);                             
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

		                		var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
								$("#fotosSubidas").append("<div id='file' attr-id='"+php_script_response+"'>"+filename+"</div>");
								clearFileInput('fotoAuto');
		                		alert(php_script_response);
		                	}
		                    
		                }
		     });
		    
		});
	CargaSelectColores("#cbColorAuto", 0, 1);
	
	
   $("#btnAddMarca").click(function(){
		$( "#dialog" ).attr("title", "Agregar Marca");
		$( "#dialog" ).attr("operacion", "marcas" );
   		$( "#dialog" ).dialog();
   		

   });
   $("#btnGuardarCatalogo").click(function(){
   		postrequest($( "#dialog" ).attr("operacion")+"/guardar", {"nombreEmpresa": $("#txtNombreEmpresa").val(),"estatus":"1"}, function(data){


   		});

   });
   
	


}
function removeFeature(o){

		$("#cbFeaturesAutos").append('<option value="'+$(o).attr("attr-id")+'" >' + $(o).attr("attr-text") + '</option>' );
		$(o).parent().remove();
}
/*
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

clearFileInput("fileInput");

*/
