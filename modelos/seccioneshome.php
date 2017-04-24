<?php

class seccioneshome
{
    
    public function __construct($idAuto =0, $idFeature = 0)
    {
        $this->idAuto = $idAuto;
        $this->idFeature = $idFeature;
 
       
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "cat_seccioneshome";
    const ID = "id";
    const DESCRIPCION = "descripcion";
    const TAG = "tag";
    const URL = "url";
    const ESIMG = "esimg";
    const ESTATUS = "estatus";
   
    const SIN_RESULTADOS = "No se encontraron resultados";
    const LISTO = "OK";
    const ESTADO_CREACION_EXITOSA = "OK";
    const ESTADO_CREACION_FALLIDA = "ERROR";

    public static function post($peticion)
    {
     
      
        if ($peticion[0] == 'guardar') {
            return self::registrarOut();
        }else if ($peticion[0] == 'listar') {
            return self::listar();
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   


     private function listar(){

        $esheader = $_POST["esheader"];
        

        $comando ="SELECT id, descripcion, tag, ancho, alto, url, esheader, esimg, estatus FROM cat_seccioneshome WHERE esheader = ".$_POST["esheader"]; 
            
        $sentencia =ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

        if ($sentencia->execute()){
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        }else
        {
            return null;
        }

            
    }

    


    
    
}