(function () {
    // DOM Elements
    const encodedInput = document.getElementById('encodedInput');
    const btnPasteSample = document.getElementById('btnPasteSample');
    const btnClear = document.getElementById('btnClear');
    const validationStatus = document.getElementById('validationStatus');
    const headerOutput = document.getElementById('headerOutput');
    const payloadOutput = document.getElementById('payloadOutput');
    const claimsAnalysis = document.getElementById('claimsAnalysis');
    const claimExp = document.getElementById('claimExp');
    const claimExpVal = document.getElementById('claimExpVal');
    const claimIat = document.getElementById('claimIat');
    const claimIatVal = document.getElementById('claimIatVal');
    const claimNbf = document.getElementById('claimNbf');
    const claimNbfVal = document.getElementById('claimNbfVal');
    const hmacSecret = document.getElementById('hmacSecret');
    const btnToggleSecret = document.getElementById('btnToggleSecret');
    const secretBase64 = document.getElementById('secretBase64');
    const signatureStatus = document.getElementById('signatureStatus');
    const copyButtons = document.querySelectorAll('.btn-copy-section');

    const SAMPLE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjJ9.dYT7tGCYiMu0fG4JE-w9VMj2Im1G77sKh1s8nA53UXs";
    const SAMPLE_SECRET = "your-256-bit-secret";

    // Secret Input Visibility Toggle
    btnToggleSecret.addEventListener('click', () => {
        const isPassword = hmacSecret.type === 'password';
        hmacSecret.type = isPassword ? 'text' : 'password';
        btnToggleSecret.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    // Event Listeners
    encodedInput.addEventListener('input', () => {
        handleTokenChange();
    });

    hmacSecret.addEventListener('input', () => {
        triggerSignatureVerification();
    });

    secretBase64.addEventListener('change', () => {
        triggerSignatureVerification();
    });

    btnPasteSample.addEventListener('click', () => {
        encodedInput.value = SAMPLE_TOKEN;
        hmacSecret.value = SAMPLE_SECRET;
        handleTokenChange();
        if (window.showToast) {
            window.showToast("Jeton d'exemple chargé !");
        }
    });

    btnClear.addEventListener('click', () => {
        encodedInput.value = '';
        hmacSecret.value = '';
        handleTokenChange();
        if (window.showToast) {
            window.showToast("Saisies effacées.");
        }
    });

    // Copy handlers
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const codeEl = document.getElementById(targetId);
            if (!codeEl || codeEl.textContent === "{}" || codeEl.textContent === "") {
                if (window.showToast) window.showToast("Rien à copier !");
                return;
            }
            const textToCopy = getPlainTextFromJsonOutput(codeEl.textContent);
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (window.showToast) {
                    window.showToast(`${targetId === 'headerOutput' ? 'En-tête copié' : 'Charge utile copiée'} dans le presse-papiers !`);
                }
            }).catch(err => {
                console.error("Copy failed: ", err);
            });
        });
    });

    function getPlainTextFromJsonOutput(rawText) {
        try {
            return JSON.stringify(JSON.parse(rawText), null, 2);
        } catch(e) {
            return rawText;
        }
    }

    // Helper: Decode base64url
    function base64UrlDecode(str) {
        try {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) {
                str += '=';
            }
            const binary = atob(str);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder('utf-8').decode(bytes);
        } catch (e) {
            return null;
        }
    }

    // Helper: Syntax Highlighting for JSON
    function syntaxHighlightJson(jsonStr) {
        try {
            const obj = JSON.parse(jsonStr);
            let formatted = JSON.stringify(obj, null, 2);
            formatted = formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return formatted.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        } catch (e) {
            return jsonStr;
        }
    }

    // Process Token Changes
    let currentHeader = null;
    let currentPayload = null;
    let tokenParts = [];

    function handleTokenChange() {
        const token = encodedInput.value.trim();
        
        // Reset state
        currentHeader = null;
        currentPayload = null;
        tokenParts = [];
        headerOutput.innerHTML = "{}";
        payloadOutput.innerHTML = "{}";
        claimsAnalysis.style.display = 'none';
        
        // Reset secret inputs
        hmacSecret.disabled = true;
        btnToggleSecret.disabled = true;
        secretBase64.disabled = true;

        if (!token) {
            validationStatus.className = "validation-status status-info";
            validationStatus.innerHTML = "Saisissez un jeton JWT pour commencer le décodage.";
            resetSignatureStatus();
            return;
        }

        tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            validationStatus.className = "validation-status status-error";
            validationStatus.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Format de jeton JWT invalide. Un JWT doit se composer d\'un en-tête, d\'une charge utile et d\'une signature séparés par des points.';
            setSignatureStatus("invalid-format");
            return;
        }

        const decodedHeaderStr = base64UrlDecode(tokenParts[0]);
        const decodedPayloadStr = base64UrlDecode(tokenParts[1]);

        if (decodedHeaderStr === null || decodedPayloadStr === null) {
            validationStatus.className = "validation-status status-error";
            validationStatus.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Échec du décodage Base64url. Assurez-vous que le jeton est correctement encodé.';
            setSignatureStatus("invalid-format");
            return;
        }

        try {
            currentHeader = JSON.parse(decodedHeaderStr);
            currentPayload = JSON.parse(decodedPayloadStr);
        } catch (err) {
            validationStatus.className = "validation-status status-error";
            validationStatus.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Impossible d\'analyser les segments décodés en JSON.';
            setSignatureStatus("invalid-format");
            return;
        }

        // Display Decoded JSON with Syntax Highlighting
        headerOutput.innerHTML = syntaxHighlightJson(decodedHeaderStr);
        payloadOutput.innerHTML = syntaxHighlightJson(decodedPayloadStr);

        validationStatus.className = "validation-status status-success";
        validationStatus.innerHTML = '<i class="fas fa-check-circle mr-1"></i> La structure du jeton JWT est valide et a été décodée avec succès.';

        // Parse claims
        parseClaims(currentPayload);

        // Check if algorithm is HMAC (HS256, HS384, HS512)
        const alg = currentHeader.alg;
        if (alg && (alg === "HS256" || alg === "HS384" || alg === "HS512")) {
            hmacSecret.disabled = false;
            btnToggleSecret.disabled = false;
            secretBase64.disabled = false;
            triggerSignatureVerification();
        } else {
            setSignatureStatus("unsupported", alg || "Aucun");
        }
    }

    // Parse specific payload claims
    function parseClaims(payload) {
        let hasClaims = false;
        
        // exp
        if (payload.hasOwnProperty('exp')) {
            hasClaims = true;
            claimExp.style.display = 'block';
            const expTime = parseInt(payload.exp, 10);
            if (!isNaN(expTime)) {
                const date = new Date(expTime * 1000);
                const localStr = date.toLocaleString();
                const nowSec = Math.floor(Date.now() / 1000);
                const isExpired = expTime < nowSec;
                
                const badgeClass = isExpired ? 'claim-badge badge-expired' : 'claim-badge badge-valid';
                const badgeText = isExpired ? 'Expiré' : 'Actif';
                
                claimExpVal.innerHTML = `${expTime} (${localStr}) <span class="${badgeClass}">${badgeText}</span>`;
            } else {
                claimExpVal.textContent = payload.exp;
            }
        } else {
            claimExp.style.display = 'none';
        }

        // iat
        if (payload.hasOwnProperty('iat')) {
            hasClaims = true;
            claimIat.style.display = 'block';
            const iatTime = parseInt(payload.iat, 10);
            if (!isNaN(iatTime)) {
                const date = new Date(iatTime * 1000);
                claimIatVal.textContent = `${iatTime} (${date.toLocaleString()})`;
            } else {
                claimIatVal.textContent = payload.iat;
            }
        } else {
            claimIat.style.display = 'none';
        }

        // nbf
        if (payload.hasOwnProperty('nbf')) {
            hasClaims = true;
            claimNbf.style.display = 'block';
            const nbfTime = parseInt(payload.nbf, 10);
            if (!isNaN(nbfTime)) {
                const date = new Date(nbfTime * 1000);
                claimNbfVal.textContent = `${nbfTime} (${date.toLocaleString()})`;
            } else {
                claimNbfVal.textContent = payload.nbf;
            }
        } else {
            claimNbf.style.display = 'none';
        }

        claimsAnalysis.style.display = hasClaims ? 'block' : 'none';
    }

    // Trigger Verification with Debouncing
    let verifyDebounceTimer = null;
    function triggerSignatureVerification() {
        if (verifyDebounceTimer) clearTimeout(verifyDebounceTimer);
        verifyDebounceTimer = setTimeout(() => {
            performSignatureVerification();
        }, 150);
    }

    // Signature Verification using Web Crypto API
    async function performSignatureVerification() {
        if (!currentHeader || !currentPayload || tokenParts.length !== 3) return;

        const alg = currentHeader.alg;
        const secret = hmacSecret.value;

        if (!secret) {
            setSignatureStatus("needs-secret");
            return;
        }

        let hashAlgorithm = "SHA-256";
        if (alg === "HS384") hashAlgorithm = "SHA-384";
        if (alg === "HS512") hashAlgorithm = "SHA-512";

        try {
            const encoder = new TextEncoder();
            const dataBytes = encoder.encode(tokenParts[0] + '.' + tokenParts[1]);

            // Decode secret key
            let keyBytes;
            if (secretBase64.checked) {
                let formattedSecret = secret.replace(/-/g, '+').replace(/_/g, '/');
                while (formattedSecret.length % 4) {
                    formattedSecret += '=';
                }
                const binaryStr = atob(formattedSecret);
                keyBytes = new Uint8Array(binaryStr.length);
                for (let i = 0; i < binaryStr.length; i++) {
                    keyBytes[i] = binaryStr.charCodeAt(i);
                }
            } else {
                keyBytes = encoder.encode(secret);
            }

            // Import HMAC key
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyBytes,
                { name: 'HMAC', hash: hashAlgorithm },
                false,
                ['verify']
            );

            // Format signature from base64url to standard signature bytes
            let sigStr = tokenParts[2].replace(/-/g, '+').replace(/_/g, '/');
            while (sigStr.length % 4) {
                sigStr += '=';
            }
            const sigBinary = atob(sigStr);
            const sigBytes = new Uint8Array(sigBinary.length);
            for (let i = 0; i < sigBinary.length; i++) {
                sigBytes[i] = sigBinary.charCodeAt(i);
            }

            // Verify
            const isValid = await crypto.subtle.verify(
                'HMAC',
                cryptoKey,
                sigBytes,
                dataBytes
            );

            if (isValid) {
                setSignatureStatus("verified", alg);
            } else {
                setSignatureStatus("failed");
            }
        } catch (err) {
            console.error("Signature verification error:", err);
            setSignatureStatus("error");
        }
    }

    function resetSignatureStatus() {
        signatureStatus.className = "signature-status status-unverified";
        signatureStatus.innerHTML = '<i class="fas fa-info-circle mr-1"></i> La vérification de signature nécessite HS256, HS384 ou HS512.';
    }

    function setSignatureStatus(type, extra = "") {
        if (type === "invalid-format") {
            signatureStatus.className = "signature-status status-unverified";
            signatureStatus.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i> Impossible de vérifier la signature. Format de jeton invalide.';
        } else if (type === "unsupported") {
            signatureStatus.className = "signature-status status-unverified";
            signatureStatus.innerHTML = `<i class="fas fa-info-circle mr-1"></i> La vérification de signature n'est pas prise en charge pour l'algorithme <strong>${extra}</strong> (décodage uniquement).`;
        } else if (type === "needs-secret") {
            signatureStatus.className = "signature-status status-unverified";
            signatureStatus.innerHTML = '<i class="fas fa-key mr-1"></i> Saisissez une clé secrète ci-dessus pour vérifier la signature HMAC.';
        } else if (type === "verified") {
            signatureStatus.className = "signature-status status-verified";
            signatureStatus.innerHTML = `<i class="fas fa-check-circle mr-1"></i> Signature vérifiée ! (Signature ${extra} valide)`;
        } else if (type === "failed") {
            signatureStatus.className = "signature-status status-failed";
            signatureStatus.innerHTML = '<i class="fas fa-times-circle mr-1"></i> Signature invalide ! La clé secrète ne correspond pas.';
        } else if (type === "error") {
            signatureStatus.className = "signature-status status-failed";
            signatureStatus.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Erreur de vérification de signature. Vérifiez le format du secret.';
        }
    }

    // Auto-run if there is initial value in text area
    handleTokenChange();
})();
