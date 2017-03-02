function Usuario(nombre, appaterno, apmaterno, password, verificapassword, dd, mm, yyyy, placa, categorias, email){
	this.nombre = nombre;
	this.appaterno = appaterno;
	this.apmaterno = apmaterno;
	this.password = password;
	this.verificapassword = verificapassword;
	this.dd = dd;
	this.mm = mm;
	this.yyyy = yyyy;
	this.placa = placa;
	this.categorias = categorias;
	this.fecha_nacimiento = new Date();
	this.email = email;
	/*
	for(var i in categorias){
		var foo = new UsuarioCategorias();
		foo.idUsuario = 0;
		foo.idCategoria = categorias[i].idCategoria;
		this.categorias.push(foo);
	}
	*/

}
function UsuarioCategorias(idUsuario, idCategoria){
	this.idUsuario = idUsuario;
	this.idCategoria = idCategoria;

}
function Login(email, password){
	this.email = email;
	this.password = password;
}

function Empresa(id,nombre,estatus){
	this.estatus = estatus;
	this.id = id;
	this.nombre= nombre;
}
function Subastas(nombreSubasta, IdTipoSubasta, fechaInicio, fechaFin, empresas){
	this.nombreSubasta = nombreSubasta;
	this.IdTipoSubasta = IdTipoSubasta;
	this.fechaInicio = fechaInicio;
	this.fechaFin = fechaFin;
	this.empresas = empresas;
}	