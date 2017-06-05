function cargaResultadosSubastas(){

	postrequest("subastas/listar" , 
				{ "estatus" :  -1, "empresa" : -1, "subastaId" : -1 }, 
				function(data){
					for(i in data){
						var attrID = data[i].idSubasta;
						console.log(data[i]);
						var row = "<tr>";
						row += "<td>"+data[i].nombreSubasta+"</td>";
						row += "<td class='center-align'>"+data[i].fechaInicio+"</td>";
						row += "<td class='center-align'>"+data[i].fechaFin+"</td>";
						row += "<td class='center-align'>"+data[i].estatus+"</td>";
						row += "<td class='center-align'>"+data[i].tipoSubasta+"</td>";
						row += "<td class='center-align'>"+data[i].total_participantes+"</td>";
						row += "<td class='center-align'>"+data[i].total_autos+"</td>";
						row += "<td class='center-align'>"+data[i].total_ofertas+"</td>";
						//row += '<td><div class="waves-effect waves-light btn blue darken-3"><i onclick="verResultadoSubasta(this);" attr-id="'+data[i].idSubasta+'"class="material-icons">assessment</i></div></td>';
						row += '<td><div class="waves-effect waves-light btn teal lighten-3 tooltipped" data-delay="50" data-position="top" attr-id="'+data[i].idSubasta+'" data-tooltip="'+data[i].idSubasta+'"> <i class="material-icons">assessment</i></div></td>';
					    //row += '<td><div class="waves-effect waves-light btn blue darken-3" onclick="verResultadoSubasta(this);" attr-id="'+data[i].idSubasta+'"></div></td>';
						row += "</tr>";
						$("#tblResultadosSubastas > tbody").append(row);
					}
					$('.tooltipped').tooltip({delay: 50});
				 }, 
				 function (){
					alert("Ocurrió un error al realizar la consulta");
				});
	



}
function verResultadoSubasta(o){
	
	//alert($(o).attr("attr-id"));
	// var $toastContent = $(o).attr("attr-id");
	// Materialize.toast($toastContent, 4000);
}