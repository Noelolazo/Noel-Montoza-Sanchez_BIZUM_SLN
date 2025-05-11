var AJAX;

function validatePassword(password) {
    AJAX = new clsAjax("http://ws.mybizum.com:8080/com/ws.php?action=checkpwd&pwd=" + password, null);
    document.addEventListener('__CALL_RETURNED__', function () {
        ReturnData("passwordMessage");
    });
    AJAX.Call();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get("username");
        const name = formData.get("name");
        const lastname = formData.get("lastname");
        const password = formData.get("password");
        const email = formData.get("email");
        const gender = formData.get("gender");
        const def_lang = formData.get("def_lang");
        // Construir la URL para la solicitud GET
        const url = `http://ws.mybizum.com:8080/com/ws.php?action=register&username=${(username)}&name=${(name)}&lastname=${(lastname)}&password=${(password)}&email=${(email)}&gender=${(gender)}&def_lang=${(def_lang)}`;

        // Crear una instancia de la clase clsAjax
        const AJAX = new clsAjax(url, null);

        // Evento que procesará la respuesta después de que se haya recibido
        function handleRegisterResponse() {
            const xml = AJAX.xml;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            // const ssid = xmlDoc.querySelector("CONNECTION_ID")?.textContent;

            if (xmlDoc.querySelector("num_error")?.textContent == "0") {
                document.cookie = `USERNAME=${username}; path=/; max-age=86400; SameSite=Lax`;
                alert("Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.");
                window.location.href = "validate.html";
            } else {
                const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
                alert("Registro fallido: " + errorMsg);
            }

            // Remover el listener tras ejecutarse
            document.removeEventListener("__CALL_RETURNED__", handleRegisterResponse);
        }

        // Asegúrate de eliminarlo antes por si quedó enganchado
        document.removeEventListener("__CALL_RETURNED__", handleRegisterResponse);
        document.addEventListener("__CALL_RETURNED__", handleRegisterResponse);

        AJAX.Call();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const ssid = getCookie("SSID");
    const form = document.getElementById("registerForm");
    const message = document.getElementById("login-message");
    if (ssid) {
        // Ocultar formulario y mostrar mensaje
        if (form) form.style.display = "none";
        if (message) {
            message.textContent = "Ya hay una sesión iniciada.";
            message.style.display = "block";
        }
    }
});