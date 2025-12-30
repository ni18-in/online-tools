
document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const loadingSpinner = document.getElementById('loading-spinner');
    const convertBtn = document.getElementById('convert-btn');
    const statusMsg = document.getElementById('status-msg');
    const fileNameDisplay = document.getElementById('file-name');
    const fileDimsDisplay = document.getElementById('file-dims');
    const fileInfo = document.getElementById('file-info');
    const resizeOption = document.getElementById('resize-option');

    // State
    let currentFile = null;
    let originalImage = null;

    // --- Event Listeners ---

    // Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-brand-500', 'bg-brand-50', 'dark:bg-brand-900/20');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-brand-500', 'bg-brand-50', 'dark:bg-brand-900/20');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-brand-500', 'bg-brand-50', 'dark:bg-brand-900/20');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Convert Button
    convertBtn.addEventListener('click', async () => {
        if (!currentFile || !originalImage) return;
        
        setLoading(true);
        statusMsg.textContent = 'Generating VTF...';
        
        try {
            // Give UI a moment to update
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const vtfBlob = await generateVTF(originalImage, resizeOption.value);
            const vtfFilename = currentFile.name.replace(/\.[^/.]+$/, "") + ".vtf";
            
            downloadBlob(vtfBlob, vtfFilename);
            
            statusMsg.textContent = 'Conversion successful! Download started.';
            statusMsg.className = 'mt-3 text-center text-sm text-green-600 dark:text-green-400 font-medium';
        } catch (error) {
            console.error(error);
            statusMsg.textContent = 'Error: ' + error.message;
            statusMsg.className = 'mt-3 text-center text-sm text-red-600 dark:text-red-400 font-medium';
        } finally {
            setLoading(false);
        }
    });

    // --- Functions ---

    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file (PNG, JPG, WEBP).');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                
                // Update UI
                imagePreview.src = img.src;
                imagePreview.classList.remove('hidden');
                previewContainer.querySelector('p').classList.add('hidden');
                
                fileNameDisplay.textContent = file.name;
                fileDimsDisplay.textContent = `${img.width} x ${img.height}`;
                fileInfo.classList.remove('hidden');
                convertBtn.disabled = false;
                statusMsg.textContent = '';
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loadingSpinner.classList.remove('hidden');
            convertBtn.disabled = true;
        } else {
            loadingSpinner.classList.add('hidden');
            convertBtn.disabled = false;
        }
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.getElementById('download-link');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- VTF Generation Logic ---

    // Power of Two helper
    function isPowerOfTwo(x) {
        return (x & (x - 1)) === 0 && x !== 0;
    }

    function nearestPowerOfTwo(x) {
        return Math.pow(2, Math.round(Math.log(x) / Math.log(2)));
    }

    async function generateVTF(img, resizeMode) {
        // 1. Determine Dimensions
        let width = img.width;
        let height = img.height;

        if (resizeMode === 'nearest') {
            width = nearestPowerOfTwo(width);
            height = nearestPowerOfTwo(height);
            // Cap at 4096 (standard limit)
            width = Math.min(width, 4096);
            height = Math.min(height, 4096);
        } else if (resizeMode === 'stretch') {
            width = 512;
            height = 512;
        } else {
            // Check if already POT
            if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
                if (!confirm("Warning: Source Engine requires Power-of-Two dimensions (e.g. 256, 512). Your image is " + width + "x" + height + ". It may not load in-game. Continue?")) {
                    throw new Error("Cancelled by user.");
                }
            }
        }

        // 2. Render to Canvas to get RGBA data
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Flip Y for VTF? 
        // VTF data is usually stored top-to-bottom like standard images, 
        // but OpenGL coords are bottom-left. Source usually expects standard layout.
        // No flip needed usually for standard "diffuse" maps unless specific shader requirement.
        
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data; // Uint8ClampedArray: RGBA RGBA...

        // 3. Construct VTF Header (Version 7.2 - 80 bytes)
        // See: https://developer.valvesoftware.com/wiki/VTF_(Valve_Texture_Format)
        
        const headerSize = 80;
        const imageSize = width * height * 4; // RGBA8888 = 4 bytes per pixel
        const fileSize = headerSize + imageSize;
        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);

        let offset = 0;

        // Signature: "VTF\0" (0x00465456 little endian)
        view.setUint8(offset++, 0x56); // V
        view.setUint8(offset++, 0x54); // T
        view.setUint8(offset++, 0x46); // F
        view.setUint8(offset++, 0x00); // \0

        // Version: 7.2
        view.setUint32(offset, 7, true); offset += 4; // Version[0]
        view.setUint32(offset, 2, true); offset += 4; // Version[1]

        // Header Size: 80 bytes
        view.setUint32(offset, headerSize, true); offset += 4;

        // Width & Height
        view.setUint16(offset, width, true); offset += 2;
        view.setUint16(offset, height, true); offset += 2;

        // Flags
        // TEXTUREFLAGS_EIGHTBITALPHA (0x2000) | TEXTUREFLAGS_NOLOD (0x0200) ?
        // Common flags: 0x2000 (has alpha) is safe for RGBA8888. 
        // Let's use 0x2000 (TEXTUREFLAGS_EIGHTBITALPHA) = 1 << 13
        // Also 0x0001 (TEXTUREFLAGS_POINTSAMPLE) sometimes? No, use Trilinear 0x0002.
        // Let's stick to simple: 0x2000 (Has Alpha)
        const flags = 0x2000; 
        view.setUint32(offset, flags, true); offset += 4;

        // Frames (1)
        view.setUint16(offset, 1, true); offset += 2;

        // First Frame (0)
        view.setUint16(offset, 0, true); offset += 2;

        // Padding0 (4 bytes)
        offset += 4;

        // Reflectivity (float x 3) - Generic grey
        view.setFloat32(offset, 0.5, true); offset += 4;
        view.setFloat32(offset, 0.5, true); offset += 4;
        view.setFloat32(offset, 0.5, true); offset += 4;

        // Padding1 (4 bytes)
        offset += 4;

        // Bump Scale (float) - 1.0
        view.setFloat32(offset, 1.0, true); offset += 4;

        // Image Format
        // IMAGE_FORMAT_RGBA8888 = 13 (See VTFFormat.h enum)
        const IMAGE_FORMAT_RGBA8888 = 13;
        view.setUint32(offset, IMAGE_FORMAT_RGBA8888, true); offset += 4;

        // Mip Count (1 - No mipmaps for simple V1)
        view.setUint8(offset++, 1);

        // Low Res Image Format (IMAGE_FORMAT_NONE = -1 or similar? No, usually DXT1 for thumb)
        // If we say -1 (IMAGE_FORMAT_NONE), low res width/height must be 0?
        // Let's try IMAGE_FORMAT_NONE = -1 (0xFFFFFFFF)
        const IMAGE_FORMAT_NONE = 4294967295; // uint32 -1
        view.setUint32(offset, IMAGE_FORMAT_NONE, true); offset += 4;

        // Low Res Dimensions
        view.setUint8(offset++, 0); // Width
        view.setUint8(offset++, 0); // Height

        // Depth (1)
        view.setUint16(offset, 1, true); offset += 2;

        // Current Offset should be 80.
        // console.log("Header End Offset:", offset);

        // 4. Write Image Data
        // VTF RGBA8888 is R, G, B, A order (same as Canvas)
        
        const pixelData = new Uint8Array(buffer, headerSize);
        // Copy canvas data to buffer
        // Note: Canvas provides RGBA. VTF RGBA8888 expects RGBA.
        // Optimization: direct copy
        pixelData.set(data);

        // Return Blob
        return new Blob([buffer], { type: 'application/octet-stream' });
    }

});
