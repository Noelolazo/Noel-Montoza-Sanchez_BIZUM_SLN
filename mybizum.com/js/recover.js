document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recoverForm");

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const action = formData.get("action");
        const email = formData.get("email");

        if (action == "recoverypassEmail") {
            // Construir la URL para la solicitud GET
            const url = `http://ws.mybizum.com:8080/com/ws.php?action=${encodeURIComponent(action)}&email=${encodeURIComponent(email)}`;

            // Crear una instancia de la clase clsAjax
            AJAX = new clsAjax(url, null);

            // Asegúrate de eliminarlo antes por si quedó enganchado
            document.removeEventListener("__CALL_RETURNED__", handleRecoveryEmailResponse);
            document.addEventListener("__CALL_RETURNED__", handleRecoveryEmailResponse);
        } else if (action == "recoverypassPIN") {
            const pin = formData.get("pin");
            const password = formData.get("password");

            // Construir la URL para la solicitud GET
            const url = `http://ws.mybizum.com:8080/com/ws.php?action=${encodeURIComponent(action)}&email=${encodeURIComponent(email)}&pin=${encodeURIComponent(pin)}&password=${encodeURIComponent(password)}`;

            // Crear una instancia de la clase clsAjax
            AJAX = new clsAjax(url, null);

            // Asegúrate de eliminarlo antes por si quedó enganchado
            document.removeEventListener("__CALL_RETURNED__", handleRecoveryPINResponse);
            document.addEventListener("__CALL_RETURNED__", handleRecoveryPINResponse);
        } else if (action == "changepass") {
            const ssid = getCookie("SSID");
            const password = formData.get("password");
            const newPassword = formData.get("new_password");
            const confirmPassword = formData.get("confirm_password");

            if (newPassword !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Construir la URL para la solicitud GET
            const url = `http://ws.mybizum.com:8080/com/ws.php?action=${encodeURIComponent(action)}&ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}&newpassword=${encodeURIComponent(newPassword)}`;

            // Crear una instancia de la clase clsAjax
            AJAX = new clsAjax(url, null);

            // Asegúrate de eliminarlo antes por si quedó enganchado
            document.removeEventListener("__CALL_RETURNED__", handleChangePasswordResponse);
            document.addEventListener("__CALL_RETURNED__", handleChangePasswordResponse);
        }
        AJAX.Call();
    });
});

function handleRecoveryEmailResponse() {
    const xml = AJAX.xml;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const num_error = xmlDoc.querySelector("num_error")?.textContent;

    if (num_error == "0") {
        alert("Se ha enviado un correo electrónico con el pin para recuperar tu contraseña.");
        window.location.href = "/pages/recover-password.html";
    } else {
        const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
        alert("Solicitud fallida: " + errorMsg);
    }

    // Remover el listener tras ejecutarse
    document.removeEventListener("__CALL_RETURNED__", handleRecoveryEmailResponse);
}

function handleRecoveryPINResponse() {
    const xml = AJAX.xml;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const num_error = xmlDoc.querySelector("num_error")?.textContent;

    if (num_error == "0") {
        alert("La contraseña ha sido modificada correctamente.");
        window.location.href = "/index.html";
    } else {
        const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
        alert("Solicitud fallida: " + errorMsg);
    }

    // Remover el listener tras ejecutarse
    document.removeEventListener("__CALL_RETURNED__", handleRecoveryPINResponse);
}

function handleChangePasswordResponse() {
    const xml = AJAX.xml;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const num_error = xmlDoc.querySelector("num_error")?.textContent;

    if (num_error == "0") {
        alert("La contraseña ha sido modificada correctamente.");
        window.location.href = "/index.html";
    } else {
        const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
        alert("Solicitud fallida: " + errorMsg);
    }

    // Remover el listener tras ejecutarse
    document.removeEventListener("__CALL_RETURNED__", handleChangePasswordResponse);
}

function validatePassword(password) {
    AJAX = new clsAjax("http://ws.mybizum.com:8080/com/ws.php?action=checkpwd&pwd=" + password, null);
    document.addEventListener('__CALL_RETURNED__', function () {
        let responseText = AJAX.xml;
        if (!responseText.includes("<ws_response>") && !responseText.includes("<head>")) {
            ReturnData("passwordMessage");
        }
    });
    AJAX.Call();
}
// document.addEventListener("DOMContentLoaded", () => {
//     const ssid = getCookie("SSID");
//     const form = document.getElementById("recoverForm");
//     const message = document.getElementById("recover-message");
//     if (ssid) {
//         // Ocultar formulario y mostrar mensaje
//         if (form) form.style.display = "none";
//         if (message) {
//             message.textContent = "Ya hay una sesión iniciada.";
//             message.style.display = "block";
//         }
//     }
// });