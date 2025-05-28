document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sendBizumForm");
    const ssid = getCookie("SSID");

    form?.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const receiver = formData.get("receiver");
        const amount = formData.get("amount");

        // Construir la URL para la solicitud GET
        const url = `http://ws.mybizum.com:8080/com/ws.php?action=addTransaction&ssid=${encodeURIComponent(ssid)}&receiver=${encodeURIComponent(receiver)}&amount=${encodeURIComponent(amount)}`;

        // Crear una instancia de la clase clsAjax
        const AJAX = new clsAjax(url, null);

        // Evento que procesará la respuesta después de que se haya recibido
        function handleBizumResponse() {
            const xml = AJAX.xml;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            const errorCode = xmlDoc.querySelector("num_error")?.textContent;

            if (errorCode == "0") {
                alert("Bizum enviado correctamente.");
                window.location.href = "/index.html";
            } else {
                const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
                alert("Error al enviar Bizum: " + errorMsg);
            }

            // Remover el listener tras ejecutarse
            document.removeEventListener("__CALL_RETURNED__", handleBizumResponse);
        }

        // Asegúrate de eliminarlo antes por si quedó enganchado
        document.removeEventListener("__CALL_RETURNED__", handleBizumResponse);
        document.addEventListener("__CALL_RETURNED__", handleBizumResponse);

        AJAX.Call();
    });
});

function validateUsername(username) {
    const ssid = getCookie("SSID");
    AJAX = new clsAjax("http://ws.mybizum.com:8080/com/ws.php?action=checkuser&ssid=" + ssid + "&username=" + username, null);
    document.addEventListener('__CALL_RETURNED__', function () {
        ReturnData("receiverMessage");
    });
    AJAX.Call();
}


document.getElementsByID("receiver").addEventListener("keyup", validateUsername())