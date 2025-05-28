document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector(".content");
    const authButtons = document.querySelector(".auth-buttons");
    const ssid = getCookie("SSID");
    const logo = document.querySelector(".logo");
    logo.innerHTML = '<a href="/index.html"><img src="/rscs/imgs/logo.png" alt="Logo" class="logo-img"></a>';

    if (ssid) {
        authButtons.innerHTML = `<a id="logout-link">Cerrar sesión</a>
                                <a href="/pages/change-password.html">Cambiar contraseña</a>`;
        document.getElementById("logout-link").addEventListener("click", (e) => {
            e.preventDefault();
            window.logoutAJAX = new clsAjax(
                "http://ws.mybizum.com:8080/com/ws.php?action=logout&ssid=" + encodeURIComponent(ssid),
                null
            );
            document.addEventListener("__CALL_RETURNED__", handleLogout);
            window.logoutAJAX.Call();
        });
    } else {
        authButtons.innerHTML = `
        <a href="/pages/login.html">Iniciar sesión</a>
        <a href="/pages/register.html">Registrarse</a>
    `;
        if (document.querySelector(".content")) {
            content.innerHTML = `
        <h2>Bienvenido a Bizum</h2>
        <p>Inicie sesión para poder acceder a las funciones.</p>
    `;
        }
    }
    if (document.getElementById("balance")) {
        checkBalance();
        checkLastTransaction();
    }

});

// ===================
// HANDLERS PERSISTENTES
// ===================

function handleLogout() {
    const xml = window.logoutAJAX.xml;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const errorCode = xmlDoc.querySelector("num_error")?.textContent;
    if (errorCode == "0") {
        deleteCookie("SSID");
        alert("Sesión cerrada correctamente.");
        window.location.href = "/index.html";
    } else {
        const error = xmlDoc.querySelector("error")?.textContent || "Error desconocido";
        alert("Error al cerrar sesión: " + error);
    }

    document.removeEventListener("__CALL_RETURNED__", handleLogout);
}

function handleCheckBalanceResponse() {
    const xml = window.AJAXBalance.xml;
    if (!xml || !xml.trim().startsWith("<")) return;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const balance = xmlDoc.querySelector("BALANCE")?.textContent;
    const errorCode = xmlDoc.querySelector("num_error")?.textContent;

    if (errorCode === "0") {
        document.getElementById("balance").innerHTML = balance + " €";
    } else {
        const errorMsg = xmlDoc.querySelector("message_error")?.textContent || "Error desconocido.";
        alert("Obtener saldo fallido: " + errorMsg);
    }

    document.removeEventListener("__CALL_RETURNED__", handleCheckBalanceResponse);
}

function handleLastTransactionResponse() {
    const xml = window.AJAXTx.xml;
    if (!xml || !xml.trim().startsWith("<")) return;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const transactionTable = document.querySelector(".transactionTable");

    if (xmlDoc.querySelector("NoTransaction")) {
        transactionTable.innerHTML = "<p>No hay transacciones recientes.</p>";
    } else {
        const timestamp = xmlDoc.querySelector("Timestamp")?.textContent;
        const date = formatTimestamp(timestamp);
        const sender = xmlDoc.querySelector("Sender")?.textContent;
        const receiver = xmlDoc.querySelector("Receiver")?.textContent;
        const amount = xmlDoc.querySelector("Amount")?.textContent;

        document.getElementById("transactionDate").textContent = date;
        document.getElementById("transactionSender").textContent = sender;
        document.getElementById("transactionReceiver").textContent = receiver;
        document.getElementById("transactionAmount").textContent = amount + " €";
    }

    document.removeEventListener("__CALL_RETURNED__", handleLastTransactionResponse);
}

function checkBalance() {
    const ssid = getCookie("SSID");
    window.AJAXBalance = new clsAjax("http://ws.mybizum.com:8080/com/ws.php?action=checkbalance&ssid=" + ssid, null);
    document.addEventListener("__CALL_RETURNED__", handleCheckBalanceResponse);
    window.AJAXBalance.Call();
}

function checkLastTransaction() {
    const ssid = getCookie("SSID");
    window.AJAXTx = new clsAjax("http://ws.mybizum.com:8080/com/ws.php?action=checklasttransaction&ssid=" + ssid, null);
    document.addEventListener("__CALL_RETURNED__", handleLastTransactionResponse);
    window.AJAXTx.Call();
}


function ReturnData(field) {
    document.getElementById(field).innerHTML = AJAX.xml;
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return;
}

function formatTimestamp(isoString) {
    const date = new Date(isoString);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
}

// function checkCookie() {
//     let user = getCookie("ssid");
//     if (user != "") {
//         alert("Welcome again " + user);
//     } else {
//         user = prompt("Please enter your name:", "");
//         if (user != "" && user != null) {
//             setCookie("username", user, 365);
//         }
//     }
// }
// document.getElementsByID("newpassword").addEventListener("keyup", validatePassword())