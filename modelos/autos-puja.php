<?php

class autospuja
{
    
    public function __construct($idAuto =0, $idSubasta = 0)
    {
        $this->idAuto = $idAuto;
        $this->idSubasta = $idSubasta;
 
       
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

        }else if($peticion[0] == 'autosofertados'){
            return self::autosofertados();
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   


  
    

    

    public static function insertaOferta()
    {
        
        
        try {

            
            
 //               print_r($_SESSION);
                $pdo = ConexionBD::obtenerInstancia()->obtenerBD();


                $comando = "select case when now() < fechaFin then true else false END as valida  from subastas where idSubasta = ? ";
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
                
 
                
                
                

                

                $s = new subastas();

                $s = $s->infoSubasta($_POST["id_subasta"]);
                
                $autosofertados = self::autosofertados();
                $totalxusuario = sizeof($autosofertados);
                //= self::totalpujaxusuario();
                $ofertavalida = false;
                for($i = 0; $i < $totalxusuario; $i++){
                    if($autosofertados[i]["auto"] == $_POST["id_auto"]){
                        $ofertavalida = true;
                        break;
                    }
                }

                
               if($totalxusuario < $s[0]["ofertas_x_usuarios"] || $ofertavalida){
                    $sentencia = $pdo->prepare($comando);
                        $sentencia->bindParam(1, $_POST["id_auto"]);
                        $sentencia->bindParam(2, $_POST["id_subasta"]);
                        $sentencia->bindParam(3, $_SESSION['idusuario']);
                        $sentencia->bindParam(4, $_POST["oferta"]);
                        $resultado = $sentencia->execute();
                       
                     if ($resultado) {
                        return "Su oferta fue registrada";

                    } else {
                        return "Ocurrió un error al registrar su oferta";
                    }
                }else{
                    return "Imposible ofertar, solamente se puede participar por ".$s[0]["ofertas_x_usuarios"]. " autos en esta subasta.";
                } 
                


            
        } catch (Excepcion $e) {
            
            return "Ocurrió un error al registrar su oferta";
        }

    }

    public static function totalpujaxusuario(){
        try{
            //$comando = "SELECT count(*) as total_ofertas FROM autos_puja ap, usuario u WHERE ap.idUsuario = u.idUsuario and ap.idSubasta = ? and u.claveApi = ?";
            
            $comando = "SELECT count(distinct ap.idAuto) as total_ofertas FROM autos_puja ap, usuario u WHERE ap.idUsuario = u.idUsuario and ap.idSubasta = ? and u.claveApi = ?";
            //print_r($comando);
            //print_r($_POST);
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            $sentencia = $pdo->prepare($comando);
            
            $sentencia->bindParam(1, $_POST["id_subasta"]);
            $sentencia->bindParam(2, $_SESSION["claveapi"]);

            $resultado = $sentencia->execute();

            $fetch =  $sentencia->fetch(PDO::FETCH_ASSOC);

            return $fetch["total_ofertas"]; 

        }catch(Excepcion $e){
          
            return -1;
        }

    }

    public static function autosofertados(){
         try{
            //$comando = "SELECT count(*) as total_ofertas FROM autos_puja ap, usuario u WHERE ap.idUsuario = u.idUsuario and ap.idSubasta = ? and u.claveApi = ?";
            
            $comando = "SELECT distinct ap.idAuto as auto FROM autos_puja ap, usuario u WHERE ap.idUsuario = u.idUsuario and ap.idSubasta = ? and u.claveApi = ?";
            //print_r($comando);
            //print_r($_POST);
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            $sentencia = $pdo->prepare($comando);
            
            $sentencia->bindParam(1, $_POST["id_subasta"]);
            $sentencia->bindParam(2, $_SESSION["claveapi"]);

            $resultado = $sentencia->execute();

            $fetch =  $sentencia->fetchall(PDO::FETCH_ASSOC);

            return $fetch; 

        }catch(Excepcion $e){
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
     public static function xsubasta($idsubasta){

        try{
        $comando = "SELECT ap.idAuto, ap.idPuja, ap.oferta, ap.idUsuario, ap.hora_puja, ap.idSubasta, concat(u.nombre, ' ', u.appaterno, ' ', u.apmaterno) as nombre_usuario, ap.hora_puja, s.fechaFin, case when ap.hora_puja < s.fechaFin then 1 else 0 end as puja_valida, marca.descripcion as marca, modelo.descripcion as modelo, au.precio, au.anio
            FROM autos_puja ap, usuario u, subastas s, autos au, cat_marca marca, cat_modelo modelo  WHERE 
            ap.idUsuario = u.idUsuario
            and ap.idSubasta = s.idSubasta
            and ap.idSubasta = ? 
            and ap.idAuto = au.idAuto
            and au.marca = marca.id
            and au.modelo = modelo.id
            order by 
            ap.hora_puja desc ";
              $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            $sentencia = $pdo->prepare($comando);
            
            $sentencia->bindParam(1, $idsubasta);
            

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

    public static function participantes($idSubasta){
        $comando = "select distinct idUsuario from autos_puja where idSubasta = ?";
        $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
        $sentencia = $pdo->prepare($comando);
        $sentencia->bindParam(1, $idsubasta);
        $resultado = $sentencia->execute();
        return $sentencia->fetchall(PDO::FETCH_ASSOC);
    }
    
}
    