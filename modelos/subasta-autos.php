<?php

class subastasautos
{
    
    public function __construct($idSubasta =0, $idAuto = 0)
    {
        $this->idSubasta = $idSubasta;
        $this->idAuto = $idAuto;
 
       
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "subastas_autos";
    const ID_SUBASTA = "subastaId";
    const ID_AUTO = "autoId";
   
    const SIN_RESULTADOS = "No se encontraron resultados";
    const LISTO = "OK";
    const ESTADO_CREACION_EXITOSA = "OK";
    const ESTADO_CREACION_FALLIDA = "ERROR";

    public static function post($peticion)
    {
     
      
        if ($peticion[0] == 'listar') {
            return self::listarEmpresas();
        }else if ($peticion[0] == 'guardar') {
            return self::registrarOut();
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

    
     

    public static function registrar($idAuto, $idSubasta)
    {
        
        $resultado = false;
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::ID_SUBASTA . "," .
                self::ID_AUTO . ")" .
                " VALUES(?,?)";

            $sentencia = $pdo->prepare($comando);
            $sentencia->bindParam(1, $idSubasta);
            $sentencia->bindParam(2, $idAuto);
         

            $resultado = $sentencia->execute();
                        
            

             if ($resultado) {
                return $resultado;
            } else {
                return false;
            }
            
        } catch (PDOException $e) {
            
            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    
    
}