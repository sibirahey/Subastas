<?php

class autos
{
    
    public function __construct()
    {

       
    }

    // Datos de la tabla "usuario"
    const NOMBRE_TABLA = "autos";
    const IDAUTO = "idAuto";
    const ENVENTA = "enVenta";
    const PRECIO = "precio";
    const MARCA = "marca";
    const MODELO = "modelo";
    const COLOR = "color";
    const ANIO = "anio";
    const KM = "km";
    const TRANSMISION = "transmision";
    const ESTADO = "estado";
    const CIUDAD = "ciudad";
    const DESCRIPCION = "descripcion";
    const ESTATUS = "estatus";
    const PUBLICADO = "publicado";
    const MOTIVO_PRECIO = "motivo_precio";
    const FECHACREACION = "fechaCreacion";



    const SIN_RESULTADOS = "No se encontraron resultados";
    const LISTO = "OK";
    const ESTADO_CREACION_EXITOSA = "OK";
    const ESTADO_CREACION_FALLIDA = "ERROR";

    public static function post($peticion)
    {
     
      
        if ($peticion[0] == 'guardar') {
            return self::registrarOut();
        }else if($peticion[0] == 'info')
            return self::info($_POST['autoid']);
        else if($peticion[0] == 'subasta'){
            return self::listarPorSubastas();
        }else if($peticion[0] == 'actualiza') {
            return self::actualiza($_POST);
        }
        else if($peticion[0] == 'busqueda'){

            return self::busqueda();
        }
        else {
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, "Url mal formada", 400);
        }
    }   


    public function listarPorSubastas()
    {
        try{
            $idsubasta = $_POST['idsubasta'];
            
            $comando =  " SELECT au.idAuto, au.enVenta, au.precio, au.marca as marcaid, marca.descripcion as marca, au.modelo as modeloid, ".
                        " modelo.descripcion as modelo, au.color as colorid, color.descripcion as color, au.anio, au.km, au.km, au.transmision as transmisionid, ".
                        " trans.descripcion as transmision, au.estado as estadoid, est.nombre as estado, au.ciudad as ciudadid, mun.nombre as ciudad,  ".
                        " au.descripcion, au.estatus, au.publicado, au.fechaCreacion, aus.subastaId, ".
                        " (select idFoto from auto_fotos where idAuto = au.idAuto limit 1) as foto, ".
                        " (select GROUP_CONCAT(idFoto) from auto_fotos where idAuto = au.idAuto) AS fotos, ".
                        "   IFNULL((select oferta  from autos_puja ap where ap.idAuto = aus.autoId and ap.hora_puja < sub.fechaFin order by ap.hora_puja desc limit 1), au.precio) as oferta, ".
                        " (select count(*) from autos_puja ap where ap.idAuto = aus.autoId and ap.hora_puja < sub.fechaFin) as total_ofertas, ".
                        " sub.idTipoSubasta, (CASE WHEN now() BETWEEN sub.fechaInicio and sub.fechaFin then 'ACTIVA' WHEN now() < sub.fechaInicio then 'AGENDADA' else 'TERMINADA' end) as estatus_subasta, sub.incremento ".
                        " FROM subastas_autos as aus, autos as au, cat_marca as marca, cat_modelo as modelo, cat_colores as color, cat_transmision as trans, estados as est, municipios as mun, subastas sub ".
                        " WHERE aus.subastaId = ?  ".
                        " and aus.autoId = au.idAuto  ".
                        " and au.marca = marca.id  ".
                        " and au.modelo = modelo.id  ".
                        " and au.color = color.id  ".
                        " and au.transmision = trans.id  ".
                        " and au.estado = est.id ".
                        " and au.ciudad = mun.id ".
                        " and aus.subastaId = sub.idSubasta ";

                        if(isset($_POST["autoid"])){
                           $comando .=  " and aus.autoId = ?"; 
                        }


            
            
            $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);
            
            $sentencia->bindParam(1, $idsubasta);
            if(isset($_POST["autoid"])){
                $sentencia->bindParam(2, $_POST["autoid"]);
            }

         
            if ($sentencia->execute())
                return $sentencia->fetchall(PDO::FETCH_ASSOC);
            else
                return null;
        }catch(Excepcion $e){

            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
        }
   }

   private function info($idauto){

    try{

          $comando =  " SELECT au.idAuto, au.enVenta, au.precio, au.marca as marcaid, marca.descripcion as marca, au.modelo as modeloid,  ".
                " modelo.descripcion as modelo, au.color as colorid, color.descripcion as color, au.anio, au.km, au.km, au.transmision as transmisionid,  ".
                " trans.descripcion as transmision, au.estado as estadoid, est.nombre as estado, au.ciudad as ciudadid, mun.nombre as ciudad,   ".
                " au.descripcion, au.estatus, au.publicado, au.fechaCreacion,  ".
                " (select idFoto from auto_fotos where idAuto = au.idAuto limit 1) as foto,  ".
                "  (select GROUP_CONCAT(idFoto) from auto_fotos where idAuto = au.idAuto) AS fotos,  ".
                "  (select GROUP_CONCAT(idFeature) from autos_catacteristicas where idAuto = au.idAuto) AS caracteristicasids,  ".
                "  (select GROUP_CONCAT(feat.descripcion) from autos_catacteristicas ac, cat_features feat where  ac.idFeature = feat.id and ac.idAuto = 20 ) as caracteristicas, au.motivo_precio ".
                " FROM autos as au, cat_marca as marca, cat_modelo as modelo, cat_colores as color, cat_transmision as trans, estados as est, municipios as mun  ".
                " WHERE au.marca = marca.id   ".
                " and au.modelo = modelo.id   ".
                " and au.color = color.id   ".
                " and au.transmision = trans.id   ".
                " and au.estado = est.id  ".
                " and au.ciudad = mun.id  ".
                " and au.idAuto =   ".$idauto;



        $sentencia = ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

        if ($sentencia->execute())
            return $sentencia->fetch(PDO::FETCH_ASSOC);
        else
            return null;
    }catch(Excepcion $e){
        throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
    }
  
        
                                   
}

    private function busqueda(){
        
        $precioIni = $_POST["precioIni"];
        $precioFin = $_POST["precioFin"];
        $kmIni = $_POST["kmIni"];
        $kmFin = $_POST["kmFin"];
        $anio = $_POST["anio"];
        $marcaId = $_POST["marcaId"];
        $modeloId = $_POST["modeloId"];
        $estadoId = $_POST["estadoId"];
        $descripcion = $_POST["descripcion"];


        $comando ="SELECT au.idAuto, au.enVenta, au.precio, au.marca as marcaid, marca.descripcion as marca, au.modelo as modeloid, modelo.descripcion as modelo," . 
            " au.color as colorid, au.descripcion as color, au.anio, au.km, au.km, au.transmision as transmisionid, trans.descripcion as transmision, " . 
            " au.estado as estadoid, est.nombre as estado, au.ciudad as ciudadid, mun.nombre as ciudad, au.descripcion, au.estatus," . 
            " au.publicado, au.fechaCreacion, " . 
            " (select idFoto from auto_fotos where idAuto = au.idAuto limit 1) as foto," . 
            " (select GROUP_CONCAT(idFoto) from auto_fotos where idAuto = au.idAuto) AS fotos " . 
            " FROM  autos as au, cat_marca as marca, cat_modelo as modelo, cat_colores as color, cat_transmision as trans, estados as est, municipios as mun " . 
            " WHERE  au.marca = marca.id " . 
            " and au.modelo = modelo.id " . 
            " and au.color = color.id " . 
            " and au.transmision = trans.id " . 
            " and au.estado = est.id " . 
            " and au.ciudad = mun.id " . 
            " and au.enVenta = 1 " . 
            (($precioIni <=0 && $precioFin <=0)? "":" and precio between  ? AND ?") . 
            (($anio <=0) ?"":" and anio = ? ") . 
            (($kmIni <=0 && $kmFin<=0) ? "" : " and au.km between ? AND ? ") . 
            (($marcaId <=0) ? "" : " and au.marca = ? " ) . 
            (($estadoId<=0) ? "" : " and au.estado = ? ")  . 
            (($descripcion =='') ? "" :  " and au.descripcion like '%?%' ") .
            (($modeloId <= 0) ? "" :  " and au.modelo = ? ");

            $comando .= " ORDER BY au.fechaCreacion DESC ";

            //print_r($comando);

            

            $sentencia =ConexionBD::obtenerInstancia()->obtenerBD()->prepare($comando);

           $paramNum = 1;

            if ($precioIni >0 && $precioFin >0){
                $sentencia->bindParam($paramNum, $precioIni);
                $paramNum++;
                $sentencia->bindParam($paramNum,$precioFin);
                $paramNum++;

            }
            if ($anio >0) {

                $sentencia->bindParam($paramNum,$anio);
                $paramNum++;
            } 
            if ($kmIni >0 && $kmFin>0){

                $sentencia->bindParam($paramNum, $kmIni);
                $paramNum++;
                $sentencia->bindParam($paramNum,$kmFin);
                $paramNum++;
            }  
            if ($marcaId >0) {

                $sentencia->bindParam($paramNum,$marcaId);
                $paramNum++;
            }
            if ($estadoId>0) {

                $sentencia->bindParam($paramNum,$estadoId);
                $paramNum++;
            }
            if ($descripcion !="") {

                $sentencia->bindParam($paramNum,$descripcion);
                $paramNum++;
                
            }
            if ($modeloId >0) {

                $sentencia->bindParam($paramNum,$modeloId);
                
            }
           
            if ($sentencia->execute()){
                return $sentencia->fetchall(PDO::FETCH_ASSOC);
            }else
            {
                return null;
            }

            
    }


    private function registrarOut()
    {
        $cuerpo = file_get_contents('php://input');
        $usuario = json_decode($cuerpo);
        
        $resultado = self::registrar($_POST);
        
        switch ($resultado) {
            case self::ESTADO_CREACION_EXITOSA:
               http_response_code(200);
               return "OK";
               
                break;
            case self::ESTADO_CREACION_FALLIDA:
                throw new ExcepcionApi(self::ESTADO_CREACION_FALLIDA, "Ha ocurrido un error");
                break;
            default:
                http_response_code(200);
                return $resultado;
        }
    }

    private function registrar($auto)
    {
        
        
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "INSERT INTO " . self::NOMBRE_TABLA . " ( " .
                self::ENVENTA . "," .
                self::PRECIO ."," .
                self::MARCA . "," .
                self::MODELO . ",".
                self::COLOR . ",".
                self::ANIO . ",".
                self::KM . ",".
                self::TRANSMISION . ",".
                self::ESTADO . ",".
                self::CIUDAD . ",".
                self::DESCRIPCION . ",".
                self::ESTATUS . ",".
                self::PUBLICADO . ",".
                self::MOTIVO_PRECIO.")" .
                " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            
            $desc = json_decode($auto["descripcion"]);
            $sentencia = $pdo->prepare($comando);
            $sentencia->bindParam(1, $auto["enVenta"]);
            $sentencia->bindParam(2, $auto["precio"]);
            $sentencia->bindParam(3, $auto["marca"]);
            $sentencia->bindParam(4, $auto["modelo"]);
            $sentencia->bindParam(5, $auto["color"]);
            $sentencia->bindParam(6, $auto["anio"]);
            $sentencia->bindParam(7, $auto["km"]);                          
            $sentencia->bindParam(8, $auto["transmision"]);                          
            $sentencia->bindParam(9, $auto["estado"]);                          
            $sentencia->bindParam(10, $auto["ciudad"]);                          
            $sentencia->bindParam(11, $desc);     
            $sentencia->bindParam(12, $auto["estatus"]);                          
            $sentencia->bindParam(13, $auto["publicado"]); 
            $sentencia->bindParam(14, $auto["motivo_precio"]);                          

            //idAuto, enVenta, marca, modelo, color, anio, km, transmision, estado, ciudad, descripcion, estatus, publicado, fechaCreacion
                   



            $resultado = $sentencia->execute();

          
            if ($resultado) {
                $idAuto = $pdo->lastInsertId();


                autosfeatures::registrar($auto["features"], $idAuto);
                autosfotos::registrar($auto["fotos"], $idAuto);

                if($auto["idSubasta"] > 0){

                  subastasautos::registrar($idAuto, $auto["idSubasta"]);  
                }
                 
                return $idAuto; 
                

            } else {
                return -1;
            }
        } catch (PDOException $e) {

            print_r($e);
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

     private function actualiza($auto){
        try {

            $pdo = ConexionBD::obtenerInstancia()->obtenerBD();

            // Sentencia INSERT
            $comando = "UPDATE " . self::NOMBRE_TABLA . " SET " .
                self::ENVENTA . " = ?," .
                self::PRECIO ." = ?," .
                self::MARCA . " = ?," .
                self::MODELO . " = ?,".
                self::COLOR . " = ?,".
                self::ANIO . " = ?,".
                self::KM . "= ?,".
                self::TRANSMISION . " = ?,".
                self::ESTADO . " = ?,".
                self::CIUDAD . " = ?,".
                self::DESCRIPCION . " = ?,".
                self::ESTATUS . " = ?,".
                self::PUBLICADO ." = ? " .
                " WHERE idAuto = ? ";
            
            
            $desc = json_decode($auto["descripcion"]);
                    
          
            $query = $pdo->prepare($comando);
            $query->bindParam(1, $auto["enVenta"]);
            $query->bindParam(2, $auto["precio"]);
            $query->bindParam(3, $auto["marca"]);
            $query->bindParam(4, $auto["modelo"]);
            $query->bindParam(5, $auto["color"]);
            $query->bindParam(6, $auto["anio"]);
            $query->bindParam(7, $auto["km"]);                          
            $query->bindParam(8, $auto["transmision"]);                          
            $query->bindParam(9, $auto["estado"]);                          
            $query->bindParam(10, $auto["ciudad"]);                          
            $query->bindParam(11, $desc);     
            $query->bindParam(12, $auto["estatus"]);                          
            $query->bindParam(13, $auto["publicado"]);    
            $query->bindParam(14, $auto["idAuto"]);                          

          
            if ($query->execute()) {
                $idAuto = $auto["idAuto"];

                if(count($auto["features"]) > 0){
                    autosfeatures::elimina($idAuto);
                    autosfeatures::registrar($auto["features"], $idAuto);    
                } 

                if(count($auto["fotos"]) > 0){
                    autosfotos::elemina($idAuto);
                    autosfotos::registrar($auto["fotos"], $idAuto);
                }
                return true; 
                

            } else {
                return false;
            }
            
        } catch (PDOException $e) {

            
            throw new ExcepcionApi(self::ESTADO_URL_INCORRECTA, $e->getMessage(), 400);
            
        }

    }

    
    
}