<?php

class autospuja
{
    
    public function __construct($idAuto =0, $idSubasta = 0)
    {
        $this->idAuto = $idAuto;
        $this->idFoto = $idFoto;
 
       
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "autos_puja";
    const ID_AUTO = "idAuto";
    const ID_SUBASTA = "idSubasta";
    const ID_USUARIO = "idUsuario";
    const OFERTA = "oferta";
   
    const SIN_RESULTADOS = "No se encontraron resultados";
    const LISTO = "OK";
    const ESTADO_CREACION_EXITOSA = "OK";
    const ESTADO_CREACION_FALLIDA = "ERROR";

    public static function post($peticion)
    {
     
      
        if ($peticion[0] == 'ofertar') {
            return self::insertaOferta();
        } else if($peticion[0] == 'listar') {

            return self::listar();
        } 
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   


  
    

    

    public static function insertaOferta()
    {
        
        $resultado = false;
        try {

            
            
                $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

                // Sentencia INSERT
                $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                    self::ID_AUTO . "," .
                    self::ID_SUBASTA . "," .
                    self::ID_USUARIO  . "," .
                    self::OFERTA. ")" .
                    " VALUES(?,?,?,?)";

                $u = new usuarios();
                
                $u = $u->rememberme();
                

                $sentencia = $pdo->prepare($comando);
                $sentencia->bindParam(1, $_POST["id_auto"]);
                $sentencia->bindParam(2, $_POST["id_subasta"]);
                $sentencia->bindParam(3, $u->idUsuario);
                $sentencia->bindParam(4, $_POST["oferta"]);
                $resultado = $sentencia->execute();
               
             if ($resultado) {
                return true;
            } else {
                return false;
            }
            
        } catch (Excepcion $e) {
            
            print_r($e);
            //throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            return false;
            
        }

    }

    public static function listar(){

        try{
        $comando = "SELECT ap.idAuto, ap.idPuja, ap.oferta, ap.idUsuario, ap.hora_puja, ap.idSubasta, concat(u.nombre, ' ', u.appaterno, ' ', u.apmaterno) as nombre_usuario
            FROM autos_puja ap, usuario u  WHERE 
            ap.idUsuario = u.idUsuario
            and ap.idSubasta = ? and ap.idAuto = ?
            order by 
            ap.oferta, ap.hora_puja desc";
              $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            $sentencia = $pdo->prepare($comando);
            
            $sentencia->bindParam(1, $_POST["id_subasta"]);
            $sentencia->bindParam(2, $_POST["id_auto"]);

            $resultado = $sentencia->execute();
            return $sentencia->fetchall(PDO::FETCH_ASSOC);

        }catch(Excepcion $e){
            print_r($e);
            return null;
        }
    }

    
    
}
