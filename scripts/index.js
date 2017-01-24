
var calendars = {};

$( document ).ready(function() {
    $( ".mainBody" ).load( "views/index.html", function() {
  		console.log( "Load was performed." );

	    calendars.clndr1 = $('.cal1').clndr();
	
	});
	


});
