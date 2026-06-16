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

            // Do not generate if inputs are empty
            if (!username && !password) {
                return;
            }

            // Combine username and password with a colon
            const credentials = `${username}:${password}`;

            try {
                // Encode the combined string in Base64
                const encodedCredentials = btoa(credentials);

                // Format the final Authorization header
                const header = `Authorization: Basic ${encodedCredentials}`;

                // Display the result
                resultOutput.textContent = header;
                resultContainer.classList.remove('hidden');
            } catch (error) {
                console.error("Error encoding credentials:", error);
                resultOutput.textContent = "Error: No se pudieron codificar las credenciales. Verifica si hay caracteres no ASCII que tu navegador no soporte en btoa().";
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
                displayCopyFeedback('¡Copiado al portapapeles!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                displayCopyFeedback('¡Error al copiar!');
            } finally {
                document.body.removeChild(tempTextArea);
            }
        }

        /**
         * Displays a feedback message for the copy action.
         * @param {string} message - The message to display.
         */
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