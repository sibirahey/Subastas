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
     
      
        if ($peticion[0] == 'update') {
            return self::update();
        }else if ($peticion[0] == 'listar') {
            return self::listar();
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   


     private function listar(){

        $esheader = $_POST["esheader"];
        

        $comando ="SELECT id, descripcion, tag, ancho, alto, url, esheader, esimg, eslink, link, estatus FROM cat_seccioneshome WHERE esheader = ".$_POST["esheader"]; 
            
        $sentencia =ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

        if ($sentencia->execute()){
            return $sentencia->fetchall(PDO::FETCH_ASSOC);
        }else
        {
            return null;
        }

            
    }

    private function update(){

        try{
     

            $comando ="SELECT id, descripcion, tag, ancho, alto, url, esheader, esimg, eslink, link, estatus FROM cat_seccioneshome "; 
                
            $sentencia =ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

            $json = "";
            if ($sentencia->execute())
            {
            
                $json =  $sentencia->fetchall(PDO::FETCH_ASSOC);
            
            }else
            {
                $json = "";
            }

            $json = json_encode($json, JSON_PRETTY_PRINT);

            $myfile = fopen( "data/home.json", "w") or die("Unable to open file!");
            fwrite($myfile, $json);
            fclose($myfile);

            echo "OK";
         }
        catch(Exception $ex){

            echo "ERROR";
        }

    }
}