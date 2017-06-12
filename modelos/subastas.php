<?php

class subastas
{
    
    public function __construct($idSubasta =0, $idTipoSubasta = 0)
    {
        $this->idSubasta = $idSubasta;
        $this->idTipoSubasta = $idTipoSubasta;
        $this->fechaIni = date("Y-m-d");
        $this->fechaFin = date("Y-m-d");
       
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "subastas";
    const NOMBRE_SUBASTA = "nombreSubasta";
    const ID_SUBASTA = "idSubasta";
    const ID_TIPOSUBASTA = "IdTipoSubasta";
    const FECHA_INICIO = "fechaInicio";
    const FECHA_FIN = "fechaFin";
    const INCREMENTO = "incremento";
    const VISIBLE = "visible";
    const OFERTAS = "ofertas_x_usuarios";
    const AUTOSXUSUARIO = "autos_x_usuario";
    const SIN_RESULTADOS = "No se encontraron resultados";
    const LISTO = "OK";
    const ESTADO_CREACION_EXITOSA = "OK";
    const ESTADO_CREACION_FALLIDA = "ERROR";

    public static function post($peticion)
    {
     
	 	
        if ($peticion[0] == 'listar') {
            return self::listar($_POST);
        }else if ($peticion[0] == 'guardar') {
            return self::registrar($_POST);
        }else if ($peticion[0] == 'publicar'){
            return self::publicaOut();
        }else if($peticion[0] == 'info'){
              return self::infoSubasta($_POST['id']);
        }
        else if ($peticion[0] == 'xusuario'){
            return self::xusuario();
        }else if($peticion[0] == 'participantes'){
            return self::participantes($_POST);
        }else if($peticion[0] == 'revisarresultados'){
            return self::revisarresultados($_POST);
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

    
    
    private function listar($datosListar)
    {
        try{
            $estatus = $datosListar['estatus'];
            $estatusWhere = "";
            $empresa = $datosListar['empresa'];
            $empresaFrom = "";
            $empresaWhere = "";
            $subastaId = $datosListar['subastaId'];
            $subastaIdWhere = "";

            if($estatus > -1){
                $estatusWhere = " and visible = " .$estatus;
            }
            if($empresa > -1){
                $empresaFrom = ", subastaempresa sube, empresas e "; 
                $empresaWhere = " and s.idSubasta = sube.idSubasta and e.idEmpresa = sube.idEmpresa and e.idEmpresa = " . $empresa;
            }
            if($subastaId > -1){
                $subastaIdWhere = " and idSubasta = ".$subastaId;

            }
            
            $comando = "select s.idSubasta, nombreSubasta, idTipoSubasta, tipo.tipoSubasta, fechaInicio, fechaFin, CASE WHEN curdate() BETWEEN fechaInicio and fechaFin then 'ACTIVA' WHEN curdate() < fechaInicio then 'AGENDADA' else 'TERMINADA' end as estatus, visible, case visible when 0 then 'NO PUBLICADA' else 'PUBLICADA' end as publicada,(select GROUP_CONCAT(emp.nombreEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresas, (select GROUP_CONCAT(emp.idEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresasId,incremento, ofertas_x_usuarios, autos_x_usuario, (select count(*) from subastas_autos suba where suba.subastaId = s.idSubasta ) as total_autos, (select count(*) from subasta_usuario subu where subu.idSubasta = s.idSubasta) as total_participantes, (select count(*) from autos_puja aupu  where aupu.idSubasta = s.idSubasta) as total_ofertas, s.revisada, s.fecha_cierre, s.autos_x_usuario  from subastas s, tiposubastas tipo " . $empresaFrom." where s.idTipoSubasta = tipo.idTipo  " . $empresaWhere . $estatusWhere . $subastaIdWhere . " order by fechaFin desc" ; 

            
            $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
            

            if ($sentencia->execute())
                return $sentencia->fetchall(PDO::FETCH_ASSOC);
            else
                return null;
        }catch(Exception $e){
            print_r($e);
            return null;
        }
        
    }

    public function infoSubasta($id)
    {
        
        
      
        
        $comando = "select s.idSubasta, nombreSubasta, idTipoSubasta, tipo.tipoSubasta, fechaInicio, fechaFin, CASE WHEN curdate() BETWEEN fechaInicio and fechaFin then 'ACTIVA' WHEN curdate() < fechaInicio then 'AGENDADA' else 'TERMINADA' end as estatus, visible, case visible when 0 then 'NO PUBLICADA' else 'PUBLICADA' end as publicada,(select GROUP_CONCAT(emp.nombreEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresas, (select GROUP_CONCAT(emp.idEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresasId, incremento, ofertas_x_usuarios, autos_x_usuario  from subastas s, tiposubastas tipo 
         where s.idTipoSubasta = tipo.idTipo and s.idSubasta = ?"; 

        
        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
        $sentencia->bindParam(1, $id);


        if ($sentencia->execute())
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        else
            return null;
        
    }

     private function xusuario()
    {
        
        $comando = "select s.idSubasta, nombreSubasta, idTipoSubasta, tipo.tipoSubasta, fechaInicio, fechaFin, 
(CASE WHEN curdate() BETWEEN fechaInicio and fechaFin then 'ACTIVA' WHEN curdate() <= fechaInicio then 'AGENDADA' else 'TERMINADA' end )as estatus, visible, 
(case visible when 0 then 'NO PUBLICADA' else 'PUBLICADA' end) as publicada,
(select GROUP_CONCAT(emp.nombreEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresas, (select GROUP_CONCAT(emp.idEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresasId,incremento from subastas s, tiposubastas tipo  where s.idTipoSubasta = tipo.idTipo 
and s.idSubasta in (select su.idSubasta from subasta_usuario su, usuario u, subastas sub where su.idUsuario = u.idUsuario and sub.idSubasta = su.idSubasta and sub.visible = 1 and u.claveApi = ? )";

        //print_r($comando);

        $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
        $sentencia = $pdo->prepare($comando);
        

        $sentencia->bindParam(1, $_POST["idusuario"]);
        

        if ($sentencia->execute())
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        else
            return null;
        
    }

    /*
    private function registrarOut()
    {
        $cuerpo = file_get_contents('php://input');
        $usuario = json_decode($cuerpo);
        
        $resultado = self::registrar($_POST);
        
        switch ($resultado) {
            case self::ESTADO_CREACION_EXITOSA:
               http_response_code(200);
               return "OK";
               
                break;
            case self::ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
                break;
            default:
                http_response_code(200);
                return $resultado;
        }
    }
    */

    private function publicaOut(){

        $cuerpo = file_get_contents('php://input');
        $usuario = json_decode($cuerpo);
        
        $resultado = self::publicar($_POST);
        
        switch ($resultado) {
            case self::ESTADO_CREACION_EXITOSA:
               http_response_code(200);
               return "OK";
               
                break;
            case self::ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
                break;
            default:
                http_response_code(200);
                return $resultado;
        }
    }

    private function registrar($subastas)
    {
        
        
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();


            if($subastas["idSubasta"] == "0"){
            // Sentencia INSERT
                $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                    self::NOMBRE_SUBASTA . ",".
                    self::ID_TIPOSUBASTA . "," .
                    self::FECHA_INICIO . "," .
                    self::FECHA_FIN . ",".
                    self::INCREMENTO.",".
                    self::OFERTAS.",".
                    self::AUTOSXUSUARIO.")" .
                    " VALUES(?,?,?,?,?,?,?)";
     
                

                    
                $sentencia = $pdo->prepare($comando);
                $sentencia->bindParam(1, $subastas["nombreSubasta"]);
                $sentencia->bindParam(2, $subastas["IdTipoSubasta"]);
                $sentencia->bindParam(3, $subastas["fechaInicio"]);
                $sentencia->bindParam(4, $subastas["fechaFin"]);
                $sentencia->bindParam(5, $subastas["incremento"]);
                $sentencia->bindParam(6, $subastas["ofertas_x_usuarios"]);
                $sentencia->bindParam(7, $subastas["autos_x_usuario"]);
                       



                $resultado = $sentencia->execute();

              
                if ($resultado) {
                    $subastaid = $pdo->lastInsertId();


                    subastasempresa::registrar($subastas["empresas"], $subastaid);
                    return $subastaid;
                } else {
                    return -1;
                }
            }
            else{
                $comando = "UPDATE " . self::NOMBRE_TABLA . " SET  ".
                self::NOMBRE_SUBASTA . "= ?, ".
                self::ID_TIPOSUBASTA . "= ?, ".
                self::FECHA_INICIO . "= ?, ".
                self::FECHA_FIN . " = ?, ".
                self::INCREMENTO." = ?" .
                self::OFERTAS." = ?" .
                self::AUTOSXUSUARIO." = ?" .
                " WHERE ".self::ID_SUBASTA." = ?";

                $sentencia = $pdo->prepare($comando);
                $sentencia->bindParam(1, $subastas["nombreSubasta"]);
                $sentencia->bindParam(2, $subastas["IdTipoSubasta"]);
                $sentencia->bindParam(3, $subastas["fechaInicio"]);
                $sentencia->bindParam(4, $subastas["fechaFin"]);
                $sentencia->bindParam(5, $subastas["incremento"]);
                $sentencia->bindParam(6, $subastas["ofertas_x_usuarios"]);
                $sentencia->bindParam(7, $subastas["autos_x_usuario"]);
                $sentencia->bindParam(8, $subastas["idSubasta"]);
                $resultado = $sentencia->execute();

              
                if ($resultado) {
                    subastasempresa::eliminaEmpresas( $subastas["idSubasta"]);
                    subastasempresa::registrar($subastas["empresas"], $subastas["idSubasta"]);
                    return  $subastas["idSubasta"];
                } else {
                    return ExcepcionApi(0, "No se insertó el registro", 500);
                }    

            }

            
        } catch (PDOException $e) {

            return ExcepcionApi(0, $e->getMessage(), 500);
            
        }

    }

    private function publicar($subastas)
    {   
        
        
        
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "UPDATE " . self::NOMBRE_TABLA . " SET  " .
                self::VISIBLE . " = ? WHERE ".self::ID_SUBASTA." = ?";
 
            

                
            $sentencia = $pdo->prepare($comando);
            $sentencia->bindParam(1, $subastas["visible"]);
            $sentencia->bindParam(2, $subastas["idSubasta"]);
            
                   



            $resultado = $sentencia->execute();

          
            if ($resultado) {
                

                return $subastas["idSubasta"];

            } else {
                return -1;
            }
        } catch (PDOException $e) {

            //print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    private function participantes($params){


        try{
            $comando = "SELECT u.idUsuario, u.nombre, u.appaterno, u.apmaterno, u.correo, u.vigencia, u.verificado FROM subasta_usuario su, usuario u WHERE su.idUsuario = u.idUsuario and su.idSubasta = ?" ; 

            $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
            
            $sentencia->bindParam(1, $params["id_subasta"]);
            

            if ($sentencia->execute())
                return $sentencia->fetchall(PDO::FETCH_ASSOC);
            else
                return new ExcepcionApi("error", "Ocurrió un error al obtener los participantes", 400);
        }catch(Exception $e){

            return new ExcepcionApi("error", $e->getMessage(), 400);
        }
            

    }

    private function revisarresultados($datos){

        $subasta = self::listar($datos)[0];
        $oAutospuja = new autospuja(0,0);
        $resultadosxauto = array();
        
        $pujas = $oAutospuja::xsubasta($subasta['idSubasta']);
        
        
        $oAutos = new autos();
        $autos = $oAutos::listarPorSubastas();
        $resultados = array();
        $ganadores = array();
        foreach ($autos as &$auto) {
            //print_r($auto);
            
            $oresultado = new resultados($auto["idAuto"], $auto["marca"], $auto["modelo"], $auto["anio"], $auto["precio"], $auto["foto"]);
            $resultados[$auto["idAuto"]]  = $oresultado;
        }


        
        foreach($pujas as &$oferta){

            $resultado = $resultados[$oferta["idAuto"]];
            


            if(!isset($ganadores[$resultado->usuarioganador])  || $ganadores[$resultado->usuarioganador] < $subasta["autos_x_usuario"]){


                if($oferta["oferta"] > $resultado->oferta && $oferta["puja_valida"] == 1 ){

                    
                
                    if(isset($ganadores[$resultado->usuarioganador])){
                        if($ganadores[$resultado->usuarioganador] > 0){
                            $ganadores[$resultado->usuarioganador] = $ganadores[$resultado->usuarioganador]-1;
                        }
                    }
                    
                    $resultado->oferta = $oferta["oferta"];
                    $resultado->usuarioganador =$oferta["idUsuario"];
                    $resultado->usuario = $oferta["nombre_usuario"];
                    $resultado->oferta = $oferta["oferta"];
                    if(isset($ganadores[$oferta["idUsuario"]])){
                        $ganadores[$oferta["idUsuario"]] = $ganadores[$oferta["idUsuario"]]+1;
                    }else{
                        $ganadores[$oferta["idUsuario"]] = 1;
                    }
                    
                    array_push($resultado->ofertas, $oferta);
                   
                
                }else{
                    array_push($resultado->ofertas, $oferta); 
                }
            }else{
                array_push($resultado->ofertas, $oferta);
            }
        }
            
        return $resultados;

        
        
        
    }
        
}