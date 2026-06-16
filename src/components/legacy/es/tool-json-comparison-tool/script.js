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
            console.log("Inicializando Comparador JSON (con Números de Línea)...");
            if (DOMElements.currentYearSpan) {
                DOMElements.currentYearSpan.textContent = new Date().getFullYear();
            }
            if (typeof jsondiffpatch === 'undefined') {
                 console.warn("jsondiffpatch aún no cargado (diferido). Se inicializará en la primera comparación.");
            }
            loadThemePreference();
            loadSavedInputs();
            addEventListeners();
            updateThemeIcons();
            // Initial line number update for both editors
            updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft);
            updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight);
            console.log("Aplicación inicializada correctamente.");
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
                     console.log("Instancia de jsondiffpatch creada.");
                     return true;
                 } catch (error) {
                     console.error("Error al crear instancia de jsondiffpatch:", error);
                     displayMessage("No se pudo inicializar la biblioteca de comparación.", 'error');
                     return false;
                 }
             } else {
                 console.error("La biblioteca jsondiffpatch no está disponible.");
                 displayMessage("La biblioteca de comparación (jsondiffpatch) no está cargada.", 'error');
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
                console.warn("No se pudieron guardar las entradas en localStorage:", error);
            }
        }
        function loadSavedInputs() {
            try {
                const leftInput = localStorage.getItem(LOCAL_STORAGE_KEYS.leftJson);
                const rightInput = localStorage.getItem(LOCAL_STORAGE_KEYS.rightJson);
                if (leftInput) DOMElements.jsonInputLeft.value = leftInput;
                if (rightInput) DOMElements.jsonInputRight.value = rightInput;
            } catch (error) {
                console.error("Error al cargar entradas desde localStorage:", error);
                displayMessage("No se pudieron cargar las entradas guardadas previamente.", 'error');
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
                console.error(`Error mostrado: ${message}`);
                DOMElements.diffOutputSection.classList.add('hidden');
                DOMElements.downloadButton.classList.add('hidden');
                DOMElements.copyResultsButton.classList.add('hidden');
            } else if (type === 'warning') {
                console.warn(`Advertencia mostrada: ${message}`);
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
                     console.warn(`La entrada ${inputName} se analizó como literal JSON, se tratará como texto.`);
                     return { value: text, type: 'text' };
                 }
            } catch (e) {
                console.warn(`La entrada ${inputName} no es JSON válido. Se tratará como texto.`);
                return { value: text, type: 'text' };
            }
        }

        function compareJson() {
            console.log("Botón Comparar presionado.");
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

            parseResultLeft = parseInput(DOMElements.jsonInputLeft, 'Izquierda');
            parseResultRight = parseInput(DOMElements.jsonInputRight, 'Derecha');

            if (parseResultLeft.type === 'text') warnings.push("La entrada izquierda se trató como texto (no es un objeto/array JSON válido).");
            if (parseResultRight.type === 'text') warnings.push("La entrada derecha se trató como texto (no es un objeto/array JSON válido).");

            if (warnings.length > 0) {
                displayMessage(warnings.join('\n'), 'warning');
            }

            const valueLeft = parseResultLeft.value;
            const valueRight = parseResultRight.value;

            if (valueLeft === null && valueRight === null) {
                displayMessage("Ambas entradas están vacías.", 'info');
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
                    DOMElements.diffOutputWrapper.innerHTML = '<p class="p-4 text-green-600 dark:text-green-400 font-semibold">No se encontraron diferencias.</p>';
                    DOMElements.diffOutputSection.classList.remove('hidden');
                }

                debouncedSave();

            } catch (error) {
                console.error("Error durante la comparación:", error);
                displayMessage(`Ocurrió un error inesperado durante la comparación: ${error.message}`, 'error');
                currentDiffDelta = null;
            }
        }

        function beautifyJson(inputElement) {
            clearMessages();
            const inputName = inputElement.id.includes('left') ? 'Izquierda' : 'Derecha';
            const lineNumbersElement = inputName === 'Izquierda' ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;
            const currentText = inputElement.value.trim();

            if (!currentText) {
                displayMessage(`La entrada ${inputName} está vacía.`, 'info');
                return;
            }

            try {
                const parsedJson = JSON.parse(currentText);
                 if (typeof parsedJson !== 'object' || parsedJson === null) {
                     displayMessage(`La entrada ${inputName} es un literal JSON válido, pero no es un objeto o array. No se puede embellecer.`, 'info');
                     return;
                 }

                inputElement.value = JSON.stringify(parsedJson, null, 2);
                updateLineNumbers(inputElement, lineNumbersElement);
                debouncedSave();
                displayMessage(`Entrada ${inputName} embellecida correctamente.`, 'info');

            } catch (error) {
                inputElement.focus();
                displayMessage(`La entrada ${inputName} no es JSON válido. No se puede embellecer.`, 'info');
                console.warn(`Embellecer falló para ${inputName}: ${error.message}`);
            }
        }

        function clearInput(inputElement) {
             const lineNumbersElement = inputElement.id.includes('left') ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;
             inputElement.value = '';
             updateLineNumbers(inputElement, lineNumbersElement);
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
            const inputName = inputElement.id.includes('left') ? 'Izquierda' : 'Derecha';
            const textToCopy = inputElement.value;

            if (!textToCopy) {
                displayMessage(`La entrada ${inputName} está vacía. Nada que copiar.`, 'info');
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
                displayMessage(`No se pudo copiar el texto ${inputName}. Es posible que el navegador no soporte o no permita el acceso al portapapeles.`, 'error');
                console.error('Error al copiar:', err);
            }
        }

        async function copyResultsToClipboard(buttonElement) {
             const diffContent = DOMElements.diffOutputWrapper.innerText;
             if (!currentDiffDelta || !diffContent?.trim()) {
                 displayMessage('No hay resultados que copiar.', 'info');
                 return;
             }
             try {
                 await navigator.clipboard.writeText(diffContent);
                 const originalHTML = buttonElement.innerHTML;
                 const svgIcon = buttonElement.querySelector('svg')?.outerHTML || '';
                 buttonElement.innerHTML = `${svgIcon} <span class="ml-2">¡Copiado!</span>`;
                 buttonElement.disabled = true;
                 setTimeout(() => {
                     buttonElement.innerHTML = originalHTML;
                     buttonElement.disabled = false;
                 }, 1500);
             } catch (err) {
                 displayMessage('No se pudieron copiar los resultados. Es posible que el navegador no soporte o no permita el acceso al portapapeles.', 'error');
                 console.error('Error al copiar resultados:', err);
             }
         }

        async function pasteFromClipboard(inputElement) {
            clearMessages();
            const lineNumbersElement = inputElement.id.includes('left') ? DOMElements.lineNumbersLeft : DOMElements.lineNumbersRight;

            if (!navigator.clipboard || !navigator.clipboard.readText) {
                displayMessage('La API del Portapapeles no está soportada o el permiso fue denegado por tu navegador.', 'error');
                return;
            }

            try {
                const text = await navigator.clipboard.readText();
                inputElement.value = text;
                updateLineNumbers(inputElement, lineNumbersElement);
                debouncedSave();
            } catch (err) {
                if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                    displayMessage('El permiso para pegar del portapapeles fue denegado por tu navegador o sistema operativo.', 'error');
                } else {
                    displayMessage('No se pudo leer del portapapeles.', 'error');
                }
                console.error('Error al pegar:', err);
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
                 displayMessage(`Tipo de archivo inválido (${file.type || fileExtension}). Por favor sube un archivo .json o .txt.`, 'error');
                 event.target.value = '';
                 return;
            }

             const maxSizeMB = 10;
             if (file.size > maxSizeMB * 1024 * 1024) {
                 displayMessage(`Archivo demasiado grande (máx. ${maxSizeMB} MB).`, 'error');
                 event.target.value = '';
                 return;
             }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    inputElement.value = e.target.result;
                    updateLineNumbers(inputElement, lineNumbersElement);
                    debouncedSave();
                } catch (readError) {
                    displayMessage(`Error al procesar el contenido del archivo: ${readError.message}`, 'error');
                } finally {
                    event.target.value = '';
                }
            };
            reader.onerror = (e) => {
                displayMessage(`Error al leer el archivo.`, 'error');
                console.error("Error de FileReader:", e);
                event.target.value = '';
            };
            reader.readAsText(file);
        }

        // --- Download ---
        function downloadDiff() {
            if (!currentDiffDelta) {
                displayMessage("No hay resultados de comparación disponibles para descargar.", 'info');
                return;
            }
            try {
                const diffString = JSON.stringify(currentDiffDelta, null, 2);
                const blob = new Blob([diffString], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                a.download = `comparacion_diff_${timestamp}.json`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                displayMessage("No se pudo generar el archivo de descarga.", 'error');
                console.error("Error de descarga:", error);
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

                     updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft);
                     updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight);

                     debouncedSave();
                     displayMessage('Modo desarrollador: ¡JSON de ejemplo cargado!', 'info');
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
            DOMElements.jsonInputLeft.addEventListener('input', () => updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft));
            DOMElements.jsonInputLeft.addEventListener('scroll', () => syncScroll(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft));
            DOMElements.jsonInputLeft.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
                    updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft);
                }
            });
            DOMElements.jsonInputLeft.addEventListener('paste', () => updateLineNumbers(DOMElements.jsonInputLeft, DOMElements.lineNumbersLeft));
            DOMElements.jsonInputLeft.addEventListener('input', handleDevMode);
            DOMElements.jsonInputLeft.addEventListener('input', debouncedSave);

            // --- Input Actions (Right) ---
            DOMElements.beautifyRightButton.addEventListener('click', () => beautifyJson(DOMElements.jsonInputRight));
            DOMElements.copyRightButton.addEventListener('click', (e) => copyToClipboard(DOMElements.jsonInputRight, e.currentTarget));
            DOMElements.pasteRightButton.addEventListener('click', () => pasteFromClipboard(DOMElements.jsonInputRight));
            DOMElements.clearRightButton.addEventListener('click', () => clearInput(DOMElements.jsonInputRight));
            DOMElements.uploadRightInput.addEventListener('change', (e) => handleFileUpload(e, DOMElements.jsonInputRight));
            DOMElements.jsonInputRight.addEventListener('input', () => updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight));
            DOMElements.jsonInputRight.addEventListener('scroll', () => syncScroll(DOMElements.jsonInputRight, DOMElements.lineNumbersRight));
            DOMElements.jsonInputRight.addEventListener('keydown', (e) => {
                 if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
                    updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight);
                 }
            });
            DOMElements.jsonInputRight.addEventListener('paste', () => updateLineNumbers(DOMElements.jsonInputRight, DOMElements.lineNumbersRight));
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

            console.log("Listeners de eventos añadidos.");
        }

        // --- Run Application ---
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }