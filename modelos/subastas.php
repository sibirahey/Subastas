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
        print_r($_POST);
        $estatus = $_POST['estatus'];
        $estatusWhere = "";
        $empresa = $_POST['empresa'];
        $empresaFrom = "";
        $empresaWhere = "";

        if($estatus > -1){
            $estatusWhere = " and visible = " .$estatus;
        }
        if($empresa > -1){
            $empresaFrom = ", empresas e "; 
            $empresaWhere = " and e.idEmpresa = " . $empresa;
        }
        
        $comando = "select idSubasta, nombreSubasta, idTipoSubasta, tipo.tipoSubasta, fechaInicio, fechaFin, CASE WHEN curdate() BETWEEN fechaInicio and fechaFin then 'ACTIVA' WHEN curdate() < fechaInicio then 'AGENDADA' else 'TERMINADA' end as estatus, visible, case visible when 0 then 'NO PUBLICADA' else 'PUBLICADA' end as publicada,(select GROUP_CONCAT(emp.nombreEmpresa) from subastaempresa se, empresas emp where s.idSubasta = se.idSubasta and se.idEmpresa = emp.idEmpresa) as empresas from subastas s, tiposubastas tipo " . $empresaFrom." where s.idTipoSubasta = tipo.idTipo  " . $empresaWhere . $estatusWhere ;
        
        print_r($comando);



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

    private function registrar($subastas)
    {
        
 
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::NOMBRE_SUBASTA . ",".
                self::ID_TIPOSUBASTA . "," .
                self::FECHA_INICIO . "," .
                self::FECHA_FIN . ")" .
                " VALUES(?,?,?,?)";
 
            

                
            $sentencia = $pdo->prepare($comando);
            $sentencia->bindParam(1, $subastas["nombreSubasta"]);
            $sentencia->bindParam(2, $subastas["IdTipoSubasta"]);
            $sentencia->bindParam(3, $subastas["fechaInicio"]);
            $sentencia->bindParam(4, $subastas["fechaFin"]);
                   
        


            $resultado = $sentencia->execute();

          
            if ($resultado) {
                $subastaid = $pdo->lastInsertId();


                subastasempresa::registrar($subastas["empresas"], $subastaid);
                return $subastaid;

            } else {
                return -1;
            }
        } catch (PDOException $e) {

            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    
    
}