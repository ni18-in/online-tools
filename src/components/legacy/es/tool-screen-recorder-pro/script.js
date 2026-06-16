// DOM Elements
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('main section');
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const navUl = document.getElementById('navLinks');

        const startRecordingBtn = document.getElementById('startRecordingBtn');
        const pauseRecordingBtn = document.getElementById('pauseRecordingBtn');
        const resumeRecordingBtn = document.getElementById('resumeRecordingBtn');
        const stopRecordingBtn = document.getElementById('stopRecordingBtn');
        
        const recordAudioCheckbox = document.getElementById('recordAudio');
        const recordSystemAudioCheckbox = document.getElementById('recordSystemAudio');
        const recordMicrophoneCheckbox = document.getElementById('recordMicrophone');

        const recordingStatusDiv = document.querySelector('.recording-status');
        const timerDisplay = document.getElementById('timer');
        const previewVideo = document.getElementById('previewVideo');

        const downloadsList = document.getElementById('downloadsList');
        const noDownloadsMsg = document.getElementById('noDownloadsMsg');

        const customModal = document.getElementById('customModal');
        const modalTitleEl = document.getElementById('modalTitleEl');
        const modalMessageEl = document.getElementById('modalMessageEl');
        const modalConfirmBtn = document.getElementById('modalConfirmBtn');
        const modalCancelBtn = document.getElementById('modalCancelBtn');
        const snackbar = document.getElementById('snackbar');
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const themeIcon = themeToggleBtn.querySelector('.material-icons');


        // App State
        let mediaRecorder;
        let recordedChunks = [];
        let mediaStream;
        let audioStream; // For microphone
        let screenStream; // For screen capture (video and potentially system audio)
        let timerInterval;
        let secondsElapsed = 0;
        let currentModalConfirmCallback = null;
        let lastFocusedElement = null;

        // --- Navigation ---
        function showSection(targetId) {
            sections.forEach(section => {
                const isActive = section.id === targetId;
                section.classList.toggle('active', isActive);
                section.setAttribute('aria-hidden', !isActive);
                section.style.display = isActive ? 'block' : 'none';
                if (isActive) {
                    const heading = section.querySelector('h2');
                    if (heading) {
                        heading.setAttribute('tabindex', '-1'); 
                        heading.focus({ preventScroll: true }); // preventScroll optional
                    }
                }
            });
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${targetId}`;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            if (navUl.classList.contains('open')) {
                navUl.classList.remove('open');
                menuToggleBtn.querySelector('.material-icons').textContent = 'menu';
                menuToggleBtn.setAttribute('aria-expanded', 'false');
            }
             // window.scrollTo(0, 0); // Optional: if you want to scroll to top on section change
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                showSection(targetId);
                window.location.hash = targetId; // Update URL hash for history/linking
            });
        });
        
        menuToggleBtn.addEventListener('click', () => {
            const isExpanded = navUl.classList.toggle('open');
            menuToggleBtn.setAttribute('aria-expanded', isExpanded.toString());
            menuToggleBtn.querySelector('.material-icons').textContent = isExpanded ? 'close' : 'menu';
        });

        // --- Theme Toggle ---
        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.textContent = 'light_mode'; 
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                themeIcon.textContent = 'brightness_4'; 
                localStorage.setItem('theme', 'light');
            }
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
        
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
        applyTheme(savedTheme);
        prefersDarkScheme.addEventListener('change', e => { // Listen for OS theme changes
            if (!localStorage.getItem('theme')) { // Only if user hasn't explicitly set a theme
                 applyTheme(e.matches ? 'dark' : 'light');
            }
        });


        // --- Audio Checkbox Logic ---
        function updateAudioSubCheckboxes() {
            const isRecordAudioEnabled = recordAudioCheckbox.checked;
            recordSystemAudioCheckbox.disabled = !isRecordAudioEnabled;
            recordMicrophoneCheckbox.disabled = !isRecordAudioEnabled;

            // If master is unchecked, also uncheck subs
            if (!isRecordAudioEnabled) {
                recordSystemAudioCheckbox.checked = false;
                recordMicrophoneCheckbox.checked = false;
            }
        }
        recordAudioCheckbox.addEventListener('change', updateAudioSubCheckboxes);


        // --- Recording Logic ---
        async function startRecording() {
            recordedChunks = [];
            previewVideo.style.display = 'none'; 
            previewVideo.src = '';

            try {
                const shouldRecordSystemAudio = recordAudioCheckbox.checked && recordSystemAudioCheckbox.checked;
                const shouldRecordMicrophone = recordAudioCheckbox.checked && recordMicrophoneCheckbox.checked;

                const displayMediaOptions = {
                    video: { 
                        mediaSource: "screen", 
                        width: { ideal: 1920, max: 3840 }, 
                        height: { ideal: 1080, max: 2160 },
                        frameRate: { ideal: 30, max: 60 } 
                    },
                    // preferCurrentTab can cause issues if you want system audio from *other* tabs/apps
                    // preferCurrentTab: shouldRecordSystemAudio, 
                    systemAudio: shouldRecordSystemAudio ? 'include' : 'exclude',
                };
                
                // Fallback for browsers that don't support the 'systemAudio' constraint directly
                if (!('systemAudio' in navigator.mediaDevices.getSupportedConstraints()) && shouldRecordSystemAudio) {
                    displayMediaOptions.audio = true; 
                }


                screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

                audioStream = null; 
                if (shouldRecordMicrophone) {
                    try {
                        audioStream = await navigator.mediaDevices.getUserMedia({ 
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                sampleRate: 44100
                            }, 
                            video: false 
                        });
                    } catch (micError) {
                        console.warn("Microphone access denied or no microphone found:", micError);
                        showSnackbar("Mic access denied/not found. Recording without mic.", "warning");
                    }
                }
                
                const tracks = [...screenStream.getVideoTracks()];
                const screenAudioTracks = screenStream.getAudioTracks(); // System audio tracks

                if (audioStream) { 
                    tracks.push(...audioStream.getAudioTracks());
                }
                if (screenAudioTracks.length > 0 && shouldRecordSystemAudio) { // Only add if system audio was requested and captured
                    tracks.push(...screenAudioTracks);
                }
                
                const hasAudioTracks = tracks.some(track => track.kind === 'audio');
                if (recordAudioCheckbox.checked && !hasAudioTracks && (shouldRecordMicrophone || shouldRecordSystemAudio)) {
                     showSnackbar("No audio source captured despite selection. Recording video only.", "warning");
                }

                mediaStream = new MediaStream(tracks);

                screenStream.getVideoTracks()[0].onended = () => {
                    if (mediaRecorder && mediaRecorder.state !== "inactive") {
                        if (!stopRecordingBtn.disabled) { 
                            showSnackbar("Screen sharing stopped externally.", "info");
                            stopActualRecording(); 
                        }
                    }
                };
                
                const MimeTypesToTry = [
                    'video/webm; codecs="vp9, opus"',
                    'video/webm; codecs="vp8, opus"',
                    'video/webm; codecs="h264,opus"',
                    'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                    'video/webm', // Fallback generic webm
                    'video/mp4'   // Fallback generic mp4
                ];
                let selectedMimeType = '';
                for (const mimeType of MimeTypesToTry) {
                    if (MediaRecorder.isTypeSupported(mimeType)) {
                        selectedMimeType = mimeType;
                        break;
                    }
                }
                if (!selectedMimeType) {
                    showSnackbar("No suitable video MIME type found for recording.", "error");
                    resetRecordingState();
                    return;
                }
                console.log("Using MIME type:", selectedMimeType);

                mediaRecorder = new MediaRecorder(mediaStream, { 
                    mimeType: selectedMimeType,
                    videoBitsPerSecond : 2500000, 
                    audioBitsPerSecond : 128000, 
                });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const fileExtension = selectedMimeType.includes('mp4') ? 'mp4' : 'webm';
                    const blobPropertyBag = { type: selectedMimeType.split(';')[0] }; // e.g. 'video/webm' or 'video/mp4'
                    
                    const blob = new Blob(recordedChunks, blobPropertyBag);
                    const url = URL.createObjectURL(blob);
                    
                    previewVideo.src = url;
                    previewVideo.style.display = 'block';
                    
                    addRecordingToDownloads(url, `recording-${new Date().toISOString().replace(/[:.]/g, '-')}.${fileExtension}`);
                    
                    mediaStream.getTracks().forEach(track => track.stop());
                    // screenStream and audioStream tracks are part of mediaStream, so they are stopped too.
                    
                    resetRecordingState();
                    showSnackbar("Recording stopped and saved!", "success");
                };
                
                mediaRecorder.onerror = (event) => {
                    console.error("MediaRecorder error:", event.error);
                    showSnackbar(`Recording error: ${event.error.name}`, "error");
                    stopActualRecording(); 
                };

                mediaRecorder.start(1000); 
                updateUIAfterStart();
                startTimer();

            } catch (err) {
                console.error("Error starting recording:", err);
                if (err.name === "NotAllowedError" || err.message?.includes("Permission denied")) {
                    showSnackbar("Permission denied. Please allow screen/audio access.", "error");
                } else if (err.name === "NotFoundError") {
                    showSnackbar("No screen or audio source found. Check connections.", "error");
                } else if (err.name === "NotReadableError" || err.name === "AbortError") {
                     showSnackbar("Could not start recording. Source might be busy or unavailable.", "error");
                }
                else {
                    showSnackbar(`Error starting: ${err.name || 'Unknown error'}`, "error");
                }
                resetRecordingState();
            }
        }
        
        function updateButtonDisabledState(button, isDisabled) {
            button.disabled = isDisabled;
            button.setAttribute('aria-disabled', isDisabled.toString());
        }

        function updateUIAfterStart() {
            updateButtonDisabledState(startRecordingBtn, true);
            updateButtonDisabledState(pauseRecordingBtn, false);
            updateButtonDisabledState(resumeRecordingBtn, true);
            updateButtonDisabledState(stopRecordingBtn, false);

            recordAudioCheckbox.disabled = true;
            recordSystemAudioCheckbox.disabled = true;
            recordMicrophoneCheckbox.disabled = true;
            recordingStatusDiv.style.display = 'flex';
            previewVideo.style.display = 'none'; 
            previewVideo.src = '';
        }

        function pauseRecording() {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.pause();
                pauseTimer();
                updateButtonDisabledState(pauseRecordingBtn, true);
                updateButtonDisabledState(resumeRecordingBtn, false);
                showSnackbar("Recording paused", "info");
            }
        }

        function resumeRecording() {
            if (mediaRecorder && mediaRecorder.state === "paused") {
                mediaRecorder.resume();
                startTimer(); 
                updateButtonDisabledState(pauseRecordingBtn, false);
                updateButtonDisabledState(resumeRecordingBtn, true);
                showSnackbar("Recording resumed", "info");
            }
        }
        
        function stopActualRecording() {
            if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
                mediaRecorder.stop(); 
                stopTimer();
            } else { 
                resetRecordingState(); // If somehow called when not recording
            }
        }

        function confirmStopRecording() {
            if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
                showModal("Stop Recording", "Are you sure you want to stop? The recording will be saved.", () => {
                    stopActualRecording();
                });
            }
        }
        
        function resetRecordingState() {
            updateButtonDisabledState(startRecordingBtn, false);
            updateButtonDisabledState(pauseRecordingBtn, true);
            updateButtonDisabledState(resumeRecordingBtn, true);
            updateButtonDisabledState(stopRecordingBtn, true);

            recordAudioCheckbox.disabled = false;
            updateAudioSubCheckboxes(); // Re-evaluate sub-checkbox disabled state

            recordingStatusDiv.style.display = 'none';
            secondsElapsed = 0;
            timerDisplay.textContent = formatTime(0);
            mediaRecorder = null;
            mediaStream = null;
            screenStream = null;
            audioStream = null;
            recordedChunks = [];
        }

        // --- Timer ---
        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                secondsElapsed++;
                timerDisplay.textContent = formatTime(secondsElapsed);
            }, 1000);
        }

        function pauseTimer() {
            clearInterval(timerInterval);
        }

        function stopTimer() {
            clearInterval(timerInterval);
        }

        function formatTime(totalSeconds) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // --- Downloads List ---
        function addRecordingToDownloads(url, filename) {
            const listItem = document.createElement('li');
            
            const fileInfoSpan = document.createElement('span');
            fileInfoSpan.classList.add('file-info');
            fileInfoSpan.textContent = filename;

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.textContent = "Download";
            downloadLink.classList.add('btn-download'); 
            downloadLink.setAttribute('role', 'button');

            listItem.appendChild(fileInfoSpan);
            listItem.appendChild(downloadLink);
            downloadsList.prepend(listItem); 
            noDownloadsMsg.style.display = 'none';
        }

        // --- Modal ---
        function showModal(title, message, onConfirm) {
            lastFocusedElement = document.activeElement; 

            modalTitleEl.textContent = title;
            modalMessageEl.textContent = message;
            currentModalConfirmCallback = onConfirm;
            customModal.style.display = 'flex';
            modalConfirmBtn.focus(); 
        }

        function hideModal() {
            customModal.style.display = 'none';
            currentModalConfirmCallback = null;
            if (lastFocusedElement) {
                lastFocusedElement.focus(); 
            }
        }
        
        customModal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideModal();
            }
            if (event.key === 'Tab') {
                const focusableElements = Array.from(customModal.querySelectorAll('button:not([disabled])'));
                if (focusableElements.length === 0) return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { 
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { 
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        });

        modalConfirmBtn.addEventListener('click', () => {
            if (currentModalConfirmCallback) {
                currentModalConfirmCallback();
            }
            hideModal();
        });

        modalCancelBtn.addEventListener('click', hideModal);
        customModal.addEventListener('click', (event) => { // Close on backdrop click
            if (event.target === customModal) {
                hideModal();
            }
        });


        // --- Snackbar ---
        function showSnackbar(message, type = "info") { 
            snackbar.textContent = message;
            snackbar.className = 'show'; 
            
            snackbar.classList.remove('success', 'error', 'warning'); // Clear previous types
            let ariaLiveValue = 'polite';

            if (type === 'success') {
                snackbar.classList.add('success');
            } else if (type === 'error') {
                snackbar.classList.add('error');
                ariaLiveValue = 'assertive';
            } else if (type === 'warning') { // You might want specific styling for warning too
                snackbar.classList.add('warning'); // Add a .warning class if you want to style it via CSS
                // Example inline style for warning if no CSS class defined for it
                // snackbar.style.backgroundColor = 'var(--warning-container-color)';
                // snackbar.style.color = 'var(--on-warning-container-color)';
            }
            snackbar.setAttribute('aria-live', ariaLiveValue);

            setTimeout(() => { 
                snackbar.className = snackbar.className.replace("show", "");
                // snackbar.style.backgroundColor = ''; // Reset if inline style was used
                // snackbar.style.color = '';
            }, 3000);
        }
        
        // --- Event Listeners for Recording Buttons ---
        startRecordingBtn.addEventListener('click', startRecording);
        pauseRecordingBtn.addEventListener('click', pauseRecording);
        resumeRecordingBtn.addEventListener('click', resumeRecording);
        stopRecordingBtn.addEventListener('click', confirmStopRecording);


        // Initial Setup
        function init() {
            updateAudioSubCheckboxes(); // Set initial state of audio sub-checkboxes

            // Set initial aria-hidden attributes for sections
            const currentHash = window.location.hash.substring(1);
            const sectionToShow = sectionsNodeList.includes(document.getElementById(currentHash)) ? currentHash : 'home';
            
            showSection(sectionToShow); 
            resetRecordingState(); 

            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                showSnackbar("Screen Recording API not supported.", "error");
                updateButtonDisabledState(startRecordingBtn, true);
                document.querySelectorAll('.settings-group input, .button-group button:not(#startRecordingBtn)').forEach(el => updateButtonDisabledState(el, true));
                modalMessageEl.textContent = "Your browser does not support Screen Recording. Try Chrome, Firefox, or Edge.";
                modalTitleEl.textContent = "Unsupported Browser";
                modalConfirmBtn.style.display = 'none';
                modalCancelBtn.textContent = "Close";
                showModal(modalTitleEl.textContent, modalMessageEl.textContent, () => {}); // Empty confirm
                return; 
            }
            if (!window.MediaRecorder) {
                showSnackbar("MediaRecorder API not supported. Cannot record.", "error");
                updateButtonDisabledState(startRecordingBtn, true);
                document.querySelectorAll('.settings-group input, .button-group button:not(#startRecordingBtn)').forEach(el => updateButtonDisabledState(el, true));
                return;
            }
        }
        const sectionsNodeList = Array.from(sections);
        document.addEventListener('DOMContentLoaded', init);
