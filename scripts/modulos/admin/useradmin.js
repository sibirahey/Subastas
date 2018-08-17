function cargaFuncionesUserAdmin(){
    CargaFuncionesRegistroComun();
    cargaFuncionesRegistro();
/*

    postrequest("seccioneshome/listar?rand="+Math.random(), {"esheader":0}, function(data){
        $("#cmbSeccionesHome").material_select("destroy");
        $("#cmbSeccionesHome").html("");
        $("#cmbSeccionesHome").append("<option value='0' selected='selected'>== Seleccione ==</option>");
        $("#divAdminHomeContenido").html("");  
        var html = "";
        for (i in data){
            html = "";
            html = "<div>";
            html += "       <label>"+data[i].descripcion+"</label>";            
            if(data[i].esimg == 1)
            { 
                html += "<img style=\"width:300px;\" src=\""+data[i].url+ "\" />";
            
            }else{

                html += "<iframe id=\"videoTips\" width=\"300px\"  src=\"" +data[i].url+"\" frameborder=\"0\" allowfullscreen style=\"overflow: hidden; \" height=\"100%\" width=\"100%\"></iframe>";
            }
            html += "<div class=\"waves-effect waves-light btn btnEditarSeccionHome\" attr-id=\"" + data[i].id+ "\" attr-esimg=\""+data[i].esimg +"\" attr-ubicacion=\""+data[i].ubicacion +"\" attr-ancho=\""+data[i].ancho +"\" attr-alto=\""+data[i].alto +"\" attr-tag=\""+data[i].tag +"\" attr-url=\""+data[i].url+"\" attr-eslink=\""+ data[i].eslink +"\" attr-link=\""+ data[i].link +"\" aria-hidden=\"true\"><i class='material-icons'>edit</i></div>";
            html += "</div>";
            $("#cmbSeccionesHome").append("<option value=\"" +data[i].id+ "\" attr-id=\"" + data[i].id+ "\" attr-esimg=\""+data[i].esimg +"\" attr-ubicacion=\""+data[i].ubicacion +"\" attr-ancho=\""+data[i].ancho +"\" attr-alto=\""+data[i].alto +"\" attr-tag=\""+data[i].tag +"\" attr-url=\""+data[i].url+"\" attr-eslink=\""+ data[i].eslink +"\" attr-link=\""+ data[i].link +"\">" + data[i].descripcion + "</option>");
            $("#divAdminHomeContenido").append(html);
        }
        $("#cmbSeccionesHome").material_select();


    });
    */
}