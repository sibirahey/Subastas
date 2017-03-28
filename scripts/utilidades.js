
function cargaHTML(contendor, url, name, callback){

  var rand = Math.floor((Math.random() * 10000000) + 1); 
  $(contendor).attr("name",name);
  $(contendor).load( url+"?rand="+rand, callback);
}

function esAdmin(){
	if (sessionStorage.getItem("es_admin") == 1){
		return true;
	}else{
		return false;

	}

}

function CargaAnioAutos(anio){
  var options = "";
  for(i = (new Date().getFullYear() + 1); i > 1950; i--){
    options += '<option value="'+i+'" '  + ((i == anio) ? 'selected="selected"' : '' )+' >' + i+'</option>';

  }
  return options;
}



function CargaSelectEstados(control){

  postrequest("estados/listar?rand="+Math.random(), {"estatus":"1"}, function(data){
      
      $(control).append('<option value="0">== Seleccione ==</option>' );  
      for (i in data){

        $(control).append('<option value="'+data[i].id+'">' + data[i].nombre + '</option>' );
      }

    });

 } 
 function CargaSelectMunicipios(control, id_estado){

  postrequest("municipios/listar?rand="+Math.random(), {"estatus":"1", "id_estado":id_estado}, function(data){
      if(data.mensaje == "OK"){
        return;
      }

      $(control).html("");
      for (i in data){

        $(control).append('<option value="'+data[i].id+'">' + data[i].nombre + '</option>' );
      }

    });

 } 
 function CargaSelectMarcas(control, id_marca, estatus){
  
  postrequest("marcas/listar?rand="+Math.random(), {"estatus":estatus}, function(data){
      $(control).html("");
      $(control).append('<option value="0">== Seleccione ==</option>' );  
      for (i in data){

        $(control).append('<option value="'+data[i].id+'" '+((data[i].id == id_marca) ? 'selected="selected"':'' ) +' >' + data[i].descripcion + '</option>' );
      }

    });

 }
 function CargaSelectModelos(control, control_marca, id_modelo, estatus){
  
  postrequest("modelos/listar?rand="+Math.random(), {"estatus":estatus, "id_marca":$(control_marca).val()}, function(data){
      
      $(control).html("");
      if(data.mensaje != "OK"){
        for (i in data){


          $(control).append('<option value="'+data[i].id+'" '+((data[i].id == id_modelo) ? 'selected="selected"':'' ) +' >' + data[i].descripcion + '</option>' );
        }
      }

    });


 }
function CargaSelectTipoTransmision(control, id_transmision, estatus){
  postrequest("transmisiones/listar?rand="+Math.random(), {"estatus":estatus}, function(data){
      

      for (i in data){


        $(control).append('<option value="'+data[i].id+'" '+((data[i].id == id_transmision) ? 'selected="selected"':'' ) +' >' + data[i].descripcion + '</option>' );
      }

  });

}
function CargaSelectFeatures(control, features, estatus){
  
  postrequest("features/listar?rand="+Math.random(), {"estatus":estatus}, function(data){
      
      $(control).append('<option value="0" >== Seleccione ==</option>' );

      for (i in data){

          $(control).append('<option value="'+data[i].id+'" >' + data[i].descripcion + '</option>' );
        
      }
  });

}

function CargaSelectColores(control, id_color, estatus){
  
  $(control).append('<option value="0">== Seleccione ==</option>' );  
  postrequest("colores/listar?rand="+Math.random(), {"estatus":estatus}, function(data){
      

      for (i in data){


        $(control).append('<option value="'+data[i].id+'" '+((data[i].id == id_color) ? 'selected="selected"':'' ) +' >' + data[i].descripcion + '</option>' );
      }

  });

}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
