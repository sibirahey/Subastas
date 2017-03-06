<?php

class subservicio
{


    // Datos de la tabla "cotizacion"
    const NOMBRE_TABLA = "subservicios";
    const IDSERVICIO = "idServicio";
    const NOMBRE = "nombre";
    const REQUISITOS = "Requisitos";
    const ESTATUS = "estatus";
    const IDSUBSERVICIO = "idSubservicio";
    const SINRESULTADOS = "No se encontraron resultados.";
    const ESTADO_CREACION_EXITOSA ="OK";
    const ESTADO_CREACION_FALLIDA ="ERROR";
    const ESTADO_FALLA_DESCONOCIDA = "Falla desconocida";
     const ESTADO_ACTUALIZACION_EXITOSA = "Se actualizo Correctamente.";
      const ESTADO_ACTUALIZACION_FALLIDA = "Ocurrio un error al actualizar la información.";
    const ESTADO_BD_ERROR = "Ocurrio un error en BD.";
    public static function post($peticion)
    {
        if ($peticion[0] == 'registro') {
            return self::registrar();
        }else if ($peticion[0] == 'listar') {
            return self::listarSubservicio();
        } else if ($peticion[0] == 'actualizar') {
            return self::actualizarSubServicio();
        } else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

 
    private function crear($subServicio)
    {
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::IDSERVICIO . "," .
                self::NOMBRE . "," .
                self::REQUISITOS . "," .
                self::ESTATUS .")" .
                " VALUES(?,?,?,?)";
                
            $sentencia = $pdo->prepare($comando);

            $sentencia->bindParam(1, $cotiza["nombre"]);
                       
            $sentencia->bindParam(2, $cotiza["correo"]);
                       
            $sentencia->bindParam(3, $cotiza["telefono"]);
          
 
            $resultado = $sentencia->execute();
           
            if ($resultado) {
               return self::ESTADO_CREACION_EXITOSA;
            } else {
                return self::ESTADO_CREACION_FALLIDA;
            }
        } catch (PDOException $e) {
            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

   
    private function registrar()
    {
        $cuerpo = file_get_contents('php://input');
       
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

    private function listarSubservicio(){

        $cuerpo = file_get_contents('php://input');
        $subServicios = json_decode($cuerpo);
        $resultado = self::listar($subServicios);

        switch (sizeof($resultado))  {
            case 0 :
                http_response_code(200);
                throw new ExcepcionApi(self::SINRESULTADOS,"OK",200,null);
                break;
            
            default:
                http_response_code(200);
                return $resultado;
                break;
        }

    }

    private function listar($datosListar){

        $idServicio =$_POST['idServicio'];
        $estatus =$_POST['estatus'];
        $comando ="SELECT " .
            self::IDSUBSERVICIO . "," . 
            self::IDSERVICIO . "," .
            self::NOMBRE . "," . 
            self::REQUISITOS . ",".
            self::ESTATUS . 
            " FROM " . self::NOMBRE_TABLA .
            (($estatus >0) ? " WHERE " . self::ESTATUS . "=?":"") .
            (($idServicio > 0) ? " AND " . self::IDSERVICIO . "=?":"");

        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

        if ($estatus > 0) {
                   $sentencia->bindParam(1,$estatus);
                }        
        if ($idServicio >0) {
            $sentencia->bindParam(2,$idServicio);
        }

        if ($sentencia->execute())
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        else
            return null;
        
    } 

    private function actualizarSubServicio(){
        
         $cuerpo = file_get_contents('php://input');
         $subServicio = json_decode($cuerpo);

        
         $resultado =  self::factualizar($_POST);
         switch ($resultado) {
             case self::ESTADO_CREACION_EXITOSA:
                 http_response_code(200);
                 return 'OK';
                 break;
            
             default:
                 throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
         }

    }   

    private function factualizar($subservicio){
        
         try{
            print_r($subServicio);
        $idSubServicio = $subservicios["idSubServicio"];
        $idServicio = $subservicios["idServicio"];
        $nombre = $subservicios["nombre"];
        $Requisitos = $subservicios["requisitos"];
        $estatus = $subservicios["estatus"];

        $comando = "UPDATE " . self::NOMBRE_TABLA .
                " SET " . self::NOMBRE . "=?" .",".
                self::REQUISITOS . "=?" .",".
                self::ESTATUS . "=?" . 
                " WHERE " . self::IDSUBSERVICIO . "=?" . 
                " AND " . self::IDSERVICIO . "=?";
                
        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

        $sentencia->bindParam(1,$nombre);
        $sentencia->bindParam(2,$Requisitos);
        $sentencia->bindParam(3,$estatus);
        $sentencia->bindParam(4,$idSubServicio);
        $sentencia->bindParam(5,$idServicio);
        
        //print_r($comando);

        $restultado = $sentencia->execute();

        print_r($resultado->affected_rows);
        if($resultado){

            return  self::ESTADO_ACTUALIZACION_EXITOSA;

        }
        else{
            return self::ESTADO_ACTUALIZACION_FALLIDA;
        }
     }catch(PDOException $e){

         throw new ExcepcionApi(ESTADO_BD_ERROR,$e->getMessage(), 400);
        
     }


    }
}