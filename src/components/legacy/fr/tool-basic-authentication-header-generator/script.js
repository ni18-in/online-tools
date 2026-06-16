// DOM element references
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const generateBtn = document.getElementById('generate-btn');
        const resultContainer = document.getElementById('result-container');
        const resultOutput = document.getElementById('result-output');
        const copyBtn = document.getElementById('copy-btn');
        const copyFeedback = document.getElementById('copy-feedback');

        let copyTimeout;

        /**
         * Generates the Basic Authentication header.
         */
        function generateHeader() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username && !password) {
                return;
            }

            const credentials = `${username}:${password}`;

            try {
                const encodedCredentials = btoa(credentials);
                const header = `Authorization: Basic ${encodedCredentials}`;
                resultOutput.textContent = header;
                resultContainer.classList.remove('hidden');
            } catch (error) {
                console.error("Error encoding credentials:", error);
                resultOutput.textContent = "Erreur : Impossible d'encoder les identifiants. Vérifiez s'il y a des caractères non ASCII que votre navigateur ne prend pas en charge dans btoa().";
                resultContainer.classList.remove('hidden');
            }
        }

        /**
         * Copies the generated header to the clipboard.
         */
        function copyToClipboard() {
            const textToCopy = resultOutput.textContent;
            if (!textToCopy) return;

            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            tempTextArea.style.position = 'absolute';
            tempTextArea.style.left = '-9999px';
            document.body.appendChild(tempTextArea);

            tempTextArea.select();
            try {
                document.execCommand('copy');
                displayCopyFeedback('Copié dans le presse-papiers !');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                displayCopyFeedback('Échec de la copie !');
            } finally {
                document.body.removeChild(tempTextArea);
            }
        }

        function displayCopyFeedback(message) {
            copyFeedback.textContent = message;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                copyFeedback.textContent = '';
            }, 2500);
        }

        // --- Event Listeners ---
        generateBtn.addEventListener('click', generateHeader);

        usernameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generateHeader();
            }
        });
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generateHeader();
            }
        });

        copyBtn.addEventListener('click', copyToClipboard);