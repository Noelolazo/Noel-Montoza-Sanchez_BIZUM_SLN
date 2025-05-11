document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector(".content");
    const authButtons = document.querySelector(".auth-buttons");
    const ssid = getCookie("SSID");
    const logo = document.querySelector(".logo");
    logo.innerHTML = '<a href="/index.html"><img src="/rscs/imgs/logo.png" alt="Logo" class="logo-img"></a>';

    if (ssid) {
        authButtons.innerHTML = `<a href="#" id="logout-link">Cerrar sesión</a>`;
        document.getElementById("logout-link").addEventListener("click", (e) => {
            e.preventDefault();

            const username = getCookie("USERNAME");
            window.logoutAjax = new clsAjax(
                "http://ws.mybizum.com:8080/com/ws.php?action=logout&username=" + encodeURIComponent(username),
                null
            );
            window.logoutAjax.Call();
        });

        // Manejador global para logout
        document.addEventListener("__CALL_RETURNED__", function handleLogout() {
            if (!window.logoutAjax) return;

            const xml = window.logoutAjax.xml;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            const errorCode = xmlDoc.querySelector("num_error")?.textContent;
            alert("Logout: " + errorCode);
            if (errorCode === "0") {
                deleteCookie("SSID");
                deleteCookie("USERNAME");
                window.location.href = "/index.html";
            } else {
                const error = xmlDoc.querySelector("error")?.textContent || "Error desconocido";
                alert("Error al cerrar sesión: " + error);
            }

            // Limpia para que no se repita el handler si hay otra llamada AJAX
            document.removeEventListener("__CALL_RETURNED__", handleLogout);
        });
    } else {
        authButtons.innerHTML = `
        <a href="/pages/login.html">Iniciar sesión</a>
        <a href="/pages/register.html">Registrarse</a>
    `;
        content.innerHTML = `
        <h2>Bienvenido a Bizum</h2>
        <p>Inicie sesión para poder acceder a las funciones.</p>
    `;
    }
});

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