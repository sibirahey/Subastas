var siteurl = "http://localhost/Subastas/";

function postrequest(url, data, complete, fnerror){


	$.ajax({
      dataType: "json",
      url: siteurl+url,
      data: data,
      type: "POST", 
      success:complete,
      error:fnerror
       	
    });

}