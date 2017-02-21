var siteurl = "http://localhost/subastas2/";

function postrequest(url, data, complete){


	$.ajax({
      dataType: "json",
      url: siteurl+url,
      data: data,
      type: "POST", 
      complete:complete
       	
    });

}