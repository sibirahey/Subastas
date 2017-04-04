function CargaFuncionesRegistroAuto(idSubasta){
	$("#dialog").hide();
	$("#cbAnioAuto").html(CargaAnioAutos(0));
	$("#btnAddFeature").click(function(){
		
		$("#divFeatureContainer").append(
			"<div class='feature' attr-featureid='" + $("#cbFeaturesAutos").val() + "' attr-id='feature-"+$("#cbFeaturesAutos").val()+"'>"+
			"<span onclick='removeFeature(this);' class='fa fa-times' attr-id='" +$("#cbFeaturesAutos").val()+ "' attr-text='"+ $("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").text()+"'>"+ 
			$("#cbFeaturesAutos option[value='"+$("#cbFeaturesAutos").val()+"']").text() + 
			"</span></div>"
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

		                		var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
								$("#fotosSubidas").append("<div class='fotosAuto' attr-id='"+php_script_response+"'><span>"+filename+"</span><img width='100px' src='" + siteurl +  "uploads/" + php_script_response + "' /></div>");
								clearFileInput('fotoAuto');
		                		
		                	}
		                    
		                }
		     });
		    
		});

	$("#btnGuardaAuto").click(function (){
		oAuto = new Autos();
		oAuto.idAuto = $("#btnGuardaAuto").attr("attr-idsubasta");
		if(parseInt($("#btnGuardaAuto").attr("attr-idsubasta")) > 0){
			oAuto.enVenta  = 0;
		}else{
			oAuto.enVenta = 1;

		}
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

		

		$.each( $(".feature"), function( key, value ) {
			  oAuto.features.push( $(value).attr("attr-featureid"));
		});

		$.each( $(".fotosAuto"), function( key, value ) {
			  oAuto.fotos.push( $(value).attr("attr-id"));
		});
		

		postrequest("autos/guardar", oAuto, function(data){

			debugger;
			if(data > 0){
				alert("Los datos se guardaron correctamente");
				//CargaSubastas(-1,-1);
			}else{
				alert("Ocurrió un error al guardar");

			}
		});




	});
		CargaSelectColores("#cbColorAuto", 0, 1);
	
	
   		$("#btnAddMarca").click(function(){
		$( "#dialog" ).attr("title", "Agregar Marca");
		$( "#dialog" ).attr("operacion", "marcas" );
   		$("#labelTxtDescripcion").html("Marca:");
   		$( "#dialog" ).dialog();

   		
   		

   });
   $("#btnGuardarCatalogo").click(function(){
   		
   		oObj = null;
   		if($( "#dialog" ).attr("operacion") == "marcas"){

   			oObj = new Marca();

   			oObj.id = 0;
			oObj.descripcion = $("#txtDescripcion").val();
			oObj.estatus = 1;
   		}
   		postrequest($( "#dialog" ).attr("operacion")+"/guardar", oObj, function(data){
   			if(data > 0){
				alert("La operación se realizó con éxito");
				if($( "#dialog" ).attr("operacion") == "marcas"){
					$("#cbMarcaAuto").html("");
					CargaSelectMarcas("#cbMarcaAuto", 0,1);
					( "#dialog" ).dialog('close');
				}

			}

   		});

   });
   
	


}
function removeFeature(o){

		$("#cbFeaturesAutos").append('<option value="'+$(o).attr("attr-id")+'" >' + $(o).attr("attr-text") + '</option>' );
		$(o).parent().remove();
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

clearFileInput("fileInput");
