let currentRequest = 0;
let totalRequests = 0;
let outputDiv = document.getElementById("output");
let captchaContainer = document.getElementById("captchaContainer");

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();

    totalRequests = parseInt(document.getElementById("numberInput").value);

    if (isNaN(totalRequests) || totalRequests < 1 || totalRequests > 1000) {
        alert("Veuillez entrer un nombre valide entre 1 et 1000.");
        return;
    }

    document.getElementById("form").style.display = "none";
    outputDiv.innerHTML = "";
    currentRequest = 0;
    executeRequests();
});

function executeRequests() {
    if (currentRequest < totalRequests) {
        setTimeout(() => {
            sendRequest();
        }, 1000);  // Delay de 1 seconde entre chaque requête
    }
}

function sendRequest() {
    fetch("https://cors-anywhere.herokuapp.com/https://api.prod.jcloudify.com/whoami")  // Proxy CORS
        .then((response) => {
            if (!response.ok && response.status === 403) {
                throw new Error("captcha");
            }
            if (!response.ok) {
                throw new Error("Erreur API");
            }
            return response.json();
        })
        .then(() => {
            // Afficher "Forbidden" si la requête réussit
            outputDiv.innerHTML += `<p>${currentRequest + 1}. Forbidden</p>`;
            currentRequest++;
            executeRequests();
        })
        .catch((error) => {
            if (error.message === "captcha") {
                displayCaptcha();
            } else {
                outputDiv.innerHTML += `<p>${currentRequest + 1}. Erreur: ${error.message}</p>`;
            }
        });
}

function displayCaptcha() {
    captchaContainer.innerHTML = "<p>Résolvez le CAPTCHA pour continuer :</p>";
    AwsWafCaptcha.renderCaptcha(captchaContainer, {
        apiKey: "b82b1763d1c3", 
        onSuccess: captchaResolved,
        onError: captchaError,
    });
}

function captchaResolved(wafToken) {
    captchaContainer.innerHTML = "<p>CAPTCHA résolu ! La séquence continue...</p>";
    sendRequestWithCaptchaToken(wafToken);
}

function sendRequestWithCaptchaToken(wafToken) {
    fetch("https://api.prod.jcloudify.com/whoami", {
        headers: {
            "x-captcha-token": wafToken,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur après CAPTCHA");
            }
            return response.json();
        })
        .then(() => {
            // Afficher "Forbidden" après résolution du CAPTCHA
            outputDiv.innerHTML += `<p>${currentRequest + 1}. Forbidden (après CAPTCHA)</p>`;
            currentRequest++;
            executeRequests();
        })
        .catch((error) => {
            outputDiv.innerHTML += `<p>Erreur: ${error.message}</p>`;
        });
}

function captchaError(error) {
    captchaContainer.innerHTML = `<p>Erreur CAPTCHA : ${error.message}</p>`;
}
