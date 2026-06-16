// --- Constants and DOM Elements ---
        const DOMElements = {
            // Input Textareas & Line Numbers
            jsonInputLeft: document.getElementById('json-input-left'),
            jsonInputRight: document.getElementById('json-input-right'),
            lineNumbersLeft: document.getElementById('line-numbers-left'),
            lineNumbersRight: document.getElementById('line-numbers-right'),
            // Buttons
            compareButton: document.getElementById('compare-button'),
            clearLeftButton: document.getElementById('clear-left'),
            clearRightButton: document.getElementById('clear-right'),
            beautifyLeftButton: document.getElementById('beautify-left'),
            beautifyRightButton: document.getElementById('beautify-right'),
            copyLeftButton: document.getElementById('copy-left'),
            copyRightButton: document.getElementById('copy-right'),
            pasteLeftButton: document.getElementById('paste-left'),
            pasteRightButton: document.getElementById('paste-right'),
            downloadButton: document.getElementById('download-button'),
            copyResultsButton: document.getElementById('copy-results-button'),
            themeToggleButton: document.getElementById('theme-toggle'),
            howToUseButton: document.getElementById('how-to-use-button'),
            closeModalButton: document.getElementById('close-modal-button'),
            // File Uploads
            uploadLeftInput: document.getElementById('upload-left'),
            uploadRightInput: document.getElementById('upload-right'),
            // Output & Messages
            diffOutputSection: document.getElementById('diff-output-section'),
            diffOutputWrapper: document.getElementById('diff-output-wrapper'),
            messageArea: document.getElementById('message-area'),
            // Theme Icons & Footer
            themeIconLight: document.getElementById('theme-icon-light'),
            themeIconDark: document.getElementById('theme-icon-dark'),
            currentYearSpan: document.getElementById('current-year'),
            // Options
            ignoreArrayOrderCheckbox: document.getElementById('ignore-array-order'),
            // Modal
            modalOverlay: document.getElementById('modal-overlay'),
            howToUseModal: document.getElementById('how-to-use-modal'),
            // Global
            htmlElement: document.documentElement,
        };

        const LOCAL_STORAGE_KEYS = {
            theme: 'jsonComparerTheme',
            leftJson: 'jsonComparerLeftJson',
            rightJson: 'jsonComparerRightJson',
        };

        // --- State ---
        let currentDiffDelta = null;
        let saveTimeout;

        // --- Initialization ---
        function initializeApp() {
            console.log("Initializing JSON Comparison App (with Line Numbers)...");
            if (DOMElements.currentYearSpan) {
                DOMElements.currentYearSpan.textContent = new Date().getFullYear();
            }
            if (typeof jsondiffpatch === 'undefined') {
                 console.warn("jsondiffpatch not loaded yet (deferred). Will initialize on first compare.");
            }
            loadThemePreference();
            loadSavedInputs();
            addEventListeners();
            updateThemeIcons();
            // Initial line number update for both editors
            updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft);
            updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight);
            console.log("App Initialized Successfully.");
        }

        // --- jsondiffpatch Initialization ---
        function initializeJsonDiffPatcher() {
             if (window.jsonDiffPatcherInstance) return true;
             if (typeof jsondiffpatch !== 'undefined') {
                 try {
                     window.jsonDiffPatcherInstance = jsondiffpatch.create({
                         objectHash: (obj, index) => obj.id || obj._id || '$$index:' + index,
                         arrays: { detectMove: true, includeValueOnMove: false },
                         textDiff: { minLength: 60 },
                         cloneDiffValues: false
                     });
                     console.log("jsondiffpatch instance created.");
                     return true;
                 } catch (error) {
                     console.error("Error creating jsondiffpatch instance:", error);
                     displayMessage("Failed to initialize comparison library.", 'error');
                     return false;
                 }
             } else {
                 console.error("jsondiffpatch library is not available.");
                 displayMessage("Comparison library (jsondiffpatch) is not loaded.", 'error');
                 return false;
             }
         }

        // --- Theme Management ---
        function applyTheme(theme) {
            updateThemeIcons();
        }
        function toggleTheme() {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            try { localStorage.setItem('theme', next); } catch (e) {}
            updateThemeIcons();
        }
        function loadThemePreference() {
            updateThemeIcons();
        }
        function updateThemeIcons() {
            const isDark = document.documentElement.dataset.theme === 'dark';
            if (DOMElements.themeIconLight) DOMElements.themeIconLight.classList.toggle('hidden', !isDark);
            if (DOMElements.themeIconDark) DOMElements.themeIconDark.classList.toggle('hidden', isDark);
        }

        // --- LocalStorage for Inputs ---
        const debouncedSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveInputsToLocalStorage, 500);
        };
        function saveInputsToLocalStorage() {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEYS.leftJson, DOMElements.jsonInputLeft.value);
                localStorage.setItem(LOCAL_STORAGE_KEYS.rightJson, DOMElements.jsonInputRight.value);
            } catch (error) {
                console.warn("Could not save inputs to localStorage:", error);
            }
        }
        function loadSavedInputs() {
            try {
                const leftInput = localStorage.getItem(LOCAL_STORAGE_KEYS.leftJson);
                const rightInput = localStorage.getItem(LOCAL_STORAGE_KEYS.rightJson);
                if (leftInput) DOMElements.jsonInputLeft.value = leftInput;
                if (rightInput) DOMElements.jsonInputRight.value = rightInput;
                // Line numbers will be updated during initializeApp
            } catch (error) {
                console.error("Error loading inputs from localStorage:", error);
                displayMessage("Could not load previously saved inputs.", 'error');
            }
        }

        // --- Message Handling ---
        function displayMessage(message, type = 'info') { // types: 'info', 'error', 'warning'
            clearMessages();
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            messageDiv.classList.add('message-box');
            messageDiv.classList.add(`message-box-${type}`);
            messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
            messageDiv.style.display = 'block';
            DOMElements.messageArea.appendChild(messageDiv);

            if (type === 'error') {
                console.error(`Error Displayed: ${message}`);
                DOMElements.diffOutputSection.classList.add('hidden');
                DOMElements.downloadButton.classList.add('hidden');
                DOMElements.copyResultsButton.classList.add('hidden');
            } else if (type === 'warning') {
                console.warn(`Warning Displayed: ${message}`);
            }
        }
        function clearMessages() {
            DOMElements.messageArea.innerHTML = '';
        }

        // --- Line Number Logic ---
        function updateLineNumbers(textareaElement, lineNumbersElement) {
            setTimeout(() => {
                const lines = textareaElement.value.split('\n');
                const lineCount = lines.length || 1;
                let numbers = '';
                for (let i = 1; i <= lineCount; i++) {
                    numbers += i + '\n';
                }
                lineNumbersElement.textContent = numbers.trimEnd();
                lineNumbersElement.scrollTop = textareaElement.scrollTop;
            }, 0);
        }
        function syncScroll(textareaElement, lineNumbersElement) {
            lineNumbersElement.scrollTop = textareaElement.scrollTop;
        }


        // --- Core Functionality ---
        function parseInput(inputElement, inputName) {
            const text = inputElement.value.trim();
            if (!text) return { value: null, type: 'empty' };

            try {
                const parsed = JSON.parse(text);
                 if (typeof parsed === 'object' && parsed !== null) {
                    return { value: parsed, type: 'json' };
                 } else {
                     console.warn(`${inputName} input parsed as JSON literal, treating as text.`);
                     return { value: text, type: 'text' };
                 }
            } catch (e) {
                console.warn(`${inputName} input is not valid JSON. Treating as text.`);
                return { value: text, type: 'text' };
            }
        }

        function compareJson() {
            console.log("Compare button clicked.");
            clearMessages();
            currentDiffDelta = null;
            DOMElements.downloadButton.classList.add('hidden');
            DOMElements.copyResultsButton.classList.add('hidden');
            DOMElements.diffOutputWrapper.innerHTML = '';

            if (!initializeJsonDiffPatcher()) {
                 return;
            }

            let parseResultLeft, parseResultRight;
            let warnings = [];

            parseResultLeft = parseInput(DOMElements.jsonInputLeft, 'Left');
            parseResultRight = parseInput(DOMElements.jsonInputRight, 'Right');

            if (parseResultLeft.type === 'text') warnings.push("Left input treated as text (not valid JSON object/array).");
            if (parseResultRight.type === 'text') warnings.push("Right input treated as text (not valid JSON object/array).");

            if (warnings.length > 0) {
                displayMessage(warnings.join('\n'), 'warning');
            }

            const valueLeft = parseResultLeft.value;
            const valueRight = parseResultRight.value;

            if (valueLeft === null && valueRight === null) {
                displayMessage("Both inputs are empty.", 'info');
                DOMElements.diffOutputSection.classList.add('hidden');
                return;
            }

            try {
                const ignoreArrayOrder = DOMElements.ignoreArrayOrderCheckbox.checked &&
                                         parseResultLeft.type === 'json' &&
                                         parseResultRight.type === 'json';

                const diffOptions = {
                     ...window.jsonDiffPatcherInstance.options,
                     arrays: {
                         ...window.jsonDiffPatcherInstance.options.arrays,
                         detectMove: !ignoreArrayOrder
                     }
                 };
                const currentPatcher = jsondiffpatch.create(diffOptions);

                const delta = currentPatcher.diff(valueLeft, valueRight);
                currentDiffDelta = delta;

                if (delta) {
                    // Use the HTML formatter from jsondiffpatch
                    const htmlDiff = jsondiffpatch.formatters.html.format(delta, valueLeft);
                    DOMElements.diffOutputWrapper.innerHTML = htmlDiff;
                    // Make the section visible
                    DOMElements.diffOutputSection.classList.remove('hidden');
                    // Show action buttons
                    DOMElements.downloadButton.classList.remove('hidden');
                    DOMElements.copyResultsButton.classList.remove('hidden');
                } else {
                    // No differences found
                    DOMElements.diffOutputWrapper.innerHTML = '<p class="p-4 text-green-600 dark:text-green-400 font-semibold">No Differences Found.</p>';
                    DOMElements.diffOutputSection.classList.remove('hidden');
                }

                debouncedSave();

            } catch (error) {
                console.error("Error during comparison:", error);
                displayMessage(`An unexpected error occurred during comparison: ${error.message}`, 'error');
                currentDiffDelta = null;
            }
        }

        function beautifyJson(inputElement) {
            clearMessages();
            const inputName = inputElement.id.includes('left') ? 'Left' : 'Right';
            const lineNumbersElement = inputName === 'Left' ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;
            const currentText = inputElement.value.trim();

            if (!currentText) {
                displayMessage(`${inputName} input is empty.`, 'info');
                return;
            }

            try {
                const parsedJson = JSON.parse(currentText);
                 if (typeof parsedJson !== 'object' || parsedJson === null) {
                     displayMessage(`${inputName} input is a valid JSON literal, but not an object or array. Cannot beautify.`, 'info');
                     return;
                 }

                inputElement.value = JSON.stringify(parsedJson, null, 2);
                updateLineNumbers(inputElement, lineNumbersElement); // Update line numbers after beautify
                debouncedSave();
                displayMessage(`${inputName} input successfully beautified.`, 'info');

            } catch (error) {
                inputElement.focus();
                displayMessage(`${inputName} input is not valid JSON. Cannot beautify.`, 'info');
                console.warn(`Beautify failed for ${inputName}: ${error.message}`);
            }
        }

        function clearInput(inputElement) {
             const lineNumbersElement = inputElement.id.includes('left') ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;
             inputElement.value = '';
             updateLineNumbers(inputElement, lineNumbersElement); // Update line numbers after clear
             debouncedSave();
             clearMessages();

             if (!DOMElements.jsonInputLeft.value && !DOMElements.jsonInputRight.value) {
                 DOMElements.diffOutputWrapper.innerHTML = '';
                 DOMElements.diffOutputSection.classList.add('hidden');
                 DOMElements.downloadButton.classList.add('hidden');
                 DOMElements.copyResultsButton.classList.add('hidden');
                 currentDiffDelta = null;
             }
         }

        // --- Clipboard Operations ---
        async function copyToClipboard(inputElement, buttonElement) {
            const inputName = inputElement.id.includes('left') ? 'Left' : 'Right';
            const textToCopy = inputElement.value;

            if (!textToCopy) {
                displayMessage(`Input ${inputName} is empty. Nothing to copy.`, 'info');
                return;
            }

            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalHTML = buttonElement.innerHTML;
                buttonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-green-500"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;
                buttonElement.disabled = true;
                setTimeout(() => {
                    buttonElement.innerHTML = originalHTML;
                    buttonElement.disabled = false;
                }, 1500);
            } catch (err) {
                displayMessage(`Failed to copy ${inputName} text. Browser may not support or allow clipboard access.`, 'error');
                console.error('Copy failed:', err);
            }
        }

        async function copyResultsToClipboard(buttonElement) {
             const diffContent = DOMElements.diffOutputWrapper.innerText;
             if (!currentDiffDelta || !diffContent?.trim()) {
                 displayMessage('No results to copy.', 'info');
                 return;
             }
             try {
                 await navigator.clipboard.writeText(diffContent);
                 const originalHTML = buttonElement.innerHTML;
                 const svgIcon = buttonElement.querySelector('svg')?.outerHTML || '';
                 buttonElement.innerHTML = `${svgIcon} <span class="ml-2">Copied!</span>`;
                 buttonElement.disabled = true;
                 setTimeout(() => {
                     buttonElement.innerHTML = originalHTML;
                     buttonElement.disabled = false;
                 }, 1500);
             } catch (err) {
                 displayMessage('Failed to copy results. Browser may not support or allow clipboard access.', 'error');
                 console.error('Copy results failed:', err);
             }
         }

        async function pasteFromClipboard(inputElement) {
            clearMessages();
            const lineNumbersElement = inputElement.id.includes('left') ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;

            if (!navigator.clipboard || !navigator.clipboard.readText) {
                displayMessage('Clipboard API not supported or permission denied by your browser.', 'error');
                return;
            }

            try {
                const text = await navigator.clipboard.readText();
                inputElement.value = text;
                updateLineNumbers(inputElement, lineNumbersElement); // Update line numbers after paste
                debouncedSave();
            } catch (err) {
                if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                    displayMessage('Clipboard paste permission denied by your browser or operating system.', 'error');
                } else {
                    displayMessage('Failed to read from clipboard.', 'error');
                }
                console.error('Paste failed:', err);
            }
        }

        // --- File Handling ---
        function handleFileUpload(event, inputElement) {
            clearMessages();
            const file = event.target.files[0];
            const lineNumbersElement = inputElement.id.includes('left') ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;

            if (!file) return;

            const allowedTypes = ['application/json', 'text/plain'];
            const allowedExtensions = ['.json', '.txt'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                 displayMessage(`Invalid file type (${file.type || fileExtension}). Please upload a .json or .txt file.`, 'error');
                 event.target.value = '';
                 return;
            }

             const maxSizeMB = 10;
             if (file.size > maxSizeMB * 1024 * 1024) {
                 displayMessage(`File too large (max ${maxSizeMB} MB).`, 'error');
                 event.target.value = '';
                 return;
             }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    inputElement.value = e.target.result;
                    updateLineNumbers(inputElement, lineNumbersElement); // Update line numbers after file load
                    debouncedSave();
                } catch (readError) {
                    displayMessage(`Error processing file content: ${readError.message}`, 'error');
                } finally {
                    event.target.value = '';
                }
            };
            reader.onerror = (e) => {
                displayMessage(`Error reading file.`, 'error');
                console.error("FileReader error:", e);
                event.target.value = '';
            };
            reader.readAsText(file);
        }

        // --- Download ---
        function downloadDiff() {
            if (!currentDiffDelta) {
                displayMessage("No comparison results available to download.", 'info');
                return;
            }
            try {
                const diffString = JSON.stringify(currentDiffDelta, null, 2);
                const blob = new Blob([diffString], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                a.download = `comparison_diff_${timestamp}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                displayMessage("Failed to generate download file.", 'error');
                console.error("Download error:", error);
            }
        }

        // --- Dev Mode ---
        function handleDevMode(event) {
             const targetInput = event.target;
             if (targetInput === DOMElements.jsonInputLeft || targetInput === DOMElements.jsonInputRight) {
                 if (targetInput.value.endsWith(':dev')) {
                     targetInput.value = targetInput.value.slice(0, -4);
                     clearMessages();

                     const sampleJson1 = { "name": "JSON Compare Tool", "version": "1.0", "features": ["compare", "beautify", "highlight", "dark mode"], "enabled": true, "settings": { "theme": "auto", "indent": 2 }, "items": [ { "id": 1, "value": "apple" }, { "id": 2, "value": "banana" } ] };
                     const sampleJson2 = { "name": "JSON Comparison Online", "version": "1.1", "features": ["compare", "beautify", "highlight", "dark mode", "file upload", "download"], "enabled": true, "settings": { "theme": "dark", "indent": 2 }, "items": [ { "id": 2, "value": "banana" }, { "id": 3, "value": "cherry" } ], "new_feature": "localStorage persistence" };

                     if (targetInput === DOMElements.jsonInputLeft) {
                         DOMElements.jsonInputLeft.value = JSON.stringify(sampleJson1, null, 2);
                         DOMElements.jsonInputRight.value = JSON.stringify(sampleJson2, null, 2);
                     } else {
                         DOMElements.jsonInputLeft.value = JSON.stringify(sampleJson2, null, 2);
                         DOMElements.jsonInputRight.value = JSON.stringify(sampleJson1, null, 2);
                     }

                     // Update line numbers for both after loading dev data
                     updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft);
                     updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight);

                     debouncedSave();
                     displayMessage('Developer mode: Sample JSON loaded!', 'info');
                     compareJson();
                 }
             }
         }

        // --- Modal Logic ---
        function openModal() {
            DOMElements.modalOverlay.classList.remove('hidden');
            DOMElements.howToUseModal.classList.remove('hidden');
            DOMElements.modalOverlay.setAttribute('aria-hidden', 'false');
            DOMElements.howToUseModal.setAttribute('aria-hidden', 'false');
            DOMElements.closeModalButton.focus();
        }
        function closeModal() {
            DOMElements.modalOverlay.classList.add('hidden');
            DOMElements.howToUseModal.classList.add('hidden');
            DOMElements.modalOverlay.setAttribute('aria-hidden', 'true');
            DOMElements.howToUseModal.setAttribute('aria-hidden', 'true');
            DOMElements.howToUseButton.focus();
        }

        // --- Event Listeners Setup ---
        function addEventListeners() {
            // Main Actions
            DOMElements.compareButton.addEventListener('click', compareJson);
            DOMElements.themeToggleButton.addEventListener('click', toggleTheme);
            DOMElements.downloadButton.addEventListener('click', downloadDiff);
            DOMElements.copyResultsButton.addEventListener('click', (e) => copyResultsToClipboard(e.currentTarget));

            // Modal Triggers
            DOMElements.howToUseButton.addEventListener('click', openModal);
            DOMElements.closeModalButton.addEventListener('click', closeModal);
            DOMElements.modalOverlay.addEventListener('click', closeModal);

            // --- Input Actions (Left) ---
            DOMElements.beautifyLeftButton.addEventListener('click', () => beautifyJson(DOMElements.jsonInputLeft));
            DOMElements.copyLeftButton.addEventListener('click', (e) => copyToClipboard(DOMElements.jsonInputLeft, e.currentTarget));
            DOMElements.pasteLeftButton.addEventListener('click', () => pasteFromClipboard(DOMElements.jsonInputLeft));
            DOMElements.clearLeftButton.addEventListener('click', () => clearInput(DOMElements.jsonInputLeft));
            DOMElements.uploadLeftInput.addEventListener('change', (e) => handleFileUpload(e, DOMElements.jsonInputLeft));
            // Line number updates for Left Textarea
            DOMElements.jsonInputLeft.addEventListener('input', () => updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft));
            DOMElements.jsonInputLeft.addEventListener('scroll', () => syncScroll(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft));
            DOMElements.jsonInputLeft.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
                    updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft);
                }
            });
            DOMElements.jsonInputLeft.addEventListener('paste', () => updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft));
            // Dev mode & Save
            DOMElements.jsonInputLeft.addEventListener('input', handleDevMode);
            DOMElements.jsonInputLeft.addEventListener('input', debouncedSave);


            // --- Input Actions (Right) ---
            DOMElements.beautifyRightButton.addEventListener('click', () => beautifyJson(DOMElements.jsonInputRight));
            DOMElements.copyRightButton.addEventListener('click', (e) => copyToClipboard(DOMElements.jsonInputRight, e.currentTarget));
            DOMElements.pasteRightButton.addEventListener('click', () => pasteFromClipboard(DOMElements.jsonInputRight));
            DOMElements.clearRightButton.addEventListener('click', () => clearInput(DOMElements.jsonInputRight));
            DOMElements.uploadRightInput.addEventListener('change', (e) => handleFileUpload(e, DOMElements.jsonInputRight));
            // Line number updates for Right Textarea
            DOMElements.jsonInputRight.addEventListener('input', () => updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight));
            DOMElements.jsonInputRight.addEventListener('scroll', () => syncScroll(DOMElements.jsonInputRight, DOMElements.lineNumbersRight));
            DOMElements.jsonInputRight.addEventListener('keydown', (e) => {
                 if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
                    updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight);
                 }
            });
            DOMElements.jsonInputRight.addEventListener('paste', () => updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight));
            // Dev mode & Save
            DOMElements.jsonInputRight.addEventListener('input', handleDevMode);
            DOMElements.jsonInputRight.addEventListener('input', debouncedSave);


            // Options
            DOMElements.ignoreArrayOrderCheckbox.addEventListener('change', () => {
                if (!DOMElements.diffOutputSection.classList.contains('hidden')) {
                    compareJson();
                }
            });

            // Keyboard Shortcuts
            document.addEventListener('keydown', (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                    if (document.activeElement !== DOMElements.jsonInputLeft && document.activeElement !== DOMElements.jsonInputRight) {
                        event.preventDefault();
                        DOMElements.compareButton.click();
                        DOMElements.compareButton.focus();
                        setTimeout(() => DOMElements.compareButton.blur(), 150);
                    }
                }
                if ((event.ctrlKey || event.metaKey) && (event.key === 'b' || event.key === 'B')) {
                    if (document.activeElement === DOMElements.jsonInputLeft) {
                        event.preventDefault();
                        DOMElements.beautifyLeftButton.click();
                    } else if (document.activeElement === DOMElements.jsonInputRight) {
                        event.preventDefault();
                        DOMElements.beautifyRightButton.click();
                    }
                }
                 if (event.key === 'Escape' && !DOMElements.howToUseModal.classList.contains('hidden')) {
                     closeModal();
                 }
            });

             // System Theme Change Listener
             const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
             const handleSystemThemeChange = (e) => {
                 if (!localStorage.getItem(LOCAL_STORAGE_KEYS.theme)) {
                     applyTheme(e.matches ? 'dark' : 'light');
                 }
             };
             if (mediaQuery.addEventListener) {
                 mediaQuery.addEventListener('change', handleSystemThemeChange);
             } else if (mediaQuery.addListener) {
                 mediaQuery.addListener(handleSystemThemeChange);
             }

             // Global Theme Change Observer
             var themeObserver = new MutationObserver(() => updateThemeIcons());
             themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

            console.log("Event listeners added.");
        }

        // --- Run Application ---
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
