document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const videoFile = document.getElementById('video-file');
    const srtFile = document.getElementById('srt-file');
    const videoPreview = document.getElementById('video-preview');
    const subtitleTrack = document.getElementById('subtitle-track');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const currentOffsetDisplay = document.getElementById('current-offset');
    const manualOffsetInput = document.getElementById('manual-offset');
    const downloadBtn = document.getElementById('download-btn');
    const shiftButtons = document.querySelectorAll('.btn-shift');
    const videoFileName = document.getElementById('video-file-name');
    const srtFileName = document.getElementById('srt-file-name');

    // State
    let srtData = []; // Array of {id, start (ms), end (ms), text}
    let currentOffset = 0; // in seconds
    let originalFileName = 'subtitles.srt';
    let videoObjectUrl = null;

    // --- File Handling ---

    videoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
            videoObjectUrl = URL.createObjectURL(file);
            videoPreview.src = videoObjectUrl;
            videoPreview.style.display = 'block';
            videoPlaceholder.style.display = 'none';
            videoFileName.textContent = file.name;
        }
    });

    srtFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            originalFileName = file.name;
            srtFileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                srtData = parseSRT(text);
                updatePreview();
                downloadBtn.disabled = false;
            };
            reader.readAsText(file);
        }
    });

    // --- Logic ---

    function parseSRT(text) {
        const pattern = /(\d+)\r?\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\r?\n([\s\S]*?)(?=\r?\n\r?\n|$)/g;
        const results = [];
        let match;
        while ((match = pattern.exec(text)) !== null) {
            results.push({
                id: match[1],
                start: timeToMs(match[2]),
                end: timeToMs(match[3]),
                text: match[4]
            });
        }
        return results;
    }

    function timeToMs(timeStr) {
        const [time, ms] = timeStr.split(',');
        const [h, m, s] = time.split(':').map(Number);
        return ((h * 3600) + (m * 60) + s) * 1000 + Number(ms);
    }

    function msToSrtTime(ms) {
        if (ms < 0) ms = 0;
        const date = new Date(ms);
        const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
        const m = String(date.getUTCMinutes()).padStart(2, '0');
        const s = String(date.getUTCSeconds()).padStart(2, '0');
        const mls = String(date.getUTCMilliseconds()).padStart(3, '0');
        return `${h}:${m}:${s},${mls}`;
    }

    function msToVttTime(ms) {
        if (ms < 0) ms = 0;
        const date = new Date(ms);
        const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
        const m = String(date.getUTCMinutes()).padStart(2, '0');
        const s = String(date.getUTCSeconds()).padStart(2, '0');
        const mls = String(date.getUTCMilliseconds()).padStart(3, '0');
        return `${h}:${m}:${s}.${mls}`; // WebVTT uses point instead of comma
    }

    function updatePreview() {
        if (srtData.length === 0) return;

        const offsetMs = currentOffset * 1000;
        let vttContent = "WEBVTT\n\n";

        srtData.forEach(sub => {
            const start = sub.start + offsetMs;
            const end = sub.end + offsetMs;
            if (end > 0) { // Only show subs that end after 0
                vttContent += `${msToVttTime(start)} --> ${msToVttTime(end)}\n${sub.text}\n\n`;
            }
        });

        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const url = URL.createObjectURL(blob);

        // Update track
        subtitleTrack.src = url;

        // Force track update
        if (videoPreview.textTracks[0]) {
            videoPreview.textTracks[0].mode = 'showing';
        }
    }

    function applyOffset(amount) {
        currentOffset += parseFloat(amount);
        // Round to 3 decimal places to avoid floating point errors
        currentOffset = Math.round(currentOffset * 1000) / 1000;

        // Update UI
        currentOffsetDisplay.textContent = (currentOffset > 0 ? '+' : '') + currentOffset.toFixed(3) + 's';
        manualOffsetInput.value = currentOffset;

        // Update Preview
        updatePreview();
    }

    // --- Controls ---

    shiftButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            applyOffset(btn.dataset.amount);
        });
    });

    manualOffsetInput.addEventListener('change', () => {
        const val = parseFloat(manualOffsetInput.value);
        if (!isNaN(val)) {
            currentOffset = val;
            currentOffsetDisplay.textContent = (currentOffset > 0 ? '+' : '') + currentOffset.toFixed(3) + 's';
            updatePreview();
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (srtData.length === 0) return;

        const offsetMs = currentOffset * 1000;
        let srtContent = "";

        srtData.forEach((sub, index) => {
            const start = sub.start + offsetMs;
            const end = sub.end + offsetMs;

            // Ensure we don't end up with negative timestamps unless user really wants that (usually cut off)
            // But for syncing, we just apply math.

            srtContent += `${index + 1}\n${msToSrtTime(start)} --> ${msToSrtTime(end)}\n${sub.text}\n\n`;
        });

        const blob = new Blob([srtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Create new filename: original_resync.srt
        const part = originalFileName.split('.');
        part.pop(); // remove extension
        const newName = `${part.join('.')}_fixed.srt`;

        a.href = url;
        a.download = newName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Only if video has focus or body has focus (not input)
        if (document.activeElement.tagName === 'INPUT') return;

        if (e.shiftKey) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                applyOffset(0.1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                applyOffset(-0.1);
            }
        }
    });
});
