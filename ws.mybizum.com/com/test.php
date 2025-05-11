<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_clean();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// session_start();

require_once 'utils/dbo/daoConnection.php';
require_once 'utils/dbo/daoCommand.php';
// require_once 'utils/mail_sender.php';
require_once 'security/clsUserManager.php';
require_once 'utils/dbo/daoManager.php';
require_once 'blockchain/clsBlock.php';
require_once 'blockchain/clsBlockchain.php';
require_once 'blockchain/clsTransaction.php';

// Crear una instancia de DBCommand POR NOEL PRO PLAYER LOLAZOXD124
function newDBCommand($server, $db, $user, $password)
{
    $connection = new DBConnection($server, $db, $user, $password);
    $pdoObject = $connection->getPDOObject();
    return new DBCommand($pdoObject);

}
function connUser()
{
    $dbCommand = newDBCommand('172.17.0.2,1433', 'PP_DDBB', 'sa', 'Password2!');
    return new UserManager($dbCommand);
}

function connDBManager()
{
    $dbCommand = newDBCommand('172.17.0.2,1433', 'PP_DDBB', 'sa', 'Password2!');
    return new DBManager($dbCommand);
}

function enviarCorreo($url, $destinatario, $asunto, $cuerpo, $adjunto)
{
    $data = array(
        'destinatario' => $destinatario,
        'asunto' => $asunto,
        'cuerpo' => $cuerpo,
        'adjunto' => $adjunto
    );

    $options = array(
        'http' => array(
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data),
            'ignore_errors' => true // Ignorar errores para poder leer el contenido de respuesta
        ),
    );

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        // Obtener más detalles del error
        $error = error_get_last();
        return false;
    }

    $response = json_decode($result, true);

    if ($response === null) {
        return false;
    }

    return $response['resultado'];
}

$url = 'https://script.google.com/macros/s/AKfycbxAQsgiFCg31C-G1MzD27GjZTo0Owa22XBoGJQzu2AT-WV8lWj76kud2WOuxLaxpH6OYw/exec';

// Parámetros del correo electrónico
$destinatario = "nojarmonsa9@gmail.com";
$asunto = 'Código de registro.';
$cuerpo = 'Noel , su código de verificación es 1234';
$adjunto = null;

// Llamada a la función para enviar el correoenviarCorreo($url, $destinatario, $asunto, $cuerpo, $adjunto);
enviarCorreo($url, $destinatario, $asunto, $cuerpo, $adjunto);