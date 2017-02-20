var siteurl = "http://localhost/subastas/";

function postrequest(url, data, complete){


	$.ajax({
      dataType: "json",
      url: siteurl+url,
      data: data,
      type: "POST", 
      complete:complete
       	
    });

}