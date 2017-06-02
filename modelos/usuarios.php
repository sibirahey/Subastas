<?php

class usuarios
{

  

    public function __construct($nombre ="", $appaterno = "", $apmaterno = "", $correo ="", $verificado = 0, $contrasena="", $valido=0, $publico = 1, $esadmin=0, $claveApi = "")
    {
        $this->nombre = $nombre;
        $this->appaterno = $appaterno;
        $this->apmaterno = $apmaterno;
        $this->correo = $correo;
        $this->verificado = $verificado;
        $this->contrasena = $contrasena;
        $this->valido = $valido;
        $this->publico = $publico;
        $this->esadmin= $esadmin;
        $this->claveApi = $claveApi;
        $this->idUsuario = 0;
   
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "usuario";
    const APPATERNO = "appaterno";
    const APMATERNO = "apmaterno";
    const FECHA_NAC = "fecha_nacimiento";
    const ID_USUARIO = "idUsuario";
    const NOMBRE = "nombre";
    const CONTRASENA = "contrasena";
    const CORREO = "correo";
    const VERIFICADO = "verificado";
    const CLAVE_API = "claveApi";
    const MAIL_BIENVENIDO = "Bienvenido a Escudería";
    const ESTADO_CREACION_EXITOSA = 200;
    const ESTADO_CREACION_FALLIDA = 400;
    const ESTADO_URL_INCORRECTA = "Error en el método";
    const PASSWORD_DEFAULT = "1234567890";



    public static function post($peticion)
    {
        if ($peticion[0] == 'registro') {
            return self::crear($_POST);
        } else if ($peticion[0] == 'login') {
            return self::login();
        }else if ($peticion[0] == 'rememberme'){
            return self::rememberme();
        } 
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   

    
    private function crear($usuario)
    {
        
        $contrasenaEncriptada = self::encriptarContrasena( $usuario["password"]);

       

        $claveApi = self::generarClaveApi();

        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::NOMBRE . "," .
                self::APPATERNO . "," .
                self::APMATERNO . "," .
                self::CONTRASENA . "," .
                self::FECHA_NAC . "," .
                self::CLAVE_API . "," .
                self::CORREO . "," .
                self::VERIFICADO . ")" .
                " VALUES(?,?,?,?,?,?,?,?)";
        

            $sentencia = $pdo->prepare($comando);


            $sentencia->bindParam(1, $usuario["nombre"]);
                       
            $sentencia->bindParam(2, $usuario["appaterno"]);
                       
            $sentencia->bindParam(3, $usuario["apmaterno"]);

            $sentencia->bindParam(4, $contrasenaEncriptada);
         
            $fecha = $usuario["yyyy"]."-".$usuario["mm"]."-".$usuario["dd"];
            
            $sentencia->bindParam(5, $fecha);
            
            $sentencia->bindParam(6, $claveApi);

            $sentencia->bindParam(7, $usuario["email"]);

            $verificado = 0;
            $sentencia->bindParam(8, $verificado);
            

 
            $resultado = $sentencia->execute();
            $usuarioid = $pdo->lastInsertId();
           
            if ($resultado) {

                envia_mail($usuario["email"], self::MAIL_BIENVENIDO, "<p>Bienvenido a escudería</p><p>Para terminar su registro por favor confirme su mail: </p><p><a href=\"msusano.com/Subastas/usuarios/confirmar/". $claveApi."&u=".$usuarioid.\">Confirmar mail</a></p>");
                return 1;
            } else {
                return 0;
            }
        } catch (PDOException $e) {

            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    public function invitarUsuario($usuario, $idSubasta){
      
       

        $claveApi = self::generarClaveApi();

        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();


            $comando = "SELECT ".self::ID_USUARIO.",".self::CORREO." from ". self::NOMBRE_TABLA . " where ".self::CORREO . " = ? limit 1";

            $sentencia = $pdo->prepare($comando);

            $sentencia->bindParam(1, $usuario->correo);

            $cuenta = 0;
            $resultado = false;
            $usuarioid = 0;

            if ($sentencia->execute()){
                $resultado = $sentencia->fetchall(PDO::FETCH_ASSOC);
                $cuenta = count($resultado);
                if($cuenta > 0 ){
                    $usuarioid = $resultado[0][self::ID_USUARIO];
                }

           
                
            }
            else{
                $cuenta = 0;
            }


            

            if($cuenta < 1){
            

     

                $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                    self::NOMBRE . "," .
                    self::APPATERNO . "," .
                    self::APMATERNO . "," .
                    self::CORREO . "," .
                    self::VERIFICADO . "," .
                    self::CLAVE_API .")" .
                    " VALUES(?,?,?,?,?,?)";
            

                $sentencia = $pdo->prepare($comando);

                $usuario->verificado = 0;
                
                
                $sentencia->bindParam(1, $usuario->nombre);
                $sentencia->bindParam(2, $usuario->appaterno);
                $sentencia->bindParam(3, $usuario->apmaterno);
                $sentencia->bindParam(4, $usuario->correo);
                $sentencia->bindParam(5, $usuario->verificado);
                $sentencia->bindParam(6, $claveApi);
                
                $resultado = $sentencia->execute();
                $usuarioid = $pdo->lastInsertId();


                

            }

            
            if ($usuarioid > 0) {

                $comando = " insert into subasta_usuario ( idSubasta, idUsuario) values (?,?)";
                

                $sentencia = $pdo->prepare($comando);

                $sentencia->bindParam(1, $idSubasta);
                $sentencia->bindParam(2, $usuarioid);

                $sentencia->execute();

                envia_mail($usuario->correo, self::MAIL_BIENVENIDO, "<html><body>Bienvenido a escudería, para terminar su registro por favor confirme su mail: <a href=\"msusano.com/Subastas/usuarios/confirmar/". $claveApi."\">Confirmar mail</a></body></html>", "yo@msusano.com" );
                return self::ESTADO_CREACION_EXITOSA;
            } else {
                return self::ESTADO_CREACION_FALLIDA;
            }
        } catch (PDOException $e) {

            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }
    private function encriptarContrasena($contrasenaPlana)
    {
        if ($contrasenaPlana)
            return password_hash($contrasenaPlana, PASSWORD_DEFAULT);
        else return null;
    }

    private function generarClaveApi()
    {
        return md5(microtime().rand());
    }
    // private function registrar()
    // {
    //     $cuerpo = file_get_contents('php://input');
    //     $usuario = json_decode($cuerpo);

    //     $resultado = self::crear($_POST);

    //     switch ($resultado) {
    //         case self::ESTADO_CREACION_EXITOSA:
    //            http_response_code(200);
    //            return "OK";
               
    //             break;
    //         case self::ESTADO_CREACION_FALLIDA:
    //             throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
    //             break;
    //         default:
    //             throw new ExcepcionApi(self::ESTADO_FALLA_DESCONOCIDA, "Falla desconocida", 400);
    //     }
    // }

    public function rememberme(){
        $claveapi = $_POST["claveapi"];
        $comando = "SELECT idUsuario, nombre, appaterno, apmaterno, correo, verificado, contrasena, publico, es_admin, claveApi from usuario where ".self::CLAVE_API." = '".$claveapi."' and curdate() < vigencia+1 ";
        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
        $sentencia->bindParam(1, $claveapi);

        if ($sentencia->execute())
        {
            $fetch = $sentencia->fetch(PDO::FETCH_ASSOC);
            $usuario = new usuarios();
            if($fetch["contrasena"] != null){
           
                $usuario->idUsuario = $fetch["idUsuario"];
                $usuario->nombre = $fetch["nombre"];
                $usuario->appaterno = $fetch["appaterno"];
                $usuario->apmaterno = $fetch["apmaterno"];
                $usuario->correo = $fetch["correo"];
                $usuario->verificado = $fetch["verificado"];
                $usuario->contrasena = $fetch["contrasena"];
                $usuario->valido = 1;
                $usuario->publico = $fetch["publico"];
                $usuario->esadmin = $fetch["es_admin"];
                $usuario->claveApi = $fetch["claveApi"];
            }

            return $usuario;
        } 
        else
            return "error";

    }

    private function login(){
        
        $mail = $_POST["email"];
        $password = $_POST["password"];
       
            // Sentencia INSERT
        $comando = "SELECT nombre, appaterno, apmaterno, correo, verificado, contrasena, publico, es_admin from usuario where correo =? ";
        
        
         $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
         $sentencia = $pdo->prepare($comando);
        $sentencia->bindParam(1, $mail);
        if ($sentencia->execute())
        {
            $fetch = $sentencia->fetch(PDO::FETCH_ASSOC);
            
            $valido = password_verify($password, $fetch["contrasena"]);
            
            if($valido == 1){
                $claveApi = self::generarClaveApi();
                $comando = "update ".self::NOMBRE_TABLA." set claveApi = '".$claveApi."', vigencia = DATE_ADD(NOW(), INTERVAL 8 HOUR) where correo = '".  $mail."'";
                $sentencia = $pdo->prepare($comando);
                $sentencia->execute();

            }
            $usuario = new usuarios();
            $usuario->nombre = $fetch["nombre"];
            $usuario->appaterno = $fetch["appaterno"];
            $usuario->apmaterno = $fetch["apmaterno"];
            $usuario->correo = $fetch["correo"];
            $usuario->verificado = $fetch["verificado"];
            $usuario->contrasena = $fetch["contrasena"];
            $usuario->valido = $valido;
            $usuario->publico = $fetch["publico"];
            $usuario->esadmin = $fetch["es_admin"];
            $usuario->claveApi =  $claveApi;


         



            return $usuario;
        } 
        else
            return "error";
       
       

        
    
    }


    private function obtenerUsuarioPorCorreo($correo)
    {
        $comando = "SELECT " .
            self::NOMBRE . "," .
            self::CONTRASENA . "," .
            self::CORREO . "," .
            self::CLAVE_API .
            " FROM " . self::NOMBRE_TABLA .
            " WHERE " . self::CORREO . "=?";

        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

        $sentencia->bindParam(1, $correo);

        if ($sentencia->execute())
            return $sentencia->fetch(PDO::FETCH_ASSOC);
        else
            return null;
    }
    
}