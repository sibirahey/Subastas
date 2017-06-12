function cargaResultadosSubastas(){

	postrequest("subastas/listar?rand="+Math.random() , 
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
						row += "<td class='center-align'>"+data[i].empresas+"</td>";
						row += "<td class='center-align'>"+data[i].total_participantes+"</td>";
						row += "<td class='center-align'>"+data[i].total_autos+"</td>";
						row += "<td class='center-align'>"+data[i].total_ofertas+"</td>";
						//row += '<td><div class="waves-effect waves-light btn blue darken-3"><i onclick="verResultadoSubasta(this);" attr-id="'+data[i].idSubasta+'"class="material-icons">assessment</i></div></td>';
						
						if(data[i].revisada == 1){
							row += '<td>&nbsp;</td>';
							row += '<td><div class="waves-effect waves-light btn teal lighten-3 tooltipped" data-delay="50" data-position="top" data-tooltip="Resultados de la subasta" > <i class="material-icons" attr-id="'+data[i].idSubasta+'" data-tooltip="Resultados de la subasta" onclick="verResultadoSubasta(this);">assignment_turned_in</i></div></td>';
						}else{
							row += '<td><div class="waves-effect waves-light btn teal lighten-3 tooltipped" data-delay="50" data-position="top" data-tooltip="Resultados de la subasta" > <i class="material-icons" attr-id="'+data[i].idSubasta+'" data-tooltip="Resultados de la subasta" onclick="verResultadoSubasta(this);">assessment</i></div></td>';	
							row += '<td>&nbsp;</td>';
						}
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
	
	
	var toastContent = $(o).attr("attr-id");
	postrequest("subastas/revisarresultados?r="+Math.random(), {"estatus" :  -1, "empresa" : -1, "subastaId":toastContent, "idsubasta": toastContent } ,  function(data){


	});
}