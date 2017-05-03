function CargaFuncionesAdminHome(){

	$(".divTxtUrl").hide();
	$("#divLink").hide();
	
	postrequest("seccioneshome/listar?rand="+Math.random(), {"esheader":0}, function(data){
      $("#cmbSeccionesHome").html("");
      $("#cmbSeccionesHome").append("<option value='0' selected='selected'>== Seleccione ==</option>");
      $("#divAdminHomeContenido").html("");  
      var html = "";
      for (i in data){
      		html = "";
      		html = "<div class=\"divRegistro\">";
			html += "		<label>"+data[i].descripcion+"</label>";      		
      		if(data[i].esimg == 1){
        
            	
            	html += "<img style=\"width:300px;\" src=\""+data[i].url+ "\" />";
    		

    		}else{

    			html += "<iframe id=\"videoTips\" width=\"300px\"  src=\"" +data[i].url+"\" frameborder=\"0\" allowfullscreen style=\"overflow: hidden; \" height=\"100%\" width=\"100%\"></iframe>";
    		}
    		html += "<div class=\"fa fa-wrench fa-2 btnEditarSeccionHome\" attr-id=\"" + data[i].id+ "\" attr-esimg=\""+data[i].esimg +"\" attr-esheader=\""+data[i].esheader +"\" attr-ancho=\""+data[i].ancho +"\" attr-alto=\""+data[i].alto +"\" attr-tag=\""+data[i].tag +"\" attr-url=\""+data[i].url+"\" attr-eslink=\""+ data[i].eslink +"\" attr-link=\""+ data[i].eslink +"\" aria-hidden=\"true\"></div>";
    		html += "</div>";
    		$("#cmbSeccionesHome").append("<option value=\"" +data[i].id+ "\" attr-id=\"" + data[i].id+ "\" attr-esimg=\""+data[i].esimg +"\" attr-esheader=\""+data[i].esheader +"\" attr-ancho=\""+data[i].ancho +"\" attr-alto=\""+data[i].alto +"\" attr-tag=\""+data[i].tag +"\" attr-url=\""+data[i].url+"\" >" + data[i].descripcion + "</option>");
    		$("#divAdminHomeContenido").append(html);
      }

    });

    $("#cmbSeccionesHome").change(function(){ 
    	
    	fncEditaControles($("#cmbSeccionesHome option:selected"));

    });

	$("#cmbTipoContenido").change(function(){ 
		
		HabilitaControles($(this).val());
	});

    $(".btnEditarSeccionHome").click(function(){

    	fncEditaControles($(this));
    	
    });
    $("#chkeslink").change(function(){
    	if($(this).is(':checked')){
    		$("#divLink").show();
    	}else{
    		$("#divLink").hide();
    	}
    });

    
    function fncEditaControles(o){
    	$("#cmbSeccionesHome").val($(o).attr("attr-id"));
    	$("#cmbTipoContenido").val($(o).attr("attr-esimg"));
    	$("#txtTag").val($(o).attr("attr-tag"));
    	$("#txtUrl").val($(o).attr("attr-url"));
    	$("#btnUploadHome").attr("attr-id", $(o).attr("attr-id"));
    	HabilitaControles($(o).attr("attr-esimg"));
    	$("#cmbUbicacion").val($(o).attr("attr-esheader"));
		$("#txtAncho").val($(o).attr("attr-ancho"));
		$("#txtAlto").val($(o).attr("attr-alto"));
    }

    function HabilitaControles(tipoContenido){
    	if(tipoContenido == 0){
			$(".divTxtUrl").show();
			$(".divUploadFile").hide();

		}else{
			$(".divTxtUrl").hide();
			$(".divUploadFile").show();
		}

    }

    $("#bntActualizar").click(function(){
    	postrequest("seccioneshome/update?rand="+Math.random(), {}, function(data){
    		if(data.startsWith == "OK"){
    			alert("Se actualizó la información del home");
    		}else{
    			alert("Error al actualizar la información del home");
    		}
    	});

    });

    $("#btnUploadHome").click(function() {
		    
		    var file_data = $('#uploadFile').prop('files')[0];   
		    var form_data = new FormData();                  
		    form_data.append('file', file_data);
		    form_data.append('accion', 'home');
		    form_data.append('id', $(this).attr("attr-id"));
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
		                		alert("La operación se realizó correctamente");
		                		var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
								$("#uploadedFile").val(filename);
		                		
		                	}
		                    
		                }
		     });
		    
		});
}

