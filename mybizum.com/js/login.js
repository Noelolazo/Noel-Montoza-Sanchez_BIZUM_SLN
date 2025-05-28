document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        // Construir la URL para la solicitud GET
        const url = `http://ws.mybizum.com:8080/com/ws.php?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

        // Crear una instancia de la clase clsAjax
        const AJAX = new clsAjax(url, null);

        // Evento que procesará la respuesta después de que se haya recibido
        function handleLoginResponse() {
            const xml = AJAX.xml;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            const ssid = xmlDoc.querySelector("CONNECTION_ID")?.textContent;

            if (ssid) {
                document.cookie = `SSID=${ssid}; path=/; max-age=86400; SameSite=Lax`;
                window.location.href = "/index.html";
            } else {
                const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
                alert("Login fallido: " + errorMsg);
            }

            // Remover el listener tras ejecutarse
            document.removeEventListener("__CALL_RETURNED__", handleLoginResponse);
        }

        // Asegúrate de eliminarlo antes por si quedó enganchado
        document.removeEventListener("__CALL_RETURNED__", handleLoginResponse);
        document.addEventListener("__CALL_RETURNED__", handleLoginResponse);

        AJAX.Call();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const ssid = getCookie("SSID");
    const form = document.getElementById("loginForm");
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