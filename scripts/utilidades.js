
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

