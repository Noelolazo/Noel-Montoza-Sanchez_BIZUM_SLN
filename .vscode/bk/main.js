function toggleForms() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
    document.getElementById('extra-functions').classList.toggle('hidden');
}

function validatePassword() {
    let password = document.getElementById("newpassword").value;
    let message = document.getElementById("passwordMessage");

    if (password.length === 0) {
        message.innerHTML = "";
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://ws.mybizum.com:8080/com/ws.php?action=checkpwd&pwd=" + password, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            message.innerHTML = xhr.responseText;
        }
    };

    xhr.send();
}

document.getElementsByTagName("a").addEventListener("click", toggleForms());
document.getElementsByID("newpassword").addEventListener("keyup", validatePassword())