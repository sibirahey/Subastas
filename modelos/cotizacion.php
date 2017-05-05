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

 
    private function crear($cotiza)
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
                self::ESTATUS . ")" .
                " VALUES(?,?,?,?,?,?,?)";
                
            $sentencia = $pdo->prepare($comando);

            $sentencia->bindParam(1, $cotiza["nombre"]);
                       
            $sentencia->bindParam(2, $cotiza["correo"]);
                       
            $sentencia->bindParam(3, $cotiza["telefono"]);
            
            $sentencia->bindParam(4, $cotiza["marca"]);
            
            $sentencia->bindParam(5, $cotiza["modelo"]);

            $sentencia->bindParam(6, $cotiza["tipo"]);

            $Estatus = 1;
            $sentencia->bindParam(7, $Estatus);
 
            $resultado = $sentencia->execute();
           
            if ($resultado) {
                 $cotizacionId =$pdo->lastInsertId();

               

                   cotizacionservicios::registrarCS($cotizacionId,$cotiza["subServicios"]);
               return $cotizacionId;
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

        switch (sizeof($resultado)) {
            case 0:
                http_response_code(200);
               throw new ExcepcionApi(self::SIN_RESULTADOS, "OK",200, null);
                break;
            
            default:
                 http_response_code(200);
                 return $resultado;
                break;
        }


    }

  
    
}