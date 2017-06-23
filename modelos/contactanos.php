<?php

class contactanos
{


    // Datos de la tabla "cotizacion"
    const NOMBRE_TABLA = "contactanos";
    
    const ERROR = "Error al ejecutar la operación ";

    public function __construct($paginas = 0, $pagina = 0, $totalresultados = 0, $resultados = [], $id = 0, $nombre = "", $correo = "", $telefono = "", $mensaje = "", $fecha = "", $estatus = "")
    {
        $this->paginas = $paginas;
        $this->pagina = $pagina;
        $this->totalresultados = $totalresultados;
        $this->resultados = $resultados;
        $this->id = $id;
        $this->nombre = $nombre;
        $this->correo = $correo;
        $this->telefono = $telefono;
        $this->mensaje= $mensaje;
        $this->fecha = $fecha;
        $this->estatus = $estatus;

    }


    public static function post($peticion)
    {
      
        
        if ($peticion[0] == 'crear') {
            return self::crear();
        }else if ($peticion[0] == 'listar') {

            return self::listar();
        }else if ($peticion[0] == 'leido') {

            return self::leido();
        }
         else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

    private function crear()
    {
        try {
            $id = 0;
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                " nombre ," .
                " correo ," .
                " telefono ," .
                " mensaje )" .
                " VALUES(?,?,?,?)";
                
            $sentencia = $pdo->prepare($comando);

            $sentencia->bindParam(1, $_POST["nombre"]);
                       
            $sentencia->bindParam(2, $_POST["correo"]);
                       
            $sentencia->bindParam(3, $_POST["telefono"]);
            
            $sentencia->bindParam(4, $_POST["mensaje"]);
            
            if($sentencia->execute()){
                $id =$pdo->lastInsertId();

            }
            return $id;
             
        } catch (PDOException $e) {
            
            throw new ExcepcionApi(self::ERROR, $e->getMessage(), 500);
            
        }

    }
    private function leido(){

        $id = $_POST["id"];
        $estatus = $_POST["estatus"];

        $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
        $comando = "update ". self::NOMBRE_TABLA. " set estatus = ". (($estatus == 0) ? 1: 0) ." where id = ".$id;
        $sentencia = $pdo->prepare($comando);
        if($sentencia->execute())
        {
            return true;
        }else{
            return false;
        }
    }

    private function listar(){

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();


             $fechaIni = $_POST["fechaInicio"];
             $fechaFin = $_POST["fechaFin"];
             $folio =  $_POST["id"];
             $estatus =  $_POST["estatus"];
             $fechaWhere = "";
             $estatuswhere = "";
             $where  = "";
             $foliowhere = ($folio != "") ? " id = ".$folio : "";
             $where = "";
             $pagina = $_POST["pagina"] -1;
             $offset =  PERPAGE * $pagina; 
             if($fechaIni != "" && $fechaFin != ""){
                $fechaWhere =  " fecha between STR_TO_DATE('". $fechaIni . "', '%m/%d/%Y') and  STR_TO_DATE('". $fechaFin . "', '%m/%d/%Y') ";

             }
             if($estatus > -1){
                $estatuswhere = " estatus = ". $estatus; 
            }




            // Sentencia INSERT
            $comando = "SELECT count(id) as num_rows from  " . self::NOMBRE_TABLA;

            
            if($foliowhere != ""){
                $where .= ($where == "") ? " WHERE ".$foliowhere : "AND ".$foliowhere; 
            }
            if($fechaWhere != ""){
                $where .= ($where == "") ? " WHERE ".$fechaWhere : "AND ".$fechaWhere;    
            }
            if($estatus > -1){
                $where .= ($where == "") ? " WHERE ".$estatuswhere : "AND ".$estatuswhere;    
            }
           

            $sentencia = $pdo->prepare($comando.$where);
            
            $contactanos = new contactanos();

            if($sentencia->execute())
            {
                $contactanos->totalresultados = $sentencia->fetch()["num_rows"];
                $contactanos->paginas = floor($contactanos->totalresultados/PERPAGE);
                if($contactanos->totalresultados%PERPAGE > 0){
                    $contactanos->paginas += 1; 
                }

                $comando = "select count(id) as num_rows from ". self::NOMBRE_TABLA;
                $sentencia = $pdo->prepare($comando.$where);
                
                if($sentencia->execute())
                {
                    $contactanos->totalresultados = $sentencia->fetch()["num_rows"];

                    $comando = "select id, nombre, correo, telefono, mensaje, fecha, estatus from ". self::NOMBRE_TABLA;
                    $sentencia = $pdo->prepare($comando.$where." order by fecha desc " ." limit ".$offset.",".PERPAGE);
                    if($sentencia->execute())
                    {
                        $contactanos->resultados = $sentencia->fetchall();
                        $contactanos->pagina = $_POST["pagina"];
                        // for($fetch as $i){
                        //     $foo = new contactanos();
                        //     $foo->nombre = $fetch[$i]["nombre"];
                        //     $foo->correo = $fetch[$i]["correo"];
                        //     $foo->telefono = $fetch[$i]["telefono"];
                        //     $foo->mensaje= $fetch[$i]["mensaje"];
                        //     $foo->fecha = $fetch[$i]["fecha"];
                        //     $foo->estatus = $fetch[$i]["estatus"];
                        //     array_push($contactanos->resultados, $foo);
                        // }

                    }

                }

            }
            else{
                $contactanos->paginas = 0;
                $contactanos->pagina = 0;
                $contactanos->totalresultados = -1;
                $contactanos->resultados = [];
            }
            return $contactanos;
    }
}