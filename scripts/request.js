var siteurl = "http://localhost/subastas2/";

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