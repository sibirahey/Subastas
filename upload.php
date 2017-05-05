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

    if ( 0 < $_FILES['file']['error'] ) {
        echo 'ERROR: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
        
        $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $guid = guidv4();

        if($_POST["accion"] == "listausuarios"){





            move_uploaded_file($_FILES['file']['tmp_name'], 'userlist/' . $guid.".".$ext);
            echo $guid.".".$ext;

            
            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();
            
            $comando = "delete from subasta_usuario where idSubasta = ".$_POST["idsubasta"];

            $sentencia = $pdo->prepare($comando);

            $sentencia->execute();

            


            $fila = 1;
            if (($gestor = fopen('userlist/' . $guid.".".$ext, "r")) !== FALSE) {
                while (($datos = fgetcsv($gestor, 1000, ",")) !== FALSE) {

                    $numero = count($datos);
                    $fila++;
                    for ($c=0; $c < $numero; $c++) {
                        //echo $datos[$c] . "<br />\n";
                        if($c%4 == 0 && $c > 0){
                            
                            try{
                                if (!empty($datos[$c])) {
                                    
                                    
                                    $usuario = new usuarios();
                                    $usuario->nombre = $datos[$c];
                                    $usuario->appaterno = $datos[$c+1];
                                    $usuario->apmaterno = $datos[$c+2];
                                    $usuario->correo = $datos[$c+3];
                                    $usuario->verificado = 0;
                                    $usuario->contrasena = "INVITADO";
                                    $usuario->valido = 0;
                                    $usuario->publico = 0;
                                    $usuario->esadmin = 0;
                                    
                                    usuarios::invitarUsuario($usuario, $_POST["idsubasta"]);


                                }
                            }catch(Exception $er){

                            }
                        }
                    }
                }
                fclose($gestor);
            }

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