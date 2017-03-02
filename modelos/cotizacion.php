<?php

class cotizacion
{


    // Datos de la tabla "cotizacion"
    const NOMBRE_TABLA = "cotizacion";
    const NOMBRE = "Nombre";
    const CORREO = "Correo";
    const TELEFONO = "Telefono";
    const IDCOTIZACION = "idCotizacion";
    const IDUSUAIO = "idUsuario";
    const MARCA = "Marca";
    const MODELO = "Modelo";
    const TIPO = "Tipo";
    const ESTATUS = "Estatus";



    public static function post($peticion)
    {
      
        
        if ($peticion[0] == 'registro') {
            return self::registrar();
        } else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

    private function crearServicios($cotizacion){

        try{

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::NOMBRE . "," .
                self::CORREO . "," .
                self::TELEFONO . "," .
                self::MARCA . "," .
                self::MODELO . "," .
                self::TIPO . "," .
                self::ESTATUS . "," .
                " VALUES(?,?,?,?,?,?)";

            $sentencia = $pdo->prepare($comando);

            $sentencia->bindParam(1, $cotizacion["nombre"]);
                       
            $sentencia->bindParam(2, $cotizacion["correo"]);
                       
            $sentencia->bindParam(3, $cotizacion["telefono"]);
            
            $sentencia->bindParam(4, $cotizacion["marca"]);
            
            $sentencia->bindParam(5, $cotizacion["modelo"]);

            $sentencia->bindParam(6, $cotizacion["tipo"]);

            $Estatus = 1;
            $sentencia->bindParam(7, $Estatus);
 
            $resultado = $sentencia->execute();
           
            if ($resultado) {

               return self::ESTADO_CREACION_EXITOSA;
            } else {
                return self::ESTADO_CREACION_FALLIDA;
            }

        } catch (PDOException $e) {

            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }



    }
    private function crear($cotizacion)
    {
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::NOMBRE . "," .
                self::CORREO . "," .
                self::TELEFONO . "," .
                self::MARCA . "," .
                self::MODELO . "," .
                self::TIPO . "," .
                self::ESTATUS . "," .
                " VALUES(?,?,?,?,?,?)";

            $sentencia = $pdo->prepare($comando);

            $sentencia->bindParam(1, $cotizacion["nombre"]);
                       
            $sentencia->bindParam(2, $cotizacion["correo"]);
                       
            $sentencia->bindParam(3, $cotizacion["telefono"]);
            
            $sentencia->bindParam(4, $cotizacion["marca"]);
            
            $sentencia->bindParam(5, $cotizacion["modelo"]);

            $sentencia->bindParam(6, $cotizacion["tipo"]);

            $Estatus = 1;
            $sentencia->bindParam(7, $Estatus);
 
            $resultado = $sentencia->execute();
           
            if ($resultado) {

               return self::ESTADO_CREACION_EXITOSA;
            } else {
                return self::ESTADO_CREACION_FALLIDA;
            }
        } catch (PDOException $e) {

            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

   
    private function registrar()
    {
        $cuerpo = file_get_contents('php://input');
        $usuario = json_decode($cuerpo);

        $resultado = self::crear($_POST);

        switch ($resultado) {
            case self::ESTADO_CREACION_EXITOSA:
                //self::registraServicios($_POST);
               http_response_code(200);
               return "OK";
               
                break;
            case self::ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
                break;
            default:
                throw new ExcepcionApi(self::ESTADO_FALLA_DESCONOCIDA, "Falla desconocida", 400);
        }
    }

    private function registraServicios(){

        $cuerpo = file_get_contents('php://input');
        $usuario = json_decode($cuerpo);

        $resultado =self::crearServicios($_POST);

        switch ($resultado) {
            case self:: ESTADO_CREACION_EXITOSA:    
                http_response_code(200);
                return "OK";
                break;
            
            case self::ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
                break;
            default:
                throw new ExcepcionApi(self::ESTADO_FALLA_DESCONOCIDA, "Falla desconocida", 400);
                break;
        }

    }


    private function ConsultaIncr(){

          $comando = "SELECT AUTO_INCREMENT FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'msusano' AND   TABLE_NAME   = 'usuario';";
        
           $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
        $sentencia->bindParam(1, $mail);
        

    }
    
}