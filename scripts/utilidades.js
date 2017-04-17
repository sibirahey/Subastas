
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
debugger;
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


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
} 

function checkCookie() {
    debugger;
    var rememberme = getCookie("escuderia-rememberme");
    if (rememberme != "") {
        postrequest("usuarios/rememberme", {"claveapi" : rememberme  }, function(data) {

        if (data.valido) {

          
          sessionStorage.setItem('nombre', data["nombre"] + " " + data["appaterno"] + " " + data["apmaterno"]);
          sessionStorage.setItem('correo', data["correo"]);
          sessionStorage.setItem('publico', data["publico"]);
          sessionStorage.setItem('es_admin', data["esadmin"]);
          sessionStorage.setItem('claveApi', data["claveApi"]);
          setCookie("escuderia-rememberme", data["claveApi"], true);
          debugger;
          window.location.href = "main.php";

        } 

      });

    } 
} 

function cargaAutosPorSubasta(subastaID, controlid ){
debugger;
  $(controlid).html("");
  postrequest("autos/subasta", {"idsubasta" : subastaID  }, function(data) {
    
    for(var val in data){
      $(controlid).append(regresaRenglonVenta(data[val]));  
    }
    
  });

}


function regresaRenglonVenta(item){


  var renglon = '<div class="searchItem">';
  renglon += '      <div class="searchItemHead" attr-id="'+item.idAuto+'" onclick="VerDetalleAuto(this);"><h3>'+item.marca+'['+item.modelo+']</h3></div>';
  renglon += '      <div class="searchItemImg"><img attr-id="'+item.idAuto+'" width="100px" onclick="VerDetalleAuto(this);" src="'+ siteurl+ 'uploads/'+item.foto+'"/></div>';
  renglon += '    <div class="searchItemBody">';
  renglon += '      <div>';
  renglon += '        <h4>Año: </h4>';
  renglon += '        <label>'+item.anio+'</label>';
  renglon += '        </div>';
  renglon += '        <div>';
  renglon += '          <h4>Kilometraje: </h4>';
  renglon += '          <label>'+item.km+'</label>';
  renglon += '        </div>';
  renglon += '        <div>';
  renglon += '          <h4>Precio: </h4>';
  renglon += '          <label>'+item.precio+'</label>';
  renglon += '        </div>';
  renglon += '        <div>';
  renglon += '          <h4>Descripción: </h4>';
  renglon += '          <label>'+item.descripcion+'</label>';
  renglon += '        </div>';
  renglon += '      </div>';
  renglon += '</div>';
  return renglon;


}

function VerDetalleAuto(o)
{
  window.location = "?accion=detalleauto&id="+$(o).attr("attr-id");
 
}

function ObtieneSubastasPorUsuario(){
  postrequest("subastas/xusuario", {"idsubasta" : subastaID  }, function(data) {
    
    for(var val in data){
      debugger;
      $(controlid).append(regresaRenglonVenta(data[val]));  
    }
    
  });

}
