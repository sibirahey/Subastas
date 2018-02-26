<?php

require_once("views/VistaApi.php");
require_once("views/VistaJson.php");
require_once("modelos/usuarios.php");
require_once("modelos/categorias.php");
require_once("modelos/empresas.php");
require_once("modelos/tiposubastas.php");
require_once("modelos/subastas.php");
require_once("modelos/subasta-empresa.php");
require_once("modelos/cotizacion.php");
require_once("modelos/cotizacion-servicios.php");
require_once("modelos/servicios.php");
require_once("modelos/subServicios.php");
require_once("modelos/estados.php");
require_once("modelos/municipios.php");
require_once("modelos/marcas.php");
require_once("modelos/modelos.php");
require_once("modelos/features.php");
require_once("modelos/colores.php");
require_once("modelos/transmisiones.php");
require_once("modelos/autos.php");
require_once("modelos/autos-features.php");
require_once("modelos/autos-fotos.php");
require_once("modelos/subasta-autos.php");
require_once("modelos/seccioneshome.php");
require_once('utilidades/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('utilidades/Utilerias.php');
require_once('modelos/invitacion.php');

if(isset($_FILES['file'])){
    if ( 0 < $_FILES['file']['error'] ) {
        echo 'ERROR: ' . $_FILES['file']['error'] . '<br>';
    }
    
    
    $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $guid = guidv4();



    if(!isset($_POST["accion"])){
        $_POST["accion"] = "";
    }

    if($_POST["accion"] == "listausuarios"){



        $contador = 0;
        $total= 0;

        move_uploaded_file($_FILES['file']['tmp_name'], 'userlist/' . $guid.".".$ext);
       

        
        $fila = 0;
        ini_set('auto_detect_line_endings',true);
        if (($gestor = fopen('userlist/' . $guid.".".$ext, "r")) !== FALSE) {
            
            while (($datos = fgetcsv($gestor)) !== FALSE) {
                //print_r($datos); 
                $total++;
                $numero = count($datos);
                //echo "cuenta: ".$numero;
                $fila++;
                //for ($c=4; $c < $numero; $c++) {
                    

                    //if($c%4 == 0 && $c > 0){
                        
                        try{
                            if ($fila > 1) {

                                $usuario = new usuarios();
                                $usuario->nombre = $datos[0];
                                $usuario->appaterno = $datos[1];
                                $usuario->apmaterno = $datos[2];
                                $usuario->correo = $datos[3];
                                $usuario->verificado = 0;
                                $usuario->contrasena = "INVITADO";
                                $usuario->valido = 0;
                                $usuario->publico = 0;
                                $usuario->esadmin = 0;
                                $usuario->telefono = $datos[4];
                                
                                if(usuarios::invitarUsuario($usuario, $_POST["idsubasta"])){
                                     $contador++;
                                }


                            }
                        }catch(Exception $er){

                        }
                    //}
                //}
            }
            fclose($gestor);
        }
        ini_set('auto_detect_line_endings',FALSE);
        // echo $guid.".".$ext;
        if($total > 1)
        {
            $total = $total -1;
        }

         echo $total.".".$contador;

    }else if($_POST["accion"] == "home"){
        try{
            move_uploaded_file($_FILES['file']['tmp_name'], 'images/home/' . $guid.".".$ext);
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            $comando = "update cat_seccioneshome set url = '"."images/home/" . $guid.".".$ext."' where id = ".$_POST["id"];
            echo $comando;
            $sentencia = $pdo->prepare($comando);

            $sentencia->execute();
            echo $guid.".".$ext;
        }
        catch(Exception $ex){

            echo "ERROR".$ex;
        }

    }
    else{
      
      
        move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $guid.".".$ext);
        echo $guid.".".$ext;
    }
}


function guidv4()
{
    if (function_exists('com_create_guid') === true)
        return trim(com_create_guid(), '{}');

    $data = openssl_random_pseudo_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
?>