var AJAX;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("validateForm");

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get("username");
        const code = formData.get("code");
        // Construir la URL para la solicitud GET
        const url = `http://ws.mybizum.com:8080/com/ws.php?action=accvalidate&username=${(username)}&code=${(code)}`;

        // Crear una instancia de la clase clsAjax
        const AJAX = new clsAjax(url, null);

        // Evento que procesará la respuesta después de que se haya recibido
        function handleVerificationResponse() {
            const xml = AJAX.xml;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            // const ssid = xmlDoc.querySelector("CONNECTION_ID")?.textContent;

            if (xmlDoc.querySelector("num_error")?.textContent == "0") {
                document.cookie = `USERNAME=${username}; path=/; max-age=86400; SameSite=Lax`;
                window.location.href = "/index.html";
            } else {
                const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
                alert("Verificación fallida: " + errorMsg);
            }

            // Remover el listener tras ejecutarse
            document.removeEventListener("__CALL_RETURNED__", handleVerificationResponse);
        }

        // Asegúrate de eliminarlo antes por si quedó enganchado
        document.removeEventListener("__CALL_RETURNED__", handleVerificationResponse);
        document.addEventListener("__CALL_RETURNED__", handleVerificationResponse);

        AJAX.Call();
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const username = getCookie("USERNAME");
//     const form = document.getElementById("registerForm");
//     const message = document.getElementById("validate-message");
//     if (!username) {
//         // Ocultar formulario y mostrar mensaje
//         if (form) form.style.display = "none";
//         if (message) {
//             message.textContent = "Necesitas.";
//             message.style.display = "block";
//         }
//     }
// });