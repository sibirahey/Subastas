
$( document ).ready(function() {
	debugger;
    $( ".mainFooter" ).load( "footer.html", function() {
  		console.log( "Load was performed for footer." );
	});
});
