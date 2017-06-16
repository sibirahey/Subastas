function cargaResultadosSubastas(){

	debugger;

	

	$("#divTotalOfertas").modal({
			dismissible : true, // Modal can be dismissed by clicking outside of the modal
			opacity : .5, // Opacity of modal background
			inDuration : 300, // Transition in duration
			outDuration : 200, // Transition out duration
			startingTop : '4%', // Starting top style attribute
			
		});
		

	$("#tblGanadores").hide();
	//$("#divTotalOfertas").hide();
	//$("#tblTotalOfertas").hide();

	$("#btnResultados").click(function(){
		$("#tblResultadosSubastas").show();
		$("#tblGanadores").hide();
	});

	postrequest("subastas/listar?rand="+Math.random() , 
				{ "estatus" :  -1, "empresa" : -1, "subastaId" : -1 }, 
				function(data){

					sessionStorage["resultados"] = data;
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
							row += '<td><div class="waves-effect waves-light btn teal lighten-3 tooltipped" data-delay="50" data-position="top" data-tooltip="Resultados de la subasta" > <i class="material-icons" attr-id="'+data[i].idSubasta+'" attr-nombre="'+data[i].nombreSubasta+'" data-tooltip="Resultados de la subasta" onclick="verResultadoSubasta(this);">assignment_turned_in</i></div></td>';
						}else{
							row += '<td><div class="waves-effect waves-light btn teal lighten-3 tooltipped" data-delay="50" data-position="top" data-tooltip="Resultados de la subasta" > <i class="material-icons" attr-id="'+data[i].idSubasta+'" attr-nombre="'+data[i].nombreSubasta+'" data-tooltip="Resultados de la subasta" onclick="verResultadoSubasta(this);">assessment</i></div></td>';	
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
	$("#tblOfertas > table > tbody").html("");
	postrequest("subastas/revisarresultados?r="+Math.random(), {"estatus" :  -1, "empresa" : -1, "subastaId":toastContent, "idsubasta": toastContent } ,  function(data){
		$("#tblGanadores > tbody").html("");
		$("#tblResultadosSubastas").hide();
		$("#tblGanadores").show();
		$("#thNombreSubasta").html("<h3>"+$(o).attr("attr-nombre")+"</h3>");
		for(i in data){
			var row = "<tr>";
			row += "<td class='center-align'><img src='"+siteurl +"uploads/" +data[i].foto+"' width='50px' /></td>";
			row += "<td class='center-align'>"+data[i].marca+"</td>";
			row += "<td class='center-align'>"+data[i].modelo+"</td>";
			row += "<td class='center-align'>"+data[i].anio+"</td>";
			row += "<td class='center-align'>"+Number(data[i].precio).formatMoney(2, '.', ',') +"</td>";
			row += "<td class='center-align'>"+data[i].usuario+"</td>";
			row += "<td class='center-align'>"+data[i].oferta+"</td>";
			row += "<td class='center-align'><div class='waves-effect waves-light btn teal lighten-3 tooltipped' data-delay='50' data-position='top' data-tooltip='Detalle de ofertas' attr-id='"+data[i].autoid+ "' onclick='verOfertasPorSubasta(this);' > <i class='material-icons'  data-tooltip='Detalle de ofertas'>assessment</i></div></td>";
			row += "</tr>";
			$("#tblGanadores > tbody").append(row);

			for(j in data[i].ofertas){

				var row2= "<tr class='detalleOfertas" + data[i].ofertas[j].idAuto+"' >";
				row2 += "<td class='center-align'  >"+data[i].ofertas[j].nombre_usuario +"</td>";
				row2 += "<td class='center-align'>"+ data[i].ofertas[j].oferta+"</td>";
				row2 += "<td class='center-align'>"+ data[i].ofertas[j].hora_puja+"</td>";
				row2 += "</tr>";
				$("#tblTotalOfertasBody").append(row2);
			}
		}
		

	});
}

function verOfertasPorSubasta(o){
		
		//$("#tblTotalOfertasBody > tr").hide();
		$(".detalleOfertas"+$(o).attr("attr-id")).show();
		//$("#tblTotalOfertas").show();
		$("#divTotalOfertas").modal("open");

}