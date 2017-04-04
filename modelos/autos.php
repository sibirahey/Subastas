<?php

class autos
{
    
    public function __construct($idSubasta =0, $idTipoSubasta = 0)
    {
        $this->idSubasta = $idEmpresa;
        $this->idTipoSubasta = $nombreEmpresa;
        $this->fechaIni = date("Y-m-d");
        $this->fechaFin = date("Y-m-d");
       
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "autos";
    const IDAUTO = "idAuto";
    const ENVENTA = "enVenta";
    const MARCA = "marca";
    const MODELO = "modelo";
    const COLOR = "color";
    const ANIO = "anio";
    const KM = "km";
    const TRANSMISION = "transmision";
    const ESTADO = "estado";
    const CIUDAD = "ciudad";
    const DESCRIPCION = "descripcion";
    const ESTATUS = "estatus";
    const PUBLICADO = "publicado";
    const FECHACREACION = "fechaCreacion";



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

    private function registrar($auto)
    {
        
        
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::ENVENTA . "," .
                self::MARCA . "," .
                self::MODELO . ",".
                self::COLOR . ",".
                self::ANIO . ",".
                self::KM . ",".
                self::TRANSMISION . ",".
                self::ESTADO . ",".
                self::CIUDAD . ",".
                self::DESCRIPCION . ",".
                self::ESTATUS . ",".
                self::PUBLICADO .")" .
                " VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
 
                
            $sentencia = $pdo->prepare($comando);
            $sentencia->bindParam(1, $auto["enVenta"]);
            $sentencia->bindParam(2, $auto["marca"]);
            $sentencia->bindParam(3, $auto["modelo"]);
            $sentencia->bindParam(4, $auto["color"]);
            $sentencia->bindParam(5, $auto["anio"]);
            $sentencia->bindParam(6, $auto["km"]);                          
            $sentencia->bindParam(7, $auto["transmision"]);                          
            $sentencia->bindParam(8, $auto["estado"]);                          
            $sentencia->bindParam(9, $auto["ciudad"]);                          
            $sentencia->bindParam(10, $auto["descripcion"]);     
            $sentencia->bindParam(11, $auto["estatus"]);                          
            $sentencia->bindParam(12, $auto["publicado"]);                          

            //idAuto, enVenta, marca, modelo, color, anio, km, transmision, estado, ciudad, descripcion, estatus, publicado, fechaCreacion
                   



            $resultado = $sentencia->execute();

          
            if ($resultado) {
                $idAuto = $pdo->lastInsertId();


                autosfeatures::registrar($auto["features"], $idAuto);
                autosfotos::registrar($auto["fotos"], $idAuto);
                return $idAuto;

            } else {
                return -1;
            }
        } catch (PDOException $e) {

            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    
    
}