let captchaResolved = false; 
let currentRequest = 0; 
let N = 0; 
let captchaContainer = document.getElementById("captchaContainer");
let outputDiv = document.getElementById("output");

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    N = parseInt(document.getElementById("numberInput").value);
    if (isNaN(N) || N < 1 || N > 1000) {
        alert("Veuillez entrer un nombre valide entre 1 et 1000.");
        return;
    }
    
    document.getElementById("form").style.display = "none";
    outputDiv.innerHTML = "";
    currentRequest = 0;
    executeRequests();
});

function executeRequests() {
    if (currentRequest < N) {
        setTimeout(() => {
            sendRequest();
        }, currentRequest * 1000);
    }
}

function sendRequest() {
    fetch("https://api.prod.jcloudify.com/whoami")
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l’appel à l’API');
            }
            return response.json();
        })
        .then(data => {
            outputDiv.innerHTML += `<p>${currentRequest + 1}. Forbidden</p>`;
            currentRequest++;
            executeRequests();
        })
        .catch(error => {
            if (error.message.includes("captcha")) {
                displayCaptcha();
            } else {
                outputDiv.innerHTML += `<p>Erreur: ${error.message}</p>`;
            }
        });
}


function displayCaptcha() {
    captchaContainer.innerHTML = "<p>Un CAPTCHA est nécessaire pour continuer. Résolvez-le ci-dessous.</p>";
    AwsWafCaptcha.renderCaptcha(captchaContainer, {
        apiKey: "VOTRE_CLE_API", 
        onSuccess: captchaSuccess,
        onError: captchaError
    });
}

function captchaSuccess(wafToken) {
    captchaResolved = true;
    captchaContainer.innerHTML = "<p>CAPTCHA résolu avec succès, la séquence va continuer...</p>";
    currentRequest++;
    executeRequests();
}

function captchaError(error) {
    captchaContainer.innerHTML = `<p>Erreur CAPTCHA: ${error.message}</p>`;
}