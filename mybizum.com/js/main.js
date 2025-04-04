var AJAX;

function validatePassword(password) {
    AJAX = new clsAjax("http://ws.mybizum.com:8080/com/ws.php?action=checkpwd&pwd=" + password, null);
    document.addEventListener('__CALL_RETURNED__', function () {
        ReturnData("passwordMessage");
    });
    AJAX.Call();
}

function ReturnData(field) {

    document.getElementById(field).innerHTML = AJAX.xml;

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
    return "";
}

function checkCookie() {
    let user = getCookie("ssid");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}
// document.getElementsByID("newpassword").addEventListener("keyup", validatePassword())