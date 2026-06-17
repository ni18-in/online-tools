document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const viewerStage = document.getElementById('viewer-stage');
    const loadingSpinner = document.getElementById('loading-spinner');
    const canvasContainer = document.querySelector('.canvas-container');
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    
    // Control Buttons
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const rotateLeftBtn = document.getElementById('rotate-left-btn');
    const rotateRightBtn = document.getElementById('rotate-right-btn');
    const fitBtn = document.getElementById('fit-btn');
    const openNewBtn = document.getElementById('open-new-btn');
    
    // Sidebar Meta Elements
    const metaPlaceholder = document.getElementById('meta-placeholder');
    const metaList = document.getElementById('meta-list');
    const metaName = document.getElementById('meta-name');
    const metaSize = document.getElementById('meta-size');
    const metaDims = document.getElementById('meta-dims');
    const metaRatio = document.getElementById('meta-ratio');
    const metaFormat = document.getElementById('meta-format');
    
    // Export Elements
    const saveFormat = document.getElementById('save-format');
    const saveQuality = document.getElementById('save-quality');
    const qualityContainer = document.getElementById('quality-container');
    const qualityVal = document.getElementById('quality-val');
    const saveBtn = document.getElementById('save-btn');

    // State
    let currentImage = null; // Image object
    let originalFile = null; // Original File object
    let convertedBlob = null; // Converted PNG/JPEG Blob
    
    // Canvas View Parameters
    let zoom = 1.0;
    let rotation = 0; // 0, 90, 180, 270 degrees
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startDragX = 0;
    let startDragY = 0;

    // --- Event Listeners ---

    // Drag & Drop Setup
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
        fileInput.value = ''; // Reset
    });

    // Control Event Handlers
    zoomInBtn.addEventListener('click', () => adjustZoom(1.2));
    zoomOutBtn.addEventListener('click', () => adjustZoom(0.8));
    rotateLeftBtn.addEventListener('click', () => adjustRotation(-90));
    rotateRightBtn.addEventListener('click', () => adjustRotation(90));
    fitBtn.addEventListener('click', fitToViewport);
    openNewBtn.addEventListener('click', resetViewer);

    // Canvas Panning
    canvasContainer.addEventListener('mousedown', startPan);
    canvasContainer.addEventListener('mousemove', pan);
    window.addEventListener('mouseup', endPan);
    canvasContainer.addEventListener('wheel', handleScrollZoom);

    // Export Controls
    saveFormat.addEventListener('change', () => {
        if (saveFormat.value === 'image/jpeg') {
            qualityContainer.classList.remove('hidden');
        } else {
            qualityContainer.classList.add('hidden');
        }
    });

    saveQuality.addEventListener('input', () => {
        qualityVal.textContent = `${saveQuality.value}%`;
    });

    saveBtn.addEventListener('click', exportImage);

    // --- Logic ---

    async function processFile(file) {
        const ext = file.name.toLowerCase();
        if (!ext.endsWith('.heic') && !ext.endsWith('.heif')) {
            alert('Please select a valid HEIC or HEIF file.');
            return;
        }

        originalFile = file;
        resetViewerState();
        
        // Show spinner, hide dropzone and stage
        dropZone.classList.add('hidden');
        viewerStage.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        try {
            // Convert HEIC file using heic2any
            const conversionResult = await heic2any({
                blob: file,
                toType: 'image/png' // Decode to PNG internally for maximum preview accuracy
            });

            // heic2any returns a blob or array of blobs. Take the first one.
            convertedBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;

            const url = URL.createObjectURL(convertedBlob);
            
            // Load into Image object
            currentImage = new Image();
            currentImage.onload = () => {
                // Done loading
                loadingSpinner.classList.add('hidden');
                viewerStage.classList.remove('hidden');
                
                // Populate metadata
                displayMetadata();
                
                // Draw initial view
                fitToViewport();
                
                // Enable save controls
                saveBtn.disabled = false;
            };
            currentImage.onerror = () => {
                throw new Error('Image parsing failed.');
            };
            currentImage.src = url;

        } catch (err) {
            console.error(err);
            alert('Failed to load HEIC image. The file might be corrupted or unsupported.');
            resetViewer();
        }
    }

    function displayMetadata() {
        metaPlaceholder.classList.add('hidden');
        metaList.classList.remove('hidden');
        
        metaName.textContent = originalFile.name;
        
        // Format size
        const sizeMb = originalFile.size / 1024 / 1024;
        metaSize.textContent = sizeMb >= 1.0 
            ? `${sizeMb.toFixed(2)} MB` 
            : `${(originalFile.size / 1024).toFixed(1)} KB`;
            
        // Dimensions
        metaDims.textContent = `${currentImage.naturalWidth} x {naturalHeight} px`
            .replace('{naturalHeight}', currentImage.naturalHeight);
            
        // Ratio
        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const div = gcd(currentImage.naturalWidth, currentImage.naturalHeight);
        const wRatio = currentImage.naturalWidth / div;
        const hRatio = currentImage.naturalHeight / div;
        metaRatio.textContent = `${wRatio}:${hRatio} (${(currentImage.naturalWidth / currentImage.naturalHeight).toFixed(2)})`;
        
        metaFormat.textContent = originalFile.name.split('.').pop().toUpperCase();
    }

    function drawStage() {
        if (!currentImage) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        
        // 1. Move to the center of the canvas
        ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY);
        
        // 2. Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);
        
        // 3. Apply zoom scaling
        ctx.scale(zoom, zoom);
        
        // 4. Draw image centered
        const xOffset = -currentImage.naturalWidth / 2;
        const yOffset = -currentImage.naturalHeight / 2;
        ctx.drawImage(currentImage, xOffset, yOffset);

        ctx.restore();
    }

    function fitToViewport() {
        if (!currentImage) return;

        const containerW = canvasContainer.clientWidth - 48; // padding margin offset
        const containerH = canvasContainer.clientHeight - 48;
        
        // Swap dimensions if rotated 90 or 270 degrees
        const isRotated = rotation % 180 !== 0;
        const imgW = isRotated ? currentImage.naturalHeight : currentImage.naturalWidth;
        const imgH = isRotated ? currentImage.naturalWidth : currentImage.naturalHeight;
        
        // Calculate fit scale
        const scaleX = containerW / imgW;
        const scaleY = containerH / imgH;
        zoom = Math.min(scaleX, scaleY, 1.0); // Don't upscale past original resolution

        // Resize canvas elements to fit container dimensions
        canvas.width = containerW;
        canvas.height = containerH;
        
        // Reset offsets
        panX = 0;
        panY = 0;

        drawStage();
    }

    function adjustZoom(factor) {
        const nextZoom = zoom * factor;
        if (nextZoom > 0.05 && nextZoom < 10) {
            zoom = nextZoom;
            drawStage();
        }
    }

    function handleScrollZoom(e) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        adjustZoom(factor);
    }

    function adjustRotation(angle) {
        rotation = (rotation + angle + 360) % 360;
        // Fitting after rotation resets the canvas dimensions to match swap
        fitToViewport();
    }

    // --- Panning Handling ---
    function startPan(e) {
        if (!currentImage) return;
        isDragging = true;
        canvasContainer.style.cursor = 'grabbing';
        startDragX = e.clientX - panX;
        startDragY = e.clientY - panY;
    }

    function pan(e) {
        if (!isDragging) return;
        panX = e.clientX - startDragX;
        panY = e.clientY - startDragY;
        drawStage();
    }

    function endPan() {
        if (!isDragging) return;
        isDragging = false;
        canvasContainer.style.cursor = 'grab';
    }

    // --- Export Handler ---
    function exportImage() {
        if (!currentImage) return;

        // Create high-res canvas with final image properties
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');

        const isRotated = rotation % 180 !== 0;
        
        exportCanvas.width = isRotated ? currentImage.naturalHeight : currentImage.naturalWidth;
        exportCanvas.height = isRotated ? currentImage.naturalWidth : currentImage.naturalHeight;

        exportCtx.save();
        
        // Translate and Rotate around the center of the export canvas
        exportCtx.translate(exportCanvas.width / 2, exportCanvas.height / 2);
        exportCtx.rotate((rotation * Math.PI) / 180);
        
        // Draw at 1:1 scale
        exportCtx.drawImage(currentImage, -currentImage.naturalWidth / 2, -currentImage.naturalHeight / 2);
        exportCtx.restore();

        const format = saveFormat.value;
        const quality = parseFloat(saveQuality.value) / 100;

        const downloadExt = format === 'image/jpeg' ? 'jpg' : 'png';
        const downloadName = originalFile.name.replace(/\.heic$/i, '') + `_viewed.${downloadExt}`;

        exportCanvas.toBlob((blob) => {
            saveAs(blob, downloadName);
        }, format, format === 'image/jpeg' ? quality : undefined);
    }

    function resetViewerState() {
        zoom = 1.0;
        rotation = 0;
        panX = 0;
        panY = 0;
        currentImage = null;
        convertedBlob = null;
    }

    function resetViewer() {
        resetViewerState();
        
        saveBtn.disabled = true;
        metaPlaceholder.classList.remove('hidden');
        metaList.classList.add('hidden');
        viewerStage.classList.add('hidden');
        loadingSpinner.classList.add('hidden');
        dropZone.classList.remove('hidden');
    }
});
