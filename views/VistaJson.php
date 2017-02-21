<?php


/**
 * Clase para imprimir en la salida respuestas con formato JSON
 */
class VistaJson extends VistaApi
{
    public function __construct($estado = 400)
    {
        $this->estado = $estado;
    }

    /**
     * Imprime el cuerpo de la respuesta y setea el código de respuesta
     * @param mixed $cuerpo de la respuesta a enviar
     */
    public function imprimir($cuerpo)
    {
        if($cuerpo == "OK"){
            http_response_code(200);
        }else{ 
            if ($this->estado) {
                http_response_code($this->estado);
            }
        }
        header('Content-Type: application/json; charset=utf8');
        echo json_encode($cuerpo, JSON_PRETTY_PRINT);
        exit;
    }
}