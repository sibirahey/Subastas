<?php

class subastas
{
    
    public function __construct($idSubasta =0, $idTipoSubasta = 0)
    {
        $this->idSubasta = $idEmpresa;
        $this->idTipoSubasta = $nombreEmpresa;
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
    const SIN_RESULTADOS = "No se encontraron resultados";
    const LISTO = "OK";
    const ESTADO_CREACION_EXITOSA = "OK";
    const ESTADO_CREACION_FALLIDA = "ERROR";

    public static function post($peticion)
    {
     
	 	
        if ($peticion[0] == 'listar') {
            return self::listarSubastas();
        }else if ($peticion[0] == 'guardar') {
            return self::registrarOut();
        }else if ($peticion[0] == 'publicar'){
            return self::publicaOut();
        }else if ($peticion[0] == 'xusuario'){
            return self::xusuario();
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

    
    private function listarSubastas()
    {   
        $cuerpo = file_get_contents('php://input');
        $subastas = json_decode($cuerpo);
        
        $resultado = self::listar($subastas);
       
        switch (sizeof($resultado)) {
            case 0:
               http_response_code(200);
               throw new ExcepcionApi(self::SIN_RESULTADOS, "OK",200, null);
               break;
            
            default:
                http_response_code(200);
                return $resultado;
        }
        
    }
    private function listar($datosListar)
    {
        
		
		
        $estatus = $_POST['estatus'];
        $estatusWhere = "";
        $empresa = $_POST['empresa'];
        $empresaFrom = "";
        $empresaWhere = "";
        $subastaId = $_POST['subastaId'];
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
        
        $comando = "select s.idSubasta, nombreSubasta, idTipoSubasta, tipo.tipoSubasta, fechaInicio, fechaFin, CASE WHEN curdate() BETWEEN fechaInicio and fechaFin then 'ACTIVA' WHEN curdate() < fechaInicio then 'AGENDADA' else 'TERMINADA' end as estatus, visible, case visible when 0 then 'NO PUBLICADA' else 'PUBLICADA' end as publicada,(select GROUP_CONCAT(emp.nombreEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresas, (select GROUP_CONCAT(emp.idEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresasId,incremento from subastas s, tiposubastas tipo " . $empresaFrom." where s.idTipoSubasta = tipo.idTipo  " . $empresaWhere . $estatusWhere . $subastaIdWhere ; 

        
        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
        
        /*
        if($estatus >= 0){
            $sentencia->bindParam(1, $estatus);
        }
*/
        if ($sentencia->execute())
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        else
            return null;
        
    }

     private function xusuario()
    {
        
        $comando = "select s.idSubasta, nombreSubasta, idTipoSubasta, tipo.tipoSubasta, fechaInicio, fechaFin, 
(CASE WHEN curdate() BETWEEN fechaInicio and fechaFin then 'ACTIVA' WHEN curdate() < fechaInicio then 'AGENDADA' else 'TERMINADA' end )as estatus, visible, 
(case visible when 0 then 'NO PUBLICADA' else 'PUBLICADA' end) as publicada,
(select GROUP_CONCAT(emp.nombreEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresas, (select GROUP_CONCAT(emp.idEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresasId,incremento from subastas s, tiposubastas tipo  where s.idTipoSubasta = tipo.idTipo 
and s.idSubasta in (select su.idSubasta from subasta_usuario su, usuario u where su.idUsuario = u.idUsuario
and u.claveApi = ?)";

        //print_r($comando);

        $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
        $sentencia = $pdo->prepare($comando);
        

        $sentencia->bindParam(1, $_POST["idusuario"]);
        

        if ($sentencia->execute())
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        else
            return null;
        
    }

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
                    self::INCREMENTO.")" .
                    " VALUES(?,?,?,?,?)";
     
                

                    
                $sentencia = $pdo->prepare($comando);
                $sentencia->bindParam(1, $subastas["nombreSubasta"]);
                $sentencia->bindParam(2, $subastas["IdTipoSubasta"]);
                $sentencia->bindParam(3, $subastas["fechaInicio"]);
                $sentencia->bindParam(4, $subastas["fechaFin"]);
                $sentencia->bindParam(5, $subastas["incremento"]);
                       



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
                " WHERE ".self::ID_SUBASTA." = ?";

                $sentencia = $pdo->prepare($comando);
                $sentencia->bindParam(1, $subastas["nombreSubasta"]);
                $sentencia->bindParam(2, $subastas["IdTipoSubasta"]);
                $sentencia->bindParam(3, $subastas["fechaInicio"]);
                $sentencia->bindParam(4, $subastas["fechaFin"]);
                $sentencia->bindParam(5, $subastas["incremento"]);
                $sentencia->bindParam(6, $subastas["idSubasta"]);
                $resultado = $sentencia->execute();

              
                if ($resultado) {
                    subastasempresa::eliminaEmpresas( $subastas["idSubasta"]);
                    subastasempresa::registrar($subastas["empresas"], $subastas["idSubasta"]);
                    return  $subastas["idSubasta"];
                } else {
                    return -1;
                }    

            }

            
        } catch (PDOException $e) {

            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
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

            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    
    
}