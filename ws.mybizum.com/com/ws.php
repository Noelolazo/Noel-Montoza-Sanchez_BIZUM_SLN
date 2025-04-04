<?php
header("Access-Control-Allow-Origin: *");


session_start();

require_once 'utils/dbo/daoConnection.php';
require_once 'utils/dbo/daoCommand.php';
// require_once 'utils/mail_sender.php';
require_once 'security/clsUserManager.php';
require_once 'utils/dbo/daoManager.php';

// Crear una instancia de DBCommand POR NOEL PRO PLAYER LOLAZOXD124

// //Conexion sql pol
$connection = new DBConnection('172.17.0.2,1433', 'PP_DDBB', 'sa', 'Password2!');

//Conexion sql pau
// $connection = new DBConnection(' 172.17.0.3,1433', 'PP_DDBB', 'sa', 'P@ssw0rd');

$pdoObject = $connection->getPDOObject();

// Crear una instancia de DBCommand pasando el objeto PDO
$dbCommand = new DBCommand($pdoObject);

// $dbCommand = new DBCommand($pdoObject);

// Crear instancias de los gestores de usuario y base de datos
$userManager = new UserManager($dbCommand);
$dbManager = new DBManager($dbCommand);

$action = isset($_GET['action']) ? $_GET['action'] : '';

if (empty($action)) {
    echo "Accion no especificada.";
} else {
    switch ($action) {
        case "register": // AÑADIR PARAMETROS FALTANTES
            $userManager->register($_GET['username'], $_GET['name'], $_GET['lastname'], $_GET['password'], $_GET['email'], strtoupper($_GET['gender']), strtoupper($_GET['def_lang']));
            break;
        case "register2":
            $username = $_GET['username'];
            $name = $_GET['name'];
            $lastname = $_GET['lastname'];
            $password = $_GET['newpassword'];
            $email = $_GET['email'];
            $gender = strtoupper($_GET['gender']);
            $def_lang = strtoupper($_GET['def_lang']);
            $userManager->register($username, $name, $lastname, $password, $email, $gender, $def_lang);
            break;
        case "login":
            $userManager->login($_GET['username'], hash('MD5', $_GET['password']));
            break;
        case "logout":
            $userManager->logout();
            break;
        case "changepass":
            $userManager->changePassword($_GET['username'], $_GET['password'], $_GET['newpassword']);
            break;
        case "viewcon":
            $dbManager->viewConnections();
            break;
        case "viewconhist":
            $dbManager->viewHistoricConnections();
            break;
        case "accvalidate":
            $userManager->accountValidate($_GET['username'], $_GET['code']);
            break;
        case "listusers":
            $userManager->listusers($_GET['ssid']);
            break;
        case "checkpwd":
            $userManager->checkpwd($_GET['pwd']);
            break;
        case "add":
            $userManager->add_transaction($_GET['sender'], $_GET['receiver'], $_GET['amount']);
            break;
        default:
            echo "Acción no válida.";
            break;
    }
}

// Register (POR EL MOMENTO BIEN):
// http://localhost:40080/APP%20Login/Front-end/index.php?action=register&username=polrabascall&name=Pol&lastname=Rabascall&password=Test12345!!&email=polrabascall@gmail.com
// http://localhost:40022/gen-web/PHP/index.php?action=register&username=PauAllendee&name=Pau&lastname=Allende&password=C0ntraseña2004!!&email=pauallendeherraiz@gmail.com

// Register2 (POR EL MOMENTO BIEN):
// http://localhost:40080/APP%20Login/Front-end/index.php?action=register2&username=polrabascall&name=Pol&lastname=Rabascall&password=Test12345!!&email=polrabascall@gmail.com&gender=m&def_lang=esp
// http://localhost:40022/gen-web/PHP/index.php?action=register&username=PauAllendee&name=Pau&lastname=Allende&password=C0ntraseña2004!!&email=pauallendeherraiz@gmail.com

// Account Validate (CORRECTO):
// http://http://localhost:40080/APP%20Login/Front-end/index.php?action=accvalidate&username=polrabascall&code=65897
// http://localhost:40022/gen-web/PHP/index.php?action=accvalidate&username=PauAllendee&code=40381

// Login (FECHA MAL+): 
// http://localhost:40080/APP%20Login/Front-end/index.php?action=login&username=polrabascall&password=Test12345!!
// http://localhost:40022/gen-web/PHP/index.php?action=login&username=PauAllendee&password=C0ntraseña2004!!

// Logout (FECHA MAL+): 
// http://localhost:40080/APP%20Login/Front-end/index.php?action=logout
// http://localhost:40022/gen-web/PHP/index.php?action=logout

// Change Password (BIEN?):
// http://localhost:40080/APP%20Login/Front-end/index.php?action=changepass&username=polrabascall&password=Test12345!!&newpassword=NewPassword12345!!
// http://localhost:40022/gen-web/PHP/index.php?action=changepass&username=PauAllendee&password=C0ntraseña2004!!&newpassword=NewPassword12345!!

// View Active Connections: 
// http://localhost:40080/APP%20Login/Front-end/index.php?action=viewcon
// http://localhost:40022/gen-web/PHP/index.php?action=viewcon

// View Historical Connections: 
// http://localhost:40080/APP%20Login/Front-end/index.php?action=viewconhist
// http://localhost:40022/gen-web/PHP/index.php?action=viewconhist


//http://localhost:40080/APP%20Login/Front-end/index.php?action=listusers&ssid=a0b39afe-6971-4d0c-85ca-d63bb5d07de2

?>