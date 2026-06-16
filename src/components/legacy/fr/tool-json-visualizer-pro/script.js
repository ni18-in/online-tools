// DOM Element References
        const jsonInput = document.getElementById('jsonInput');
        const visualizeBtn = document.getElementById('visualizeBtn');
        const formatBtn = document.getElementById('formatBtn');
        const minifyBtn = document.getElementById('minifyBtn');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        const jsonVisualizer = document.getElementById('jsonVisualizer');
        const errorDisplay = document.getElementById('errorDisplay');
        const messageBox = document.getElementById('messageBox');
        const howToUseBtn = document.getElementById('howToUseBtn');
        const howToUseModal = document.getElementById('howToUseModal');
        const closeModalBtn = document.getElementById('closeModalBtn');

        // State
        let currentJsonObject = null;
        const MAX_HISTORY_SIZE = 30;
        let historyStack = [];
        let redoStack = [];

        // --- Utility Functions ---
        function showMessage(message, duration = 2000) { messageBox.textContent = message; messageBox.classList.add('show'); if (messageBox.timeoutId) clearTimeout(messageBox.timeoutId); messageBox.timeoutId = setTimeout(() => { messageBox.classList.remove('show'); messageBox.timeoutId = null; }, duration); }
        function deepCopy(obj) { if (obj === null || typeof obj !== 'object') { return obj; } try { return JSON.parse(JSON.stringify(obj)); } catch (e) { console.error("Deep copy failed:", e); return null; } }
        function updateHistoryButtons() { undoBtn.disabled = historyStack.length <= 1; redoBtn.disabled = redoStack.length === 0; }
        function saveState() { const stateToSave = deepCopy(currentJsonObject); if (stateToSave === null && currentJsonObject !== null) { showMessage("Erreur lors de l'enregistrement de l'historique.", 3000); return; } if (historyStack.length > 0) { const previousStateString = JSON.stringify(historyStack[historyStack.length - 1]); const currentStateString = JSON.stringify(stateToSave); if (previousStateString === currentStateString) return; } historyStack.push(stateToSave); if (historyStack.length > MAX_HISTORY_SIZE) historyStack.shift(); if (redoStack.length > 0) redoStack = []; updateHistoryButtons(); }
        function undo() { if (historyStack.length <= 1) return; const currentState = historyStack.pop(); redoStack.push(currentState); currentJsonObject = deepCopy(historyStack[historyStack.length - 1]); updateJsonInput(); renderVisualization(); updateHistoryButtons(); showMessage("Action annulée.", 1500); }
        function redo() { if (redoStack.length === 0) return; const stateToRestore = redoStack.pop(); historyStack.push(stateToRestore); if (historyStack.length > MAX_HISTORY_SIZE) historyStack.shift(); currentJsonObject = deepCopy(stateToRestore); updateJsonInput(); renderVisualization(); updateHistoryButtons(); showMessage("Action rétablie.", 1500); }
        function parseAndUpdateState(attemptSaveHistory = true) { errorDisplay.textContent = ''; let parsedSuccessfully = false; let tempParsedObject = null; try { const text = jsonInput.value.trim(); if (!text) { tempParsedObject = null; jsonVisualizer.innerHTML = '<p class="text-gray-500 italic">L\'entrée est vide.</p>'; } else { tempParsedObject = JSON.parse(text); } currentJsonObject = tempParsedObject; parsedSuccessfully = true; } catch (error) { errorDisplay.textContent = `JSON invalide : ${error.message}`; jsonVisualizer.innerHTML = '<p class="text-red-500 italic font-semibold">Impossible de visualiser en raison d\'erreurs JSON.</p>'; parsedSuccessfully = false; } if (parsedSuccessfully && attemptSaveHistory) { saveState(); } return parsedSuccessfully; }
        function updateJsonInput(format = true) { if (currentJsonObject !== null) { try { jsonInput.value = JSON.stringify(currentJsonObject, null, format ? 2 : undefined); } catch (error) { errorDisplay.textContent = `Erreur lors de la mise à jour de l'entrée : ${error.message}`; console.error("Error stringifying internal JSON object:", error); } } else { if (historyStack.length > 0 && historyStack[historyStack.length - 1] === null) { jsonInput.value = ''; } } }

        // --- Visualization Logic ---
        function createJsonNode(data) { const type = typeof data; const element = document.createElement('span'); if (data === null) { element.textContent = 'null'; element.className = 'json-null'; } else if (type === 'string') { element.textContent = `"${data}"`; element.className = 'json-string'; } else if (type === 'number') { element.textContent = data; element.className = 'json-number'; } else if (type === 'boolean') { element.textContent = data; element.className = 'json-boolean'; } else if (Array.isArray(data)) { return createJsonArrayNode(data); } else if (type === 'object') { return createJsonObjectNode(data); } else { element.textContent = String(data); } return element; }
        function createJsonArrayNode(arr) { const ul = document.createElement('ul'); ul.className = 'json-array'; const openBracket = document.createElement('span'); openBracket.textContent = '['; openBracket.className = 'json-bracket'; ul.appendChild(openBracket); if (arr.length === 0) { const emptyText = document.createElement('span'); emptyText.textContent = ' ]'; emptyText.className = 'json-bracket empty-text'; ul.appendChild(emptyText); } else { arr.forEach((item, index) => { const li = document.createElement('li'); const valueNode = createJsonNode(item); li.appendChild(valueNode); if (index < arr.length - 1) { const comma = document.createElement('span'); comma.textContent = ','; li.appendChild(comma); } ul.appendChild(li); }); const closeBracketLi = document.createElement('li'); const closeBracket = document.createElement('span'); closeBracket.textContent = ']'; closeBracket.className = 'json-bracket'; closeBracketLi.appendChild(closeBracket); ul.appendChild(closeBracketLi); } return ul; }
        function createJsonObjectNode(obj) { const ul = document.createElement('ul'); ul.className = 'json-object'; const openBrace = document.createElement('span'); openBrace.textContent = '{'; openBrace.className = 'json-brace'; ul.appendChild(openBrace); const keys = Object.keys(obj); if (keys.length === 0) { const emptyText = document.createElement('span'); emptyText.textContent = ' }'; emptyText.className = 'json-brace empty-text'; ul.appendChild(emptyText); } else { keys.forEach((key, index) => { const li = document.createElement('li'); const keySpan = document.createElement('span'); keySpan.textContent = `"${key}": `; keySpan.className = 'json-key'; li.appendChild(keySpan); const valueNode = createJsonNode(obj[key]); li.appendChild(valueNode); if (index < keys.length - 1) { const comma = document.createElement('span'); comma.textContent = ','; li.appendChild(comma); } ul.appendChild(li); }); const closeBraceLi = document.createElement('li'); const closeBrace = document.createElement('span'); closeBrace.textContent = '}'; closeBrace.className = 'json-brace'; closeBraceLi.appendChild(closeBrace); ul.appendChild(closeBraceLi); } return ul; }
        function renderVisualization() { jsonVisualizer.innerHTML = ''; if (currentJsonObject !== null) { try { const rootNode = createJsonNode(currentJsonObject); jsonVisualizer.appendChild(rootNode); } catch (e) { console.error("Error rendering visualization:", e); jsonVisualizer.innerHTML = '<p class="text-red-500 italic font-semibold">Une erreur est survenue lors du rendu.</p>'; errorDisplay.textContent = `Erreur de rendu : ${e.message}`; } } else if (!jsonInput.value.trim()) { jsonVisualizer.innerHTML = '<p class="text-gray-500 italic">L\'entrée est vide.</p>'; } }

        // --- Modal Logic ---
        function openModal() { howToUseModal.classList.add('active'); }
        function closeModal() { howToUseModal.classList.remove('active'); }
        howToUseBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        howToUseModal.addEventListener('click', (event) => { if (event.target === howToUseModal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && howToUseModal.classList.contains('active')) closeModal(); });

        // --- Button Event Listeners ---
        visualizeBtn.addEventListener('click', () => { if (parseAndUpdateState(true)) { renderVisualization(); showMessage("Visualisation mise à jour", 1500); } });
        formatBtn.addEventListener('click', () => { if (currentJsonObject !== null) { saveState(); updateJsonInput(true); renderVisualization(); showMessage("JSON mis en forme", 1500); } else { showMessage("Impossible de mettre en forme : JSON invalide.", 2000); } });
        minifyBtn.addEventListener('click', () => { if (currentJsonObject !== null) { saveState(); updateJsonInput(false); renderVisualization(); showMessage("JSON minifié", 1500); } else { showMessage("Impossible de minifier : JSON invalide.", 2000); } });
        copyBtn.addEventListener('click', () => { if (!jsonInput.value) { showMessage('Rien à copier !', 1500); return; } navigator.clipboard.writeText(jsonInput.value).then(() => { showMessage('JSON copié !', 1500); }).catch(err => { showMessage('Échec de la copie.', 2500); console.error('Clipboard copy failed: ', err); }); });
        clearBtn.addEventListener('click', () => { saveState(); jsonInput.value = ''; currentJsonObject = null; jsonVisualizer.innerHTML = '<p class="text-gray-500 italic">Entrée effacée.</p>'; errorDisplay.textContent = ''; saveState(); showMessage('Entrée effacée.', 1500); });
        undoBtn.addEventListener('click', undo);
        redoBtn.addEventListener('click', redo);
        document.addEventListener('keydown', (e) => { if (e.ctrlKey || e.metaKey) { if (e.key === 'z') { e.preventDefault(); if (!undoBtn.disabled) undo(); } else if (e.key === 'y') { e.preventDefault(); if (!redoBtn.disabled) redo(); } } });

        // --- Initial Load ---
        document.addEventListener('DOMContentLoaded', () => { if (parseAndUpdateState(false)) { historyStack = []; redoStack = []; saveState(); renderVisualization(); } else { updateHistoryButtons(); } });
