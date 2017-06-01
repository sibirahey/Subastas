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
        }else if ($peticion[0] == 'ofertasxusuario'){

            return self::totalpujaxusuario($_POST);
        } 
        else if($peticion[0] == 'listar') {

            return self::listar();
        } else if($peticion[0] == 'ganadores'){

        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   


  
    

    

    public static function insertaOferta()
    {
        
        
        try {

            
            
                $pdo = ConexionBD::obtenerInstancia()->obtenerBD();


                $comando = "select case when curdate() < fechaFin+1 then true else false END as valida  from subastas where idSubasta = ? ";
                $sentencia = $pdo->prepare($comando);
                $sentencia->bindParam(1, $_POST["id_subasta"]);
                $resultado = $sentencia->execute();
                $fetch =  $sentencia->fetch(PDO::FETCH_ASSOC);
                
                if($fetch["valida"] == 0){
                    return "Imposible ofertar, la substasta ha terminado";
                }

                // Sentencia INSERT
                $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                    self::ID_AUTO . "," .
                    self::ID_SUBASTA . "," .
                    self::ID_USUARIO  . "," .
                    self::OFERTA. ")" .
                    " VALUES(?,?,?,?)";

                $u = new usuarios();
                
                $u = $u->rememberme();
                
                
                

                

                $s = new subastas();

                $s = $s->infoSubasta($_POST["id_subasta"]);
                

                $totalxusuario = self::totalpujaxusuario();
                
               if($totalxusuario < $s[0]["ofertas_x_usuarios"]){
                    $sentencia = $pdo->prepare($comando);
                        $sentencia->bindParam(1, $_POST["id_auto"]);
                        $sentencia->bindParam(2, $_POST["id_subasta"]);
                        $sentencia->bindParam(3, $u->idUsuario);
                        $sentencia->bindParam(4, $_POST["oferta"]);
                        $resultado = $sentencia->execute();
                       
                     if ($resultado) {
                        return "Su oferta fue registrada";

                    } else {
                        return "Ocurrió un error al registrar su oferta";
                    }
                }else{
                    return "Imposible ofertar, usted acumula ". $totalxusuario. " de ".$s[0]["ofertas_x_usuarios"]. " posibles";
                } 
                


            
        } catch (Excepcion $e) {
            
            return "Ocurrió un error al registrar su oferta";
        }

    }

    public static function totalpujaxusuario(){
        try{
            $comando = "SELECT count(*) as total_ofertas FROM autos_puja ap, usuario u WHERE ap.idUsuario = u.idUsuario and ap.idSubasta = ? and u.claveApi = ?";
            
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            $sentencia = $pdo->prepare($comando);
            
            $sentencia->bindParam(1, $_POST["id_subasta"]);
            $sentencia->bindParam(2, $_POST["claveapi"]);

            $resultado = $sentencia->execute();

            $fetch =  $sentencia->fetch(PDO::FETCH_ASSOC);

            return $fetch["total_ofertas"]; 

        }catch(Excepcion $e){
            print_r($e);
            return -1;
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

    public static function ganadores($idsubasta){
        $comando = "SELECT ap.idAuto, ap.idPuja, ap.oferta, ap.idUsuario, ap.hora_puja, ap.idSubasta, concat(u.nombre, ' ', u.appaterno, ' ', u.apmaterno) as nombre_usuario FROM autos_puja ap, usuario u, subastas s WHERE ap.idUsuario = u.idUsuario and ap.idSubasta = ?   and s.idSubasta = ap.idSubasta and ap.hora_puja < s.fechaFin +1 ";


    }

    
    
}
