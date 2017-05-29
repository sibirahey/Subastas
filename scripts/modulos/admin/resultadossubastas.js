function cargaResultadosSubastas(){

	postrequest("subastas/listar" , 
				{ "estatus" :  -1, "empresa" : -1, "subastaId" : -1 }, 
				function(data){
					for(i in data){
						console.log(data[i]);
						var row = "<tr>";
						row += "<td>"+data[i].nombreSubasta+"</td>";
						row += "<td>"+data[i].fechaInicio+"</td>";
						row += "<td>"+data[i].fechaFin+"</td>";
						row += "<td>"+data[i].estatus+"</td>";
						row += "<td>"+data[i].tipoSubasta+"</td>";
						row += "<td>"+data[i].total_participantes+"</td>";
						row += "<td>"+data[i].total_autos+"</td>";
						row += "<td>"+data[i].total_ofertas+"</td>";
						row += '<td><i onclick="verResultadoSubasta(this);" attr-id="'+data[i].idSubasta+'"class="material-icons">assessment</i></td>';
						row += "</tr>";
						$("#tblResultadosSubastas").append(row);
					}
				 }, 
				 function (){
					alert("Ocurrió un error al realizar la consulta");
					});
	



}
function verResultadoSubasta(o){
	alert($(o).attr("attr-id"));
}