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
require_once('utilidades/ConexionBD.php');
require_once('utilidades/ExcepcionApi.php');
require_once('utilidades/Utilerias.php');


//print ConexionBD::obtenerInstancia()->obtenerBD()->errorCode();
//print_r(array_shift($_GET['PATH_INFO']));

$vista = new VistaJson();

set_exception_handler(function ($exception) use ($vista) {
	    $cuerpo = array(
	        "estado" => $exception->estado,
	        "mensaje" => $exception->getMessage()
	    );
	    if ($exception->getCode()) {
	        $vista->estado = $exception->getCode();
	    } else {
	        $vista->estado = 500;
	    }

	    $vista->imprimir($cuerpo);
	}
);


// Obtener recurso
//print $peticion;
//$recurso = array_shift($peticion);
//recursos_existentes = array('contactos', 'usuarios');

// Comprobar si existe el recurso



$metodo = strtolower($_SERVER['REQUEST_METHOD']);


$arreglo = explode('/', $_GET['PATH_INFO']);
$modelo = $arreglo[0];

$arreglo = array_pop($arreglo);
$arreglo = explode(' ',$arreglo);

switch ($metodo) {
    case 'get':
        break;

    case 'post':

    	ejecutaModeloPost($vista, $modelo, $arreglo);
    	//$vista->imprimir(usuarios::post($arreglo));
		
        break;

    case 'put':
        break;

    case 'delete':
        break;

    default:
        // Método no aceptado

}


function ejecutaModeloPost($vista, $mod, $arr)
{

    switch ($mod) {
    	case 'usuarios':
    		$vista->imprimir(usuarios::post($arr));
    		break;
    	case 'categorias':
    		$vista->imprimir(categorias::post($arr));
    		break;
        case 'empresas':
            $vista->imprimir(empresas::post($arr));
            break;
        case 'tiposubastas':
            $vista->imprimir(tiposubastas::post($arr));
            break;
        case 'subastas':
            $vista->imprimir(subastas::post($arr));
            break;
        case 'cotizacion':
            $vista->imprimir(cotizacion::post($arr));
            break;
        default:
    		# code...
    		break;
    }
}
