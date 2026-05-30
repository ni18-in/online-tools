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
                // You could add a subtle shake animation or a message here if desired
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
                resultOutput.textContent = "Error: Could not encode credentials. Please check for non-ASCII characters if your browser does not support them in btoa().";
                resultContainer.classList.remove('hidden');
            }
        }

        /**
         * Copies the generated header to the clipboard.
         * Uses a temporary textarea to ensure compatibility, especially in iFrames.
         */
        function copyToClipboard() {
            const textToCopy = resultOutput.textContent;
            if (!textToCopy) return;

            // Create a temporary textarea element
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            tempTextArea.style.position = 'absolute';
            tempTextArea.style.left = '-9999px'; // Move it off-screen
            document.body.appendChild(tempTextArea);
            
            // Select and copy
            tempTextArea.select();
            try {
                document.execCommand('copy');
                displayCopyFeedback('Copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                displayCopyFeedback('Failed to copy!');
            } finally {
                // Clean up the temporary element
                document.body.removeChild(tempTextArea);
            }
        }

        /**
         * Displays a feedback message for the copy action.
         * @param {string} message - The message to display.
         */
        function displayCopyFeedback(message) {
            copyFeedback.textContent = message;
            
            // Clear any existing timeout to avoid overlaps
            clearTimeout(copyTimeout);

            // Set a new timeout to clear the message
            copyTimeout = setTimeout(() => {
                copyFeedback.textContent = '';
            }, 2500);
        }

        // --- Event Listeners ---

        // Generate button click
        generateBtn.addEventListener('click', generateHeader);
        
        // Allow pressing Enter in input fields to generate
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

        // Copy button click
        copyBtn.addEventListener('click', copyToClipboard);
