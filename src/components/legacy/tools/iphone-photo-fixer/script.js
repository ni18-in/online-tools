document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const controlsArea = document.getElementById('controls-area');
    const fileListContainer = document.getElementById('file-list');
    const convertBtn = document.getElementById('convert-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const formatSelect = document.getElementById('format-select');

    // State
    let filesQueue = [];
    let processedBlobs = []; // Stores { name: "filename.jpg", blob: Blob }
    let isConverting = false;

    // --- Event Listeners ---

    // Drag & Drop
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
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset to allow re-selecting same files
    });

    convertBtn.addEventListener('click', startConversion);
    downloadAllBtn.addEventListener('click', downloadZip);

    // --- Logic ---

    function handleFiles(files) {
        if (!files || files.length === 0) return;

        controlsArea.classList.remove('hidden');
        downloadAllBtn.classList.add('hidden'); // Hide zip button if new files added

        Array.from(files).forEach(file => {
            // Check extension
            if (!file.name.toLowerCase().endsWith('.heic')) {
                // Determine if we should show error or just ignore. 
                // For simplicity, let's add it but mark as error in UI immediately or filter it.
                // Let's filter non-HEIC but alert user if none match.
                return;
            }

            const id = Math.random().toString(36).substr(2, 9);
            const fileObj = {
                id: id,
                file: file,
                status: 'pending' // pending, converting, done, error
            };

            filesQueue.push(fileObj);
            createFileElement(fileObj);

            // Enable convert button if disabled
            convertBtn.disabled = false;
            convertBtn.textContent = 'Start Conversion';
        });
    }

    function createFileElement(fileObj) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.id = `file-${fileObj.id}`;

        div.innerHTML = `
            <div class="file-info">
                <span class="file-name">${fileObj.file.name}</span>
                <div class="file-status">
                     <span class="status-badge status-pending">Pending</span>
                     <span class="size-info">(${(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
            </div>
            <div class="action-area">
                <!-- Can add individual download button later -->
            </div>
        `;

        fileListContainer.appendChild(div);
    }

    function updateFileStatus(id, status, text) {
        const el = document.getElementById(`file-${id}`);
        if (!el) return;

        const badge = el.querySelector('.status-badge');
        badge.className = `status-badge status-${status}`;
        badge.textContent = text || status;
    }

    async function startConversion() {
        if (isConverting) return;
        isConverting = true;
        convertBtn.disabled = true;
        downloadAllBtn.disabled = true;

        const targetFormat = formatSelect.value; // image/jpeg or image/png
        const pendingFiles = filesQueue.filter(f => f.status === 'pending');

        if (pendingFiles.length === 0) {
            isConverting = false;
            return;
        }

        convertBtn.textContent = `Converting...`;

        // Process sequentially to avoid memory crash
        for (const fileObj of pendingFiles) {
            updateFileStatus(fileObj.id, 'converting', 'Converting...');
            fileObj.status = 'converting';

            try {
                const blob = await convertHeicToFormat(fileObj.file, targetFormat);

                // Success
                fileObj.status = 'done';
                fileObj.resultBlob = blob;

                // Determine new filename
                const ext = targetFormat === 'image/jpeg' ? '.jpg' : '.png';
                const newName = fileObj.file.name.replace(/\.heic$/i, '') + ext;
                fileObj.resultName = newName;

                processedBlobs.push({ name: newName, blob: blob });

                updateFileStatus(fileObj.id, 'done', 'Converted');

                // Add individual download link (Optional, but user requested "Download All" preferred)
                // Let's keep UI clean as requested.

            } catch (err) {
                console.error(err);
                fileObj.status = 'error';
                updateFileStatus(fileObj.id, 'error', 'Failed');
            }
        }

        isConverting = false;
        convertBtn.textContent = 'Conversion Complete';

        if (processedBlobs.length > 0) {
            downloadAllBtn.classList.remove('hidden');
            downloadAllBtn.disabled = false;
        }
    }

    function convertHeicToFormat(file, format) {
        return new Promise((resolve, reject) => {
            heic2any({
                blob: file,
                toType: format,
                quality: 0.9 // High quality for JPG
            })
                .then(conversionResult => {
                    // heic2any returns a blob or array of blobs.
                    // Since we send one file, it should return one blob.
                    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                    resolve(blob);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    function downloadZip() {
        if (processedBlobs.length === 0) return;

        const zip = new JSZip();

        processedBlobs.forEach(item => {
            zip.file(item.name, item.blob);
        });

        downloadAllBtn.textContent = 'Zipping...';

        zip.generateAsync({ type: 'blob' })
            .then(function (content) {
                saveAs(content, 'converted_photos.zip');
                downloadAllBtn.textContent = 'Download All (ZIP)';
            });
    }
});
