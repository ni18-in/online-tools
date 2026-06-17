// --- DOM Elements ---
        const fileInput = document.getElementById('file-input');
        const fileInputLabel = document.querySelector('.file-input-label');
        const fileInfoDiv = document.getElementById('file-info');
        const infoFilename = document.getElementById('info-filename');
        const infoOrigSize = document.getElementById('info-orig-size');
        const infoOrigDims = document.getElementById('info-orig-dims');

        const canvasContainer = document.getElementById('canvas-container'); // New
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const cropperImage = document.getElementById('cropper-image'); // New for Cropper.js
        const previewPlaceholder = document.getElementById('preview-placeholder');
        const imgDimensions = document.getElementById('img-dimensions');
        const toolButtons = document.querySelectorAll('.tool-button');
        const optionsPanelContainer = document.getElementById('options-panel-container');
        const optionsPlaceholder = document.getElementById('options-placeholder');
        const allOptionsSections = document.querySelectorAll('.options-section');
        const loadingOverlay = document.getElementById('loading-overlay');
        const messageBox = document.getElementById('message-box');
        const messageText = document.getElementById('message-text');

        // Header Buttons
        const resetAllBtn = document.getElementById('reset-all-btn');
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');

        // Resize Elements
        const resizeWidthInput = document.getElementById('resize-width');
        const resizeHeightInput = document.getElementById('resize-height');
        const resizeAspectRatioCheckbox = document.getElementById('resize-aspect-ratio');
        const applyResizeBtn = document.getElementById('apply-resize-btn');

        // Crop Elements
        const cropOptionsDiv = document.getElementById('options-crop');
        const applyCropBtn = document.getElementById('apply-crop-btn');
        const cancelCropBtn = document.getElementById('cancel-crop-btn');
        const cropAspectBtns = document.querySelectorAll('.crop-aspect-btn');

        // Rotate Elements
        const rotateLeftBtn = document.getElementById('rotate-left-btn');
        const rotateRightBtn = document.getElementById('rotate-right-btn');

        // Flip Elements
        const flipHorizontalBtn = document.getElementById('flip-horizontal-btn');
        const flipVerticalBtn = document.getElementById('flip-vertical-btn');

        // Adjust Elements
        const brightnessSlider = document.getElementById('brightness-slider');
        const contrastSlider = document.getElementById('contrast-slider');
        const saturationSlider = document.getElementById('saturation-slider');
        const grayscaleSlider = document.getElementById('grayscale-slider');
        const sepiaSlider = document.getElementById('sepia-slider');
        const blurSlider = document.getElementById('blur-slider');
        const brightnessValue = document.getElementById('brightness-value');
        const contrastValue = document.getElementById('contrast-value');
        const saturationValue = document.getElementById('saturation-value');
        const grayscaleValue = document.getElementById('grayscale-value');
        const sepiaValue = document.getElementById('sepia-value');
        const blurValue = document.getElementById('blur-value');
        const applyAdjustBtn = document.getElementById('apply-adjust-btn');
        const resetAdjustBtn = document.getElementById('reset-adjust-btn');

        // Border Elements
        const borderWidthInput = document.getElementById('border-width');
        const borderColorInput = document.getElementById('border-color');
        const applyBorderBtn = document.getElementById('apply-border-btn');

        // Text Tool Elements
        const textInput = document.getElementById('text-input');
        const textFontFamilySelect = document.getElementById('text-font-family');
        const textSizeInput = document.getElementById('text-size');
        const textBoldCheckbox = document.getElementById('text-bold');
        const textItalicCheckbox = document.getElementById('text-italic');
        const textColorInput = document.getElementById('text-color');
        const textAlignSelect = document.getElementById('text-align');
        const textRotationInput = document.getElementById('text-rotation');
        const textOpacitySlider = document.getElementById('text-opacity');
        const textOpacityValue = document.getElementById('text-opacity-value');
        const textXInput = document.getElementById('text-x');
        const textYInput = document.getElementById('text-y');
        const applyTextBtn = document.getElementById('apply-text-btn');

        // Export Panel Elements
        const exportPanel = document.getElementById('export-panel');
        const convertFormatSelect = document.getElementById('convert-format');
        const qualityOptionDiv = document.getElementById('quality-option');
        const convertQualitySlider = document.getElementById('convert-quality');
        const qualityValue = document.getElementById('quality-value');
        const webpOptionsDiv = document.getElementById('webp-options');
        const webpLosslessCheckbox = document.getElementById('webp-lossless');
        const downloadFilenameInput = document.getElementById('download-filename');
        const estimatedSizeSpan = document.getElementById('estimated-size');
        const downloadBtn = document.getElementById('download-btn');


        // --- State Variables ---
        let originalImage = null;
        let currentImage = null;
        let originalFileData = { name: null, size: 0 };
        let originalWidth = 0; let originalHeight = 0;
        let currentWidth = 0; let currentHeight = 0;
        let currentAspectRatio = 1;
        let activeTool = null;
        let isProcessing = false;
        let isHistoryNavigation = false;
        let debounceTimer = null;
        let cropperInstance = null;

        // History
        let historyStack = [];
        let historyIndex = -1;
        const MAX_HISTORY = 20;

        // --- Utility Functions ---
        function debounce(func, delay) { clearTimeout(debounceTimer); debounceTimer = setTimeout(func, delay); }
        function showLoading(show) { isProcessing = show; loadingOverlay.classList.toggle('show', show); }
        function showMessage(message, type = 'info', duration = 3000) {
            if (window.showToast) {
                window.showToast(message, duration);
            } else {
                messageText.textContent = message;
                messageBox.className = `show ${type}`;
                if (messageBox.timeoutId) clearTimeout(messageBox.timeoutId);
                messageBox.timeoutId = setTimeout(() => {
                    messageBox.classList.remove('show');
                    messageBox.timeoutId = null;
                }, duration);
            }
        }
        function formatBytes(bytes, decimals = 1) { if (!bytes || bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = (bytes > 0) ? Math.floor(Math.log(bytes) / Math.log(k)) : 0; return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; }

        // --- History Functions ---
        function updateHistoryButtons() { undoBtn.disabled = historyIndex <= 0; redoBtn.disabled = historyIndex >= historyStack.length - 1; }
        function pushHistoryState() {
            if (isHistoryNavigation || !currentImage) return;
            const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = currentWidth; tempCanvas.height = currentHeight;
            try {
                tempCtx.drawImage(currentImage, 0, 0, currentWidth, currentHeight);
                const dataUrl = tempCanvas.toDataURL('image/png');
                if (historyIndex < historyStack.length - 1) historyStack = historyStack.slice(0, historyIndex + 1);
                historyStack.push(dataUrl);
                if (historyStack.length > MAX_HISTORY) historyStack.shift();
                historyIndex = historyStack.length - 1;
            } catch (error) { console.error("Error generating data URL for history:", error); showMessage("Error al guardar el estado del historial.", "error"); return; }
            updateHistoryButtons();
        }
        function loadHistoryState(index) {
            if (index < 0 || index >= historyStack.length || isProcessing) return;
            isHistoryNavigation = true; showLoading(true);
            const dataUrl = historyStack[index]; const img = new Image();
            img.onload = () => {
                currentImage = img; currentWidth = img.naturalWidth; currentHeight = img.naturalHeight;
                currentAspectRatio = (currentHeight > 0) ? currentWidth / currentHeight : 1;
                historyIndex = index;
                if (cropperInstance) destroyCropper();
                drawCurrentImageToCanvas();
                updateEstimatedSize(); updateHistoryButtons(); showLoading(false); isHistoryNavigation = false;
                if (activeTool === 'adjust') resetAdjustmentSliders(false);
                if (activeTool === 'resize') { resizeWidthInput.value = currentWidth; resizeHeightInput.value = currentHeight; }
                drawCurrentImageToCanvas();
            };
            img.onerror = (err) => { console.error("Error loading history state image:", err); showMessage('Error al cargar el estado del historial.', 'error', 5000); showLoading(false); isHistoryNavigation = false; updateHistoryButtons(); };
            img.src = dataUrl;
        }

        function resetAppState() {
            if (cropperInstance) destroyCropper();
            originalImage = null; currentImage = null; originalFileData = { name: null, size: 0 };
            originalWidth = 0; originalHeight = 0; currentWidth = 0; currentHeight = 0;
            currentAspectRatio = 1; activeTool = null;
            historyStack = []; historyIndex = -1; updateHistoryButtons();
            infoFilename.textContent = 'N/D'; infoOrigSize.textContent = 'N/D'; infoOrigDims.textContent = 'N/D';
            imgDimensions.textContent = 'N/D'; estimatedSizeSpan.textContent = 'N/D';
            previewPlaceholder.style.display = 'block'; canvas.style.display = 'none'; cropperImage.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height); fileInput.value = null;
            hideAllOptionsPanels(); optionsPlaceholder.style.display = 'block';
            deactivateAllToolButtons(); exportPanel.classList.remove('active');
            resizeWidthInput.value = ''; resizeHeightInput.value = ''; resizeAspectRatioCheckbox.checked = true;
            resetAdjustmentSliders(false);
            borderWidthInput.value = 5; borderColorInput.value = '#000000';
            textInput.value = ''; textFontFamilySelect.value = 'Arial, sans-serif'; textSizeInput.value = 30;
            textBoldCheckbox.checked = false; textItalicCheckbox.checked = false; textColorInput.value = '#ffffff';
            textAlignSelect.value = 'left'; textRotationInput.value = 0;
            textOpacitySlider.value = 0.7; textOpacityValue.textContent = '0.7';
            textXInput.value = 10; textYInput.value = 10;
            convertFormatSelect.value = 'image/png'; convertQualitySlider.value = 92; qualityValue.textContent = '92';
            downloadFilenameInput.value = 'imagen-editada'; qualityOptionDiv.classList.add('hidden'); webpOptionsDiv.classList.add('hidden');
            showLoading(false);
        }

        function updateImageDetails(width, height) {
            if (activeTool !== 'crop') {
                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width; canvas.height = height;
                }
            }
            imgDimensions.textContent = `${width} x ${height} px`;
        }

        // --- Cropper.js Functions ---
        function initializeCropper() {
            if (!currentImage || cropperInstance) return;
            console.log("Initializing Cropper");
            cropperImage.src = currentImage.src;
            canvas.style.display = 'none';
            cropperImage.style.display = 'block';
            cropperInstance = new Cropper(cropperImage, {
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 0.8,
                background: false,
            });
            setCropperAspectRatio('free');
        }

        function destroyCropper() {
            if (cropperInstance) {
                console.log("Destroying Cropper");
                cropperInstance.destroy();
                cropperInstance = null;
                cropperImage.style.display = 'none';
                canvas.style.display = 'block';
                if (currentImage) drawCurrentImageToCanvas();
            }
        }

        function setCropperAspectRatio(ratio) {
            if (!cropperInstance) return;
            let aspectRatio;
            if (ratio === 'free') aspectRatio = NaN;
            else if (ratio === 'orig') aspectRatio = currentAspectRatio;
            else {
                const parts = ratio.split('/');
                aspectRatio = parseFloat(parts[0]) / parseFloat(parts[1]);
            }
            cropperInstance.setAspectRatio(aspectRatio);
        }


        // --- Core Drawing and State Update ---
        function drawCurrentImageToCanvas() {
            if (cropperInstance) return;
            if (!currentImage) { console.warn("drawCurrentImageToCanvas called with no currentImage."); return; }
            updateImageDetails(currentWidth, currentHeight);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = 'none'; ctx.globalAlpha = 1.0; ctx.strokeStyle = 'transparent';
            let filters = 'none';
            if (activeTool === 'adjust') { filters = [`brightness(${brightnessSlider.value}%)`, `contrast(${contrastSlider.value}%)`, `saturate(${saturationSlider.value}%)`, `grayscale(${grayscaleSlider.value}%)`, `sepia(${sepiaSlider.value}%)`, `blur(${blurSlider.value}px)`].join(' '); }
            ctx.filter = filters;
            try { ctx.drawImage(currentImage, 0, 0, currentWidth, currentHeight); }
            catch (e) { console.error("Error drawing image:", e); showMessage("Error al mostrar la vista previa.", "error", 5000); previewPlaceholder.style.display = 'block'; canvas.style.display = 'none'; showLoading(false); return; }
            ctx.filter = 'none';
            if (activeTool === 'border') {
                const borderWidth = parseInt(borderWidthInput.value, 10);
                if (!isNaN(borderWidth) && borderWidth > 0) { ctx.strokeStyle = borderColorInput.value; ctx.lineWidth = borderWidth; ctx.strokeRect(borderWidth / 2, borderWidth / 2, currentWidth - borderWidth, currentHeight - borderWidth); }
            }
            if (activeTool === 'text') { const text = textInput.value; if (text) drawText(ctx, text, currentWidth, currentHeight); }
            previewPlaceholder.style.display = 'none'; canvas.style.display = 'block';
        }

        function updateCurrentImageFromDataURL(dataUrl, callback) {
            if (cropperInstance) destroyCropper();
            showLoading(true);
            const img = new Image();
            img.onload = () => {
                currentImage = img; currentWidth = img.naturalWidth; currentHeight = img.naturalHeight;
                currentAspectRatio = (currentHeight > 0) ? currentWidth / currentHeight : 1;
                drawCurrentImageToCanvas();
                pushHistoryState();
                updateEstimatedSize(); showLoading(false);
                if (callback) callback();
            };
            img.onerror = (err) => { console.error("Error loading image object:", err); showMessage('Error al procesar los cambios aplicados.', 'error', 5000); showLoading(false); };
            img.src = dataUrl;
        }


        // --- Event Handlers ---
        function handleFileSelect(file) {
            if (!file || !file.type.startsWith('image/')) { showMessage('Archivo de imagen no válido.', 'error'); return; }
            if (isProcessing) return;
            resetAppState(); showLoading(true);
            originalFileData = { name: file.name, size: file.size };
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                infoFilename.textContent = originalFileData.name; infoOrigSize.textContent = formatBytes(originalFileData.size);
                const img = new Image();
                img.onload = () => {
                    originalImage = img; currentImage = img;
                    originalWidth = img.naturalWidth; originalHeight = img.naturalHeight;
                    currentWidth = originalWidth; currentHeight = originalHeight;
                    currentAspectRatio = (currentHeight > 0) ? currentWidth / currentHeight : 1;
                    infoOrigDims.textContent = `${originalWidth} x ${originalHeight} px`;
                    drawCurrentImageToCanvas(); pushHistoryState();
                    showMessage('Imagen cargada.', 'success'); exportPanel.classList.add('active');
                    updateEstimatedSize(); showLoading(false);
                };
                img.onerror = (err) => { console.error("Error loading initial image object:", err); showMessage('No se pudo cargar la imagen.', 'error', 5000); resetAppState(); showLoading(false); };
                img.src = imageDataUrl;
            };
            reader.onerror = (err) => { console.error("FileReader error:", err); showMessage('Error al leer el archivo.', 'error', 5000); resetAppState(); showLoading(false); };
            reader.readAsDataURL(file);
        }
        fileInput.addEventListener('change', (e) => { if (e.target.files.length > 0) handleFileSelect(e.target.files[0]); });
        // Drag and Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => { fileInputLabel.addEventListener(eventName, preventDefaults, false); document.body.addEventListener(eventName, preventDefaults, false); });
        function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
        ['dragenter', 'dragover'].forEach(eventName => { fileInputLabel.addEventListener(eventName, () => fileInputLabel.classList.add('bg-slate-100', 'border-slate-400'), false); });
        ['dragleave', 'drop'].forEach(eventName => { fileInputLabel.addEventListener(eventName, () => fileInputLabel.classList.remove('bg-slate-100', 'border-slate-400'), false); });
        fileInputLabel.addEventListener('drop', (e) => { const dt = e.dataTransfer; const files = dt.files; if (files.length > 0) handleFileSelect(files[0]); }, false);
        // Reset Button
        resetAllBtn.addEventListener('click', resetAppState);
        // History Navigation
        undoBtn.addEventListener('click', () => { if (!undoBtn.disabled) loadHistoryState(historyIndex - 1); });
        redoBtn.addEventListener('click', () => { if (!redoBtn.disabled) loadHistoryState(historyIndex + 1); });

        // Tool Button Activation
        function deactivateAllToolButtons() { toolButtons.forEach(btn => btn.classList.remove('active')); }
        function hideAllOptionsPanels() { allOptionsSections.forEach(section => section.classList.remove('active')); optionsPlaceholder.style.display = 'block'; }
        toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!originalImage || isProcessing) return;
                const tool = button.dataset.tool;
                if (activeTool === 'crop' && tool !== 'crop' && cropperInstance) {
                    destroyCropper();
                }
                if (activeTool === 'text') canvas.classList.remove('text-tool-active');
                if (tool === activeTool) {
                    activeTool = null; deactivateAllToolButtons(); hideAllOptionsPanels();
                    drawCurrentImageToCanvas();
                    return;
                }
                deactivateAllToolButtons(); hideAllOptionsPanels();
                button.classList.add('active'); activeTool = tool;
                optionsPlaceholder.style.display = 'none';
                const optionsSection = document.getElementById(`options-${tool}`);
                if (optionsSection) {
                    optionsSection.classList.add('active');
                    if (tool === 'resize') {
                        resizeWidthInput.value = currentWidth; resizeHeightInput.value = currentHeight;
                        if (resizeWidthInput.value) updateResizePreview();
                    } else if (tool === 'crop') {
                        initializeCropper();
                    } else if (tool === 'border') {
                        updateBorderPreview();
                    } else if (tool === 'text') {
                        canvas.classList.add('text-tool-active');
                        updateTextPreview();
                    } else if (tool === 'adjust') {
                        updateAdjustmentPreview();
                    } else {
                        if (canvas.style.display === 'none') {
                            canvas.style.display = 'block';
                            cropperImage.style.display = 'none';
                            if (currentImage) drawCurrentImageToCanvas();
                        }
                    }
                } else {
                    console.warn(`Options panel for tool "${tool}" not found.`);
                    optionsPlaceholder.style.display = 'block'; activeTool = null;
                    if (canvas.style.display === 'none') {
                        canvas.style.display = 'block';
                        cropperImage.style.display = 'none';
                        if (currentImage) drawCurrentImageToCanvas();
                    }
                }
            });
        });

        // --- Tool Implementations ---

        // -- Resize --
        function updateResizePreview() { if (!currentImage || activeTool !== 'resize' || isProcessing) return; const newWidth = parseInt(resizeWidthInput.value, 10); const newHeight = parseInt(resizeHeightInput.value, 10); if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) { drawCurrentImageToCanvas(); return; } updateImageDetails(newWidth, newHeight); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.imageSmoothingQuality = 'high'; ctx.imageSmoothingEnabled = true; try { ctx.drawImage(currentImage, 0, 0, newWidth, newHeight); } catch (e) { console.error("Error drawing resize preview:", e); drawCurrentImageToCanvas(); } }
        resizeWidthInput.addEventListener('input', () => { if (resizeAspectRatioCheckbox.checked && currentAspectRatio > 0) { const newWidth = parseInt(resizeWidthInput.value, 10); if (!isNaN(newWidth) && newWidth > 0) resizeHeightInput.value = Math.round(newWidth / currentAspectRatio); else resizeHeightInput.value = ''; } debounce(updateResizePreview, 250); });
        resizeHeightInput.addEventListener('input', () => { if (resizeAspectRatioCheckbox.checked && currentAspectRatio > 0) { const newHeight = parseInt(resizeHeightInput.value, 10); if (!isNaN(newHeight) && newHeight > 0) resizeWidthInput.value = Math.round(newHeight * currentAspectRatio); else resizeWidthInput.value = ''; } debounce(updateResizePreview, 250); });
        resizeAspectRatioCheckbox.addEventListener('change', () => { if (resizeAspectRatioCheckbox.checked && currentAspectRatio > 0) { const newWidth = parseInt(resizeWidthInput.value, 10); if (!isNaN(newWidth) && newWidth > 0) { resizeHeightInput.value = Math.round(newWidth / currentAspectRatio); debounce(updateResizePreview, 250); } } });
        applyResizeBtn.addEventListener('click', () => { if (!currentImage || isProcessing) return; const newWidth = parseInt(resizeWidthInput.value, 10); const newHeight = parseInt(resizeHeightInput.value, 10); if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) { showMessage('Dimensiones no válidas.', 'error'); return; } if (newWidth === currentWidth && newHeight === currentHeight) { showMessage('Las dimensiones no han cambiado.', 'info'); return; } showLoading(true); const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d'); tempCanvas.width = newWidth; tempCanvas.height = newHeight; tempCtx.imageSmoothingQuality = 'high'; tempCtx.imageSmoothingEnabled = true; tempCtx.drawImage(currentImage, 0, 0, newWidth, newHeight); updateCurrentImageFromDataURL(tempCanvas.toDataURL('image/png'), () => showMessage('Redimensión aplicada.', 'success')); });

        // -- Crop (Using Cropper.js) --
        cropAspectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const ratio = btn.dataset.ratio;
                setCropperAspectRatio(ratio);
            });
        });
        applyCropBtn.addEventListener('click', () => {
            if (!cropperInstance || isProcessing) return;
            showLoading(true);
            try {
                const croppedCanvas = cropperInstance.getCroppedCanvas({});
                if (!croppedCanvas) {
                    throw new Error("Failed to get cropped canvas.");
                }
                updateCurrentImageFromDataURL(croppedCanvas.toDataURL('image/png'), () => {
                    showMessage('Recorte aplicado.', 'success');
                });
            } catch (error) {
                console.error("Error applying crop:", error);
                showMessage("Error al aplicar el recorte.", "error");
                showLoading(false);
            }
        });
        cancelCropBtn.addEventListener('click', () => {
            if (cropperInstance) {
                destroyCropper();
                activeTool = null;
                deactivateAllToolButtons();
                hideAllOptionsPanels();
            }
        });


        // -- Rotate --
        function applyRotation(degrees) { if (!currentImage || isProcessing) return; showLoading(true); setTimeout(() => { try { const rad = degrees * Math.PI / 180; const sin = Math.sin(rad); const cos = Math.cos(rad); const newWidth = Math.abs(currentWidth * cos) + Math.abs(currentHeight * sin); const newHeight = Math.abs(currentWidth * sin) + Math.abs(currentHeight * cos); const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d'); tempCanvas.width = Math.round(newWidth); tempCanvas.height = Math.round(newHeight); tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2); tempCtx.rotate(rad); tempCtx.drawImage(currentImage, -currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight); updateCurrentImageFromDataURL(tempCanvas.toDataURL('image/png'), () => showMessage(`Rotado ${degrees}°`, 'success')); } catch (error) { console.error("Error during rotation:", error); showMessage("Error en la rotación.", "error"); showLoading(false); } }, 10); }
        rotateLeftBtn.addEventListener('click', () => applyRotation(-90));
        rotateRightBtn.addEventListener('click', () => applyRotation(90));

        // -- Flip --
        function applyFlip(direction) { if (!currentImage || isProcessing) return; showLoading(true); setTimeout(() => { try { const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d'); tempCanvas.width = currentWidth; tempCanvas.height = currentHeight; tempCtx.translate(direction === 'horizontal' ? tempCanvas.width : 0, direction === 'vertical' ? tempCanvas.height : 0); tempCtx.scale(direction === 'horizontal' ? -1 : 1, direction === 'vertical' ? -1 : 1); tempCtx.drawImage(currentImage, 0, 0, currentWidth, currentHeight); updateCurrentImageFromDataURL(tempCanvas.toDataURL('image/png'), () => showMessage(`Volteado ${direction === 'horizontal' ? 'horizontalmente' : 'verticalmente'}`, 'success')); } catch (error) { console.error("Error during flip:", error); showMessage("Error al voltear.", "error"); showLoading(false); } }, 10); }
        flipHorizontalBtn.addEventListener('click', () => applyFlip('horizontal'));
        flipVerticalBtn.addEventListener('click', () => applyFlip('vertical'));


        // -- Adjustments --
        function updateAdjustmentPreview() { if (!currentImage || isProcessing || activeTool !== 'adjust') return; drawCurrentImageToCanvas(); }
        function resetAdjustmentSliders(redraw = true) { brightnessSlider.value = 100; contrastSlider.value = 100; saturationSlider.value = 100; grayscaleSlider.value = 0; sepiaSlider.value = 0; blurSlider.value = 0; brightnessValue.textContent = '100'; contrastValue.textContent = '100'; saturationValue.textContent = '100'; grayscaleValue.textContent = '0'; sepiaValue.textContent = '0'; blurValue.textContent = '0'; if (redraw && currentImage) drawCurrentImageToCanvas(); }
        [brightnessSlider, contrastSlider, saturationSlider, grayscaleSlider, sepiaSlider, blurSlider].forEach(slider => { slider.addEventListener('input', (e) => { const valueSpanId = `${e.target.id.split('-')[0]}-value`; document.getElementById(valueSpanId).textContent = e.target.value; debounce(updateAdjustmentPreview, 50); }); });
        applyAdjustBtn.addEventListener('click', () => { if (!currentImage || isProcessing) return; const currentFilters = [`brightness(${brightnessSlider.value}%)`, `contrast(${contrastSlider.value}%)`, `saturate(${saturationSlider.value}%)`, `grayscale(${grayscaleSlider.value}%)`, `sepia(${sepiaSlider.value}%)`, `blur(${blurSlider.value}px)`].join(' '); const isDefault = brightnessSlider.value == 100 && contrastSlider.value == 100 && saturationSlider.value == 100 && grayscaleSlider.value == 0 && sepiaSlider.value == 0 && blurSlider.value == 0; if (isDefault) { showMessage('No se aplicaron ajustes.', 'info'); return; } showLoading(true); const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d'); tempCanvas.width = currentWidth; tempCanvas.height = currentHeight; tempCtx.filter = currentFilters; tempCtx.drawImage(currentImage, 0, 0, currentWidth, currentHeight); updateCurrentImageFromDataURL(tempCanvas.toDataURL('image/png'), () => showMessage('Ajustes aplicados.', 'success')); });
        resetAdjustBtn.addEventListener('click', () => resetAdjustmentSliders(true));


        // -- Border --
        function updateBorderPreview() { if (!currentImage || isProcessing || activeTool !== 'border') return; drawCurrentImageToCanvas(); }
        [borderWidthInput, borderColorInput].forEach(input => { input.addEventListener('input', () => debounce(updateBorderPreview, 100)); });
        applyBorderBtn.addEventListener('click', () => { if (!currentImage || isProcessing) return; const borderWidth = parseInt(borderWidthInput.value, 10); const borderColor = borderColorInput.value; if (isNaN(borderWidth) || borderWidth < 0) { showMessage('Ancho de borde no válido.', 'error'); return; } if (borderWidth === 0) { showMessage('El ancho del borde es cero.', 'info'); return; } showLoading(true); const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d'); const newWidth = currentWidth + borderWidth * 2; const newHeight = currentHeight + borderWidth * 2; tempCanvas.width = newWidth; tempCanvas.height = newHeight; tempCtx.fillStyle = borderColor; tempCtx.fillRect(0, 0, newWidth, newHeight); tempCtx.drawImage(currentImage, borderWidth, borderWidth, currentWidth, currentHeight); updateCurrentImageFromDataURL(tempCanvas.toDataURL('image/png'), () => showMessage('Borde aplicado.', 'success')); });


        // -- Text Tool (Enhanced) --
        function drawText(targetCtx, text, canvasWidth, canvasHeight) {
            const lines = text.split('\n');
            if (!lines.length || !text) return;
            const fontSize = parseInt(textSizeInput.value, 10) || 30;
            const fontFamily = textFontFamilySelect.value || 'Arial, sans-serif';
            const isBold = textBoldCheckbox.checked;
            const isItalic = textItalicCheckbox.checked;
            const color = textColorInput.value;
            const opacity = parseFloat(textOpacitySlider.value) || 0.7;
            const align = textAlignSelect.value || 'left';
            const rotation = parseInt(textRotationInput.value, 10) || 0;
            const rotationRad = rotation * Math.PI / 180;
            const x = parseInt(textXInput.value, 10) || 0;
            const y = parseInt(textYInput.value, 10) || 0;
            let fontStyle = isItalic ? 'italic' : 'normal';
            let fontWeight = isBold ? 'bold' : 'normal';
            targetCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            targetCtx.fillStyle = color;
            targetCtx.globalAlpha = opacity;
            targetCtx.textAlign = align;
            targetCtx.textBaseline = 'top';
            const lineHeight = fontSize * 1.2;
            targetCtx.save();
            targetCtx.translate(x, y);
            targetCtx.rotate(rotationRad);
            for (let i = 0; i < lines.length; i++) {
                targetCtx.fillText(lines[i], 0, i * lineHeight);
            }
            targetCtx.restore();
            targetCtx.globalAlpha = 1.0;
        }

        function updateTextPreview() {
            if (!currentImage || isProcessing || activeTool !== 'text') return;
            drawCurrentImageToCanvas();
        }

        canvas.addEventListener('click', (e) => {
            if (activeTool !== 'text' || isProcessing || cropperInstance) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const canvasX = Math.round((e.clientX - rect.left) * scaleX);
            const canvasY = Math.round((e.clientY - rect.top) * scaleY);
            textXInput.value = canvasX;
            textYInput.value = canvasY;
            updateTextPreview();
        });

        textOpacitySlider.addEventListener('input', (e) => { textOpacityValue.textContent = parseFloat(e.target.value).toFixed(2); debounce(updateTextPreview, 100); });
        [textInput, textFontFamilySelect, textSizeInput, textBoldCheckbox, textItalicCheckbox,
            textColorInput, textAlignSelect, textRotationInput, textXInput, textYInput].forEach(input => {
                input.addEventListener('input', () => debounce(updateTextPreview, 100));
                input.addEventListener('change', () => debounce(updateTextPreview, 100));
            });

        applyTextBtn.addEventListener('click', () => {
            if (!currentImage || isProcessing) return;
            const text = textInput.value;
            if (!text) { showMessage('Ingresa texto para aplicar.', 'info'); return; }
            showLoading(true);
            const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = currentWidth; tempCanvas.height = currentHeight;
            tempCtx.drawImage(currentImage, 0, 0, currentWidth, currentHeight);
            drawText(tempCtx, text, currentWidth, currentHeight);
            updateCurrentImageFromDataURL(tempCanvas.toDataURL('image/png'), () => showMessage('Texto aplicado.', 'success'));
        });


        // -- Export / Download --
        function updateEstimatedSize() { if (!currentImage || isProcessing) { estimatedSizeSpan.textContent = 'N/D'; return; } setTimeout(() => { if (!currentImage) return; const format = convertFormatSelect.value; const quality = parseInt(convertQualitySlider.value, 10) / 100; let dataUrl; try { const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d'); tempCanvas.width = currentWidth; tempCanvas.height = currentHeight; tempCtx.drawImage(currentImage, 0, 0, currentWidth, currentHeight); if (format === 'image/png') dataUrl = tempCanvas.toDataURL('image/png'); else if (format === 'image/jpeg') dataUrl = tempCanvas.toDataURL('image/jpeg', quality); else if (format === 'image/webp') dataUrl = tempCanvas.toDataURL('image/webp', webpLosslessCheckbox.checked ? 1.0 : quality); else { estimatedSizeSpan.textContent = 'Error'; return; } const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1; const approxBytes = Math.ceil(base64Length * 0.75); estimatedSizeSpan.textContent = `~ ${formatBytes(approxBytes)}`; } catch (error) { console.error("Size estimation error:", error); estimatedSizeSpan.textContent = 'Error'; } }, 10); }
        convertFormatSelect.addEventListener('change', () => { const format = convertFormatSelect.value; const isLossy = format === 'image/jpeg' || (format === 'image/webp' && !webpLosslessCheckbox.checked); qualityOptionDiv.classList.toggle('hidden', !isLossy); webpOptionsDiv.classList.toggle('hidden', format !== 'image/webp'); debounce(updateEstimatedSize, 200); });
        webpLosslessCheckbox.addEventListener('change', () => { convertFormatSelect.dispatchEvent(new Event('change')); });
        convertQualitySlider.addEventListener('input', (e) => { qualityValue.textContent = e.target.value; debounce(updateEstimatedSize, 200); });
        downloadBtn.addEventListener('click', () => { if (!currentImage || isProcessing) { showMessage('No hay imagen para descargar.', 'info'); return; } const format = convertFormatSelect.value; const quality = parseInt(convertQualitySlider.value, 10) / 100; const filename = (downloadFilenameInput.value || 'imagen-editada').replace(/[^a-z0-9_\-.]/gi, '_'); let finalFilename = filename; let fileExtension = ''; let dataUrl; try { showLoading(true); const finalCanvas = document.createElement('canvas'); const finalCtx = finalCanvas.getContext('2d'); finalCanvas.width = currentWidth; finalCanvas.height = currentHeight; finalCtx.drawImage(currentImage, 0, 0, currentWidth, currentHeight); if (format === 'image/png') { dataUrl = finalCanvas.toDataURL('image/png'); fileExtension = '.png'; } else if (format === 'image/jpeg') { dataUrl = finalCanvas.toDataURL('image/jpeg', quality); fileExtension = '.jpg'; } else if (format === 'image/webp') { dataUrl = finalCanvas.toDataURL('image/webp', webpLosslessCheckbox.checked ? 1.0 : quality); fileExtension = '.webp'; } else { showMessage('Formato no compatible.', 'error'); showLoading(false); return; } if (!finalFilename.toLowerCase().endsWith(fileExtension)) finalFilename += fileExtension; const link = document.createElement('a'); link.href = dataUrl; link.download = finalFilename; document.body.appendChild(link); link.click(); document.body.removeChild(link); showMessage('Descarga iniciada.', 'success'); } catch (error) { console.error("Download Error:", error); showMessage(`Error al generar la imagen: ${error.message}`, 'error'); } finally { showLoading(false); } });

        // --- Initial Setup ---
        resetAppState();