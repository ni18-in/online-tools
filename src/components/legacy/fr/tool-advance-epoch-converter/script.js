// --- State ---
        let clockRunning = true;
        let clockInterval;

        // --- DOM Elements ---
        const els = {
            themeBtn: document.getElementById('theme-btn'),
            currentEpoch: document.getElementById('current-epoch'),
            currentUtc: document.getElementById('current-utc'),
            currentLocal: document.getElementById('current-local'),
            pauseBtn: document.getElementById('pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            mainInput: document.getElementById('main-input'),
            convertBtn: document.getElementById('convert-btn'),
            precisionRadios: document.querySelectorAll('input[name="precision"]'),
            errorMsg: document.getElementById('error-msg'),
            resultArea: document.getElementById('result-area'),
            resSeconds: document.getElementById('res-seconds'),
            resMs: document.getElementById('res-ms'),
            resUtc: document.getElementById('res-utc'),
            resLocal: document.getElementById('res-local'),
            resIso: document.getElementById('res-iso'),
            resRelative: document.getElementById('res-relative'),
            resDetails: document.getElementById('res-details'),
            tzSelect: document.getElementById('tz-select'),
            resTzConverted: document.getElementById('res-tz-converted'),
            developerCodes: {
                js: document.getElementById('code-js'),
                python: document.getElementById('code-python'),
                java: document.getElementById('code-java'),
                php: document.getElementById('code-php'),
                sql: document.getElementById('code-sql')
            }
        };

        let lastConvertedDate = new Date(); // Store for timezone conversions

        // --- Clock Functions ---
        function updateClock() {
            if (!clockRunning) return;
            const now = new Date();
            els.currentEpoch.textContent = Math.floor(now.getTime() / 1000);
            els.currentUtc.textContent = now.toUTCString();
            els.currentLocal.textContent = now.toLocaleString();
        }

        function toggleClock() {
            clockRunning = !clockRunning;
            els.pauseBtn.textContent = clockRunning ? "Pause" : "Resume";
            if (clockRunning) {
                updateClock();
            }
        }

        // --- Core Converter Logic ---
        function processInput() {
            const val = els.mainInput.value.trim();
            const precision = document.querySelector('input[name="precision"]:checked').value;

            els.errorMsg.style.display = 'none';
            els.resultArea.classList.remove('visible');

            if (!val) return;

            let dateObj;
            let isTimestamp = /^\d+(\.\d+)?$/.test(val);

            try {
                if (isTimestamp) {
                    let num = parseFloat(val);
                    /* 
                       Logic for precision:
                       JS Date works with milliseconds.
                       If input is Seconds -> * 1000
                       If input is Milliseconds -> * 1
                       If input is Microseconds -> / 1000
                       If input is Nanoseconds -> / 1000000
                    */
                    let msValue = num;
                    if (precision === 'seconds') msValue = num * 1000;
                    else if (precision === 'microseconds') msValue = num / 1000;
                    else if (precision === 'nanoseconds') msValue = num / 1000000;

                    dateObj = new Date(msValue);
                } else {
                    // Try parsing date string
                    const parsed = Date.parse(val);
                    if (isNaN(parsed)) throw new Error("Invalid date format");
                    dateObj = new Date(parsed);
                }

                if (isNaN(dateObj.getTime())) throw new Error("Invalid date");

                displayResults(dateObj);
            } catch (e) {
                els.errorMsg.textContent = "Oops! Could not parse that. Try a standard format like '2024-01-01' or a numeric timestamp.";
                els.errorMsg.style.display = 'block';
            }
        }

        function displayResults(date) {
            lastConvertedDate = date;

            // Format timestamps
            const ms = date.getTime();
            const s = Math.floor(ms / 1000);

            els.resSeconds.textContent = s;
            els.resMs.textContent = ms;
            els.resUtc.textContent = date.toUTCString();
            els.resLocal.textContent = date.toString();
            els.resIso.textContent = date.toISOString();

            // Relative time (Simple implementation)
            const now = new Date();
            const diffSeconds = Math.floor((now - date) / 1000);
            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

            if (Math.abs(diffSeconds) < 60) els.resRelative.textContent = rtf.format(-diffSeconds, 'second');
            else if (Math.abs(diffSeconds) < 3600) els.resRelative.textContent = rtf.format(-Math.floor(diffSeconds / 60), 'minute');
            else if (Math.abs(diffSeconds) < 86400) els.resRelative.textContent = rtf.format(-Math.floor(diffSeconds / 3600), 'hour');
            else if (Math.abs(diffSeconds) < 31536000) els.resRelative.textContent = rtf.format(-Math.floor(diffSeconds / 86400), 'day');
            else els.resRelative.textContent = rtf.format(-Math.floor(diffSeconds / 31536000), 'year');


            // Details: Leap Year, Day of Year
            const year = date.getFullYear();
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            const start = new Date(year, 0, 0);
            const diff = date - start;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            els.resDetails.textContent = `Leap Year: ${isLeap ? "Yes" : "No"} | Day of Year: ${dayOfYear}`;

            // Update Timezone
            updateTimezone();

            // Show results
            els.resultArea.classList.add('visible');
        }

        function updateTimezone() {
            if (!lastConvertedDate) return;
            const tz = els.tzSelect.value;
            try {
                els.resTzConverted.textContent = new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'long',
                    timeZone: tz
                }).format(lastConvertedDate);
            } catch (e) {
                els.resTzConverted.textContent = "Timezone conversion error";
            }
        }

        // --- copy to clipboard ---
        function copyToClipboard(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = `<svg class="icon" style="color:var(--success-color)" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                }, 1500);
            });
        }

        // --- Event Listeners ---
        // Clock
        setInterval(updateClock, 1000);
        updateClock(); // Init
        els.pauseBtn.addEventListener('click', toggleClock);
        els.resetBtn.addEventListener('click', () => {
            clockRunning = true;
            els.pauseBtn.textContent = "Pause";
            updateClock();
            els.mainInput.value = "";
            els.errorMsg.style.display = 'none';
            els.resultArea.classList.remove('visible');
        });

        // Theme
        els.themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
        });

        // Conversion
        els.convertBtn.addEventListener('click', processInput);
        els.mainInput.addEventListener('input', () => {
            // Optional: Debounce this if it gets heavy, currently instantaneous
            processInput();
        });
        els.precisionRadios.forEach(radio => radio.addEventListener('change', processInput));

        // Timezone
        els.tzSelect.addEventListener('change', updateTimezone);

        // Copy
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const text = document.getElementById(targetId).textContent;
                copyToClipboard(text, btn);
            });
        });
