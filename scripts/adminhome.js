function CargaFuncionesAdminHome(){

	$(".divTxtUrl").hide();

	postrequest("seccioneshome/listar?rand="+Math.random(), {"esheader":0}, function(data){
      
      debugger;
      $("#divAdminHomeContenido").html("");  
      for (i in data){

      		var html = "<div class=\"divRegistro\">";
			html += "		<label>"+data[i].descripcion+"</label>";      		
      		if(data[i].esimg == 1){
        
            	
            	html += "<img style=\"width:300px;\" src=\""+data[i].url+ "\" />";
    		

    		}else{

    			html += "<iframe id=\"videoTips\" width=\"300px\"  src=\"" +data[i].url+"\" frameborder=\"0\" allowfullscreen style=\"overflow: hidden; \" height=\"100%\" width=\"100%\"></iframe>";
    		}
    		html += "<div class=\"fa fa-wrench fa-2 btnEditarSeccionHome\" attr-id=\"" + data[i].id+ "\" attr-esimg=\""+data[i].esimg +" \" attr-esheader=\""+data[i].esheader +" \" aria-hidden=\"true\"></div>";
    		html += "</div>";
    		$("#cmbSeccion").append("<option value=\"" +data[i].id+ "\" attr-id=\"" + data[i].id+ "\" attr-esimg=\""+data[i].esimg +" \" attr-esheader=\""+data[i].esheader +" \" attr-ancho=\""+data[i].ancho +"\" attr-alto=\""+data[i].alto +" \" >" + data[i].descripcion + "</option>");
    		$("#divAdminHomeContenido").append(html);
      }

    });

	$("#cmbTipoContenido").change(function(){ 
		

	});

    $(".btnEditarSeccionHome").click(function(){

    
    	$("#cmbSeccion").val($(this).attr("attr-id"));
    	$("#cmbTipoContenido").val($(this).attr("attr-esimg"));
    	$("#cmbUbicacion").val($(this).attr("attr-esheader"));
    	
    	
    })

    function HabilitaControles(tipoContenido){
    	if(tipoContenido == 0){
			$(".divTxtUrl").show();
			$(".divUploadFile").hide();

		}else{
			$(".divTxtUrl").hide();
			$(".divUploadFile").show();
		}

    }

    $("#btnUploadFile").click(function() {
		    
		    var file_data = $('#uploadFile').prop('files')[0];   
		    var form_data = new FormData();                  
		    form_data.append('file', file_data);
		    form_data.append('accion', 'home');
		    form_data.append('idsubasta', 0);
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

