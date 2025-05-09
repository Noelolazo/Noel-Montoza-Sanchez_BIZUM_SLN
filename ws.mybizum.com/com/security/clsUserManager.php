<?php

// require_once 'DBCommand.php'; 

class UserManager
{
    private $dbCommand;

    public function __construct($dbCommand)
    {
        $this->dbCommand = $dbCommand;
    }

    public function register($username, $name, $lastname, $password, $email, $gender, $def_lang)
    {
        if (empty($username) || empty($name) || empty($lastname) || empty($password) || empty($email) || empty($gender) || empty($def_lang)) {
            echo "Todos los campos son obligatorios.";
        } else {
            try {
                $result = $this->dbCommand->execute('sp_user_register', array($username, $name, $lastname, $password, $email, $gender, $def_lang));

                $register_code = $this->dbCommand->execute('sp_wdev_get_registercode', array($username, 0));

                // URL del Web App desplegado en Google Apps Script
                //url pau
                // $url = 'https://script.google.com/macros/s/AKfycbzs-WaweIA_cKNVVgqqPmianx7dn4wPI7AflDvM78iUcP8pUoYNh5u5Dg7nBlkofdKu/exec';

                //url Pol
                $url = 'https://script.google.com/macros/s/AKfycbxAQsgiFCg31C-G1MzD27GjZTo0Owa22XBoGJQzu2AT-WV8lWj76kud2WOuxLaxpH6OYw/exec';

                // Parámetros del correo electrónico
                $destinatario = $email;
                $asunto = 'Código de registro.';
                $cuerpo = $name . ', su código de verificación es ' . $register_code;
                $adjunto = null;

                // Llamada a la función para enviar el correo
                #$resultado = enviarCorreo($url, $destinatario, $asunto, $cuerpo, $adjunto);
                // $resultado2 = readAndRegisterUsers($url);

                // Establecer el encabezado para XML
                header('Content-Type: text/xml');

                // Mostrar la respuesta XML
                echo $result;
                // echo $resultado2;
            } catch (PDOException $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    }

    public function login($username, $password)
    {
        if (empty($username) || empty($password)) {
            echo "Todos los campos son obligatorios.";
        } else {
            try {
                if (isset($_SESSION['username'])) {
                    $result = new SimpleXMLElement("<Errors><Error><StatusCode>412</StatusCode><Message>Hay un usuario ya conectado</Message></Error></Errors>");

                    // Establecer el encabezado para XML
                    header('Content-Type: text/xml');

                    // Mostrar la respuesta XML
                    echo $result->asXML();
                } else {
                    $result = $this->dbCommand->execute('sp_user_login', array($username, $password));

                    $_SESSION['username'] = $username;

                    // Establecer el encabezado para XML
                    header('Content-Type: text/xml');

                    // Mostrar la respuesta XML
                    echo $result;
                }
            } catch (PDOException $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    }

    public function logout()
    {
        try {
            // session_destroy();
            if (isset($_SESSION['username'])) {
                $username = $_SESSION['username'];
                $result = $this->dbCommand->execute('sp_user_logout', array($username));
                session_destroy();

                // Establecer el encabezado para XML
                header('Content-Type: text/xml');

                // Mostrar la respuesta XML
                echo $result;
            }
        } catch (PDOException $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }

    public function changePassword($username, $password, $newpassword)
    {
        if (empty($username) || empty($password)) {
            echo "Todos los campos son obligatorios.";
        } else {
            try {
                $result = $this->dbCommand->execute('sp_user_change_password', array($username, $password, $newpassword));

                // Establecer el encabezado para XML
                header('Content-Type: text/xml');

                // Mostrar la respuesta XML
                echo $result;
            } catch (PDOException $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    }

    public function accountValidate($username, $code)
    {
        if (empty($username) || empty($code)) {
            echo "Todos los campos son obligatorios.";
        } else {
            try {
                $result = $this->dbCommand->execute('sp_user_accountvalidate', array($username, $code));

                // Establecer el encabezado para XML
                header('Content-Type: text/xml');

                // Mostrar la respuesta XML
                echo $result;

            } catch (PDOException $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    }

    public function listusers($ssid)
    {
        if (empty($ssid)) {
            echo "Todos los campos son obligatorios.";
        } else {
            try {
                $result = $this->dbCommand->execute('sp_list_users2', array($ssid));

                // Establecer el encabezado para XML
                header('Content-Type: text/xml');

                // Mostrar la respuesta XML
                echo $result;

            } catch (PDOException $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    }

    public function checkpwd($pwd)
    {
        if (!isset($_GET['pwd'])) {
            echo "<span style='color: red;'>❌ No se recibió ninguna contraseña.</span>";
            return;
        }

        try {
            // Llamar a la procedure sp_check_pwd
            $sql = "DECLARE @score INT, @xml XML;
                EXEC sp_check_pwd :pwd, @score OUTPUT, @xml OUTPUT;
                SELECT @score AS score, @xml AS xml;";

            $result = $this->dbCommand->execute2($sql, array($pwd));

            // Obtener el resultado
            $result = $result->fetch(PDO::FETCH_ASSOC);
            $score = $result['score'];
            $xml = $result['xml'];

            // Definir el mensaje según la puntuación
            $message = "";
            if ($score <= 10) {
                $message = "<span style='color: red;'>❌ Muy débil<br>Falta: " . htmlspecialchars($xml) . "</span>";
            } elseif ($score <= 20) {
                $message = "<span style='color: orange;'>⚠️ Débil<br>Falta: " . htmlspecialchars($xml) . "</span>";
            } elseif ($score <= 40) {
                $message = "<span style='color: yellow;'>🟡 Aceptable<br>Falta: " . htmlspecialchars($xml) . "</span>";
            } else {
                $message = "<span style='color: green;'>✅ Fuerte</span>";
            }

            echo $message;
        } catch (Exception $e) {
            echo "<span style='color: red;'>⚠️ Error en la validación: " . $e->getMessage() . "</span>";
        }
    }

    public function add_transaction($sender, $receiver, $amount)
    {
        if (empty($sender) || empty($receiver) || empty($amount)) {
            echo "Todos los campos son obligatorios.";
        } else {
            try {
                if (!isset($_SESSION["BlockGenesis"])) {
                    $this->dbCommand->execute('AddBlock', array(null));
                    $_SESSION["BlockGenesis"] = true;
                    $_SESSION["id"] = 1;
                    $id = $_SESSION["id"];
                } else {
                    $id = $_SESSION["id"];
                }
                $this->dbCommand->execute('AddTransaction', array($sender, $receiver, $amount, $id));
                $_SESSION["id"]++;

            } catch (PDOException $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    }
}

?>