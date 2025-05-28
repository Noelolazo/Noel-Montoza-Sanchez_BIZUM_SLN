document.addEventListener("DOMContentLoaded", () => {
    const transactionTable = document.getElementById(".transactionTable");
    const ssid = getCookie("SSID");

    // Construir la URL para la solicitud GET
    const url = `http://ws.mybizum.com:8080/com/ws.php?action=getTransactions&ssid=${encodeURIComponent(ssid)}`;

    // Crear una instancia de la clase clsAjax
    const AJAX = new clsAjax(url, null);

    // Evento que procesará la respuesta después de que se haya recibido
    function handleListTransactionsResponse() {
        const xml = AJAX.xml;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        var txt = "";

        if (xmlDoc.querySelector("NoTransaction")) {
            transactionTable.innerHTML = "<p>No hay transacciones.</p>";
            return;
        } else {
            const transactionBody = document.getElementById("transactionBody");
            const transactions = xmlDoc.getElementsByTagName("Transaction");
            let txt = "";

            for (let i = 0; i < transactions.length; i++) {
                const timestamp = transactions[i].querySelector("Timestamp")?.textContent;
                const date = formatTimestamp(timestamp);
                const sender = transactions[i].querySelector("Sender")?.textContent;
                const receiver = transactions[i].querySelector("Receiver")?.textContent;
                const amount = transactions[i].querySelector("Amount")?.textContent;


                txt += `<tr>
                            <td id="transactionDate">${date}</td>
                            <td id="transactionSender">${sender}</td>
                            <td id="transactionReceiver">${receiver}</td>
                            <td id="transactionAmount">${amount}</td>
                        </tr>`;
            }
            transactionBody.innerHTML = txt;
            document.removeEventListener("__CALL_RETURNED__", handleListTransactionsResponse);
        }
    }

    // Asegúrate de eliminarlo antes por si quedó enganchado
    document.removeEventListener("__CALL_RETURNED__", handleListTransactionsResponse);
    document.addEventListener("__CALL_RETURNED__", handleListTransactionsResponse);

    AJAX.Call();
});