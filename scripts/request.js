var siteurl = "http://localhost/";

function postrequest(url, data, complete, fnerror){


	$.ajax({
      dataType: "json",
      url: siteurl+url,
      data: data,
      type: "POST",
      async:false, 
      success:complete,
      error:fnerror
       	
    });

}

