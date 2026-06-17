// DOM Elements
        const settingsScreen = document.getElementById('settingsScreen');
        const gameScreen = document.getElementById('gameScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const startGameBtn = document.getElementById('startGameBtn');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const roundDisplay = document.getElementById('roundDisplay');
        const timerDisplay = document.getElementById('timerDisplay');
        const logoImg = document.getElementById('logoImg');
        const optionsContainer = document.getElementById('optionsContainer');
        const feedbackMessage = document.getElementById('feedbackMessage');
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        const finalScoreDisplay = document.getElementById('finalScoreDisplay');
        const playAgainBtn = document.getElementById('playAgainBtn');
        const shareScoreBtn = document.getElementById('shareScoreBtn');
        const highscoreList = document.getElementById('highscoreList');
        const highscoreSection = document.getElementById('highscoreSection');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const messageBox = document.getElementById('messageBox');
        const gameModeRadios = document.querySelectorAll('input[name="gameMode"]');
        const roundsGroup = document.getElementById('roundsGroup');
        const durationGroup = document.getElementById('durationGroup');
        const numRoundsInput = document.getElementById('numRounds');
        const sessionDurationSelect = document.getElementById('sessionDuration');
        const soundEffectsCheckbox = document.getElementById('soundEffects');
        const streamingModeTitle = document.getElementById('streamingModeTitle');
        const partyTimerGroup = document.getElementById('partyTimerGroup');
        const streamingTimerGroup = document.getElementById('streamingTimerGroup');
        const partyTimerInput = document.getElementById('partyTimer');
        const streamingTimerInput = document.getElementById('streamingTimer');
        const currentModeLabel = document.getElementById('currentModeLabel');
        const modeInstruction = document.getElementById('modeInstruction');

        // Modal elements
        const aboutModal = document.getElementById('aboutModal');
        const howToPlayModal = document.getElementById('howToPlayModal');
        const showAboutBtn = document.getElementById('showAboutBtn');
        const showHowToPlayBtn = document.getElementById('showHowToPlayBtn');
        const closeAboutModal = document.getElementById('closeAboutModal');
        const closeHowToPlayModal = document.getElementById('closeHowToPlayModal');


        // Game State
        let allQuestions = [];
        let currentQuestions = [];
        let currentQuestionIndex = 0;
        let score = 0;
        let totalRounds = 10;
        let gameMode = 'single';
        let difficulty = 'easy';
        let soundEffectsEnabled = true;
        let questionTimerInterval;
        let sessionTimerInterval;
        let streamingRevealInterval;
        let streamingNextInterval;
        let timeLeft = 0;
        let partyTimerDuration = 15;
        let streamingRevealDuration = 7;
        let audioCtx;

        // Constants for streaming mode
        const STREAMING_REVEAL_TIME = 7;
        const STREAMING_NEXT_DELAY = 3;

        // --- LOGO DATA (EXPANDED) ---
        const LOGO_DATA = [
            // Easy
            { brandName: 'Apple', logoUrl: './logo/apple.png', options: ['Apple', 'Microsoft', 'Google', 'Amazon'], difficulty: 'easy' },
            { brandName: 'Nike', logoUrl: './logo/nike.png', options: ['Adidas', 'Nike', 'Puma', 'Reebok'], difficulty: 'easy' },
            { brandName: 'Coca-Cola', logoUrl: './logo/coco-cola.png', options: ['Pepsi', 'Coca-Cola', 'Sprite', 'Fanta'], difficulty: 'easy' },
            { brandName: 'McDonalds', logoUrl: './logo/mcdonalds.png', options: ['Burger King', 'KFC', 'McDonalds', 'Subway'], difficulty: 'easy' },
            { brandName: 'Starbucks', logoUrl: './logo/starbucks.png', options: ['Dunkin', 'Starbucks', 'Costa Coffee', 'Tim Hortons'], difficulty: 'easy' },
            { brandName: 'Pepsi', logoUrl: './logo/pepsi.png', options: ['Coca-Cola', 'Dr Pepper', 'Pepsi', '7 Up'], difficulty: 'easy' },
            { brandName: 'YouTube', logoUrl: './logo/youtube.png', options: ['Vimeo', 'Dailymotion', 'Twitch', 'YouTube'], difficulty: 'easy' },
            { brandName: 'Visa', logoUrl: './logo/visa.png', options: ['Mastercard', 'Visa', 'American Express', 'Discover'], difficulty: 'easy' },
            { brandName: 'Target', logoUrl: './logo/target.png', options: ['Walmart', 'Kmart', 'Target', 'Costco'], difficulty: 'easy' },
            { brandName: 'Shell', logoUrl: './logo/shell.png', options: ['BP', 'ExxonMobil', 'Chevron', 'Shell'], difficulty: 'easy' },
            { brandName: 'Ford', logoUrl: './logo/ford.png', options: ['Chevrolet', 'Ford', 'Dodge', 'Toyota'], difficulty: 'easy' },
            { brandName: 'Disney', logoUrl: './logo/disney.png', options: ['Pixar', 'DreamWorks', 'Disney', 'Warner Bros.'], difficulty: 'easy' },
            { brandName: 'KFC', logoUrl: './logo/kfc.png', options: ['McDonalds', 'Burger King', 'Popeyes', 'KFC'], difficulty: 'easy' },
            { brandName: 'Lego', logoUrl: './logo/lego.png', options: ['Playmobil', 'Lego', 'Mattel', 'Hasbro'], difficulty: 'easy' },
            { brandName: 'Subway', logoUrl: './logo/subway.png', options: ['Quiznos', 'Jimmy Johns', 'Subway', 'Potbelly'], difficulty: 'easy' },

            // Medium
            { brandName: 'Amazon', logoUrl: './logo/amazon.png', options: ['eBay', 'Alibaba', 'Amazon', 'Walmart'], difficulty: 'medium' },
            { brandName: 'Google', logoUrl: './logo/google.png', options: ['Yahoo', 'Bing', 'DuckDuckGo', 'Google'], difficulty: 'medium' },
            { brandName: 'Microsoft', logoUrl: './logo/microsoft.png', options: ['Apple', 'Microsoft', 'IBM', 'Oracle'], difficulty: 'medium' },
            { brandName: 'BMW', logoUrl: './logo/bmw.png', options: ['Mercedes', 'Audi', 'BMW', 'Volkswagen'], difficulty: 'medium' },
            { brandName: 'Adidas', logoUrl: './logo/adidas.png', options: ['Nike', 'Puma', 'Under Armour', 'Adidas'], difficulty: 'medium' },
            { brandName: 'X (Twitter)', logoUrl: './logo/x.png', options: ['Facebook', 'Instagram', 'X (Twitter)', 'Snapchat'], difficulty: 'medium' },
            { brandName: 'Instagram', logoUrl: './logo/instagram.png', options: ['Snapchat', 'TikTok', 'Instagram', 'Pinterest'], difficulty: 'medium' },
            { brandName: 'Mastercard', logoUrl: './logo/mastercard.png', options: ['Visa', 'American Express', 'Mastercard', 'PayPal'], difficulty: 'medium' },
            { brandName: 'Honda', logoUrl: './logo/honda.png', options: ['Toyota', 'Nissan', 'Honda', 'Mazda'], difficulty: 'medium' },
            { brandName: 'Audi', logoUrl: './logo/audi.png', options: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'], difficulty: 'medium' },
            { brandName: 'HP (Hewlett-Packard)', logoUrl: './logo/hp.png', options: ['Dell', 'Lenovo', 'HP (Hewlett-Packard)', 'Acer'], difficulty: 'medium' },
            { brandName: 'PlayStation', logoUrl: './logo/playstation.png', options: ['Xbox', 'Nintendo', 'PlayStation', 'Sega'], difficulty: 'medium' },
            { brandName: 'Burger King', logoUrl: './logo/burger-king.png', options: ['McDonalds', 'Wendys', 'Burger King', 'KFC'], difficulty: 'medium' },
            { brandName: 'Puma', logoUrl: './logo/puma.png', options: ['Nike', 'Adidas', 'Reebok', 'Puma'], difficulty: 'medium' },
            { brandName: 'Red Bull', logoUrl: './logo/red-bull.png', options: ['Monster', 'Rockstar', 'Red Bull', 'Bang'], difficulty: 'medium' },

            // Hard
            { brandName: 'Facebook', logoUrl: './logo/facebook.png', options: ['Twitter', 'Instagram', 'LinkedIn', 'Facebook'], difficulty: 'hard' },
            { brandName: 'Toyota', logoUrl: './logo/toyota.png', options: ['Honda', 'Ford', 'Toyota', 'BMW'], difficulty: 'hard' },
            { brandName: 'Samsung', logoUrl: './logo/samsung.png', options: ['LG', 'Sony', 'Samsung', 'Panasonic'], difficulty: 'hard' },
            { brandName: 'Netflix', logoUrl: './logo/netflix.png', options: ['Hulu', 'Netflix', 'Amazon Prime Video', 'Disney+'], difficulty: 'hard' },
            { brandName: 'Intel', logoUrl: './logo/intel.png', options: ['AMD', 'Nvidia', 'Qualcomm', 'Intel'], difficulty: 'hard' },
            { brandName: 'Mercedes-Benz', logoUrl: './logo/mercedes-benz.png', options: ['BMW', 'Audi', 'Mercedes-Benz', 'Lexus'], difficulty: 'hard' },
            { brandName: 'Oracle', logoUrl: './logo/oracle.png', options: ['SAP', 'Microsoft', 'Oracle', 'IBM'], difficulty: 'hard' },
            { brandName: 'Adobe', logoUrl: './logo/adobe.png', options: ['Corel', 'Affinity', 'Adobe', 'Autodesk'], difficulty: 'hard' },
            { brandName: 'IBM', logoUrl: './logo/ibm.png', options: ['HP', 'Dell', 'IBM', 'Accenture'], difficulty: 'hard' },
            { brandName: 'SAP', logoUrl: './logo/sap.png', options: ['Oracle', 'Salesforce', 'SAP', 'Workday'], difficulty: 'hard' },
            { brandName: 'General Electric', logoUrl: './logo/general-electric.png', options: ['Siemens', 'Honeywell', 'General Electric', '3M'], difficulty: 'hard' },
            { brandName: 'Cisco', logoUrl: './logo/cisco.png', options: ['Juniper', 'Huawei', 'Cisco', 'Arista'], difficulty: 'hard' },
            { brandName: 'Volkswagen', logoUrl: './logo/volkswagen.png', options: ['Toyota', 'Ford', 'BMW', 'Volkswagen'], difficulty: 'hard' },
            { brandName: 'Chanel', logoUrl: './logo/chanel.png', options: ['Dior', 'Gucci', 'Chanel', 'Prada'], difficulty: 'hard' },
            { brandName: 'Rolex', logoUrl: './logo/rolex.png', options: ['Omega', 'Tag Heuer', 'Rolex', 'Cartier'], difficulty: 'hard' },

            // New Additions - Easy
            { brandName: 'Spotify', logoUrl: './logo/spotify.png', options: ['SoundCloud', 'Apple Music', 'Spotify', 'Deezer'], difficulty: 'easy' },
            { brandName: 'WhatsApp', logoUrl: './logo/whatsapp.png', options: ['Viber', 'Telegram', 'WhatsApp', 'WeChat'], difficulty: 'easy' },
            { brandName: 'Tesla', logoUrl: './logo/tesla.png', options: ['Rivian', 'Lucid', 'Tesla', 'Nio'], difficulty: 'easy' },
            { brandName: 'FedEx', logoUrl: './logo/fedex.png', options: ['UPS', 'DHL', 'FedEx', 'USPS'], difficulty: 'easy' },
            { brandName: '7-Eleven', logoUrl: './logo/7-eleven.png', options: ['Circle K', 'Wawa', '7-Eleven', 'Sheetz'], difficulty: 'easy' },

            // New Additions - Medium
            { brandName: 'Ferrari', logoUrl: './logo/ferrari.png', options: ['Lamborghini', 'Maserati', 'Ferrari', 'Bugatti'], difficulty: 'medium' },
            { brandName: 'Porsche', logoUrl: './logo/porsche.png', options: ['Ferrari', 'Audi', 'Porsche', 'Bentley'], difficulty: 'medium' },
            { brandName: 'Nikon', logoUrl: './logo/nikon.png', options: ['Canon', 'Sony', 'Nikon', 'Fujifilm'], difficulty: 'medium' },
            { brandName: 'Canon', logoUrl: './logo/canon.png', options: ['Nikon', 'Olympus', 'Canon', 'Panasonic'], difficulty: 'medium' },
            { brandName: 'Nintendo', logoUrl: './logo/nintendo.png', options: ['Sega', 'Sony', 'Nintendo', 'Xbox'], difficulty: 'medium' },

            // New Additions - Hard
            { brandName: 'Unilever', logoUrl: './logo/unilever.png', options: ['P&G', 'Nestle', 'Unilever', 'Kraft Heinz'], difficulty: 'hard' },
            { brandName: 'Nestlé', logoUrl: './logo/nestle.png', options: ['Danone', 'Mars', 'Nestlé', 'Mondelez'], difficulty: 'hard' },
            { brandName: 'Goldman Sachs', logoUrl: './logo/goldman-sachs.png', options: ['JP Morgan', 'Morgan Stanley', 'Goldman Sachs', 'Citi'], difficulty: 'hard' },
            { brandName: 'Hermès', logoUrl: './logo/hermes.png', options: ['Gucci', 'Louis Vuitton', 'Hermès', 'Prada'], difficulty: 'hard' },
            { brandName: 'Jaguar', logoUrl: './logo/jaguar.png', options: ['Land Rover', 'Aston Martin', 'Jaguar', 'Bentley'], difficulty: 'hard' }
        ];

        allQuestions = LOGO_DATA;

        // --- UTILITY FUNCTIONS ---
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
        }

        function shuffleArray(array) {
            // Fisher-Yates shuffle algorithm
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function showMessage(text, type = 'info', duration = 3000) {
            if (window.showToast) {
                window.showToast(text, duration);
            } else {
                messageBox.textContent = text;
                messageBox.className = 'message-box';
                messageBox.classList.add(type);
                messageBox.style.display = 'block';
                void messageBox.offsetWidth;
                messageBox.classList.add('visible');

                setTimeout(() => {
                    messageBox.classList.remove('visible');
                    setTimeout(() => {
                        messageBox.style.display = 'none';
                    }, 500);
                }, duration - 500 < 0 ? duration : duration - 500);
            }
        }

        function playSound(type) {
            if (!soundEffectsEnabled || !audioCtx) return;
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);

            oscillator.start(audioCtx.currentTime);

            let duration = 0.1;
            if (type === 'correct') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
                duration = 0.3;
            } else if (type === 'incorrect') {
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
                duration = 0.4;
            } else if (type === 'click') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
                duration = 0.1;
            }
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            oscillator.stop(audioCtx.currentTime + duration);
        }

        // --- MODAL HANDLING ---
        function openModal(modalElement) {
            if (modalElement) modalElement.style.display = "block";
        }
        function closeModal(modalElement) {
            if (modalElement) modalElement.style.display = "none";
        }

        showAboutBtn.addEventListener('click', () => openModal(aboutModal));
        showHowToPlayBtn.addEventListener('click', () => openModal(howToPlayModal));
        closeAboutModal.addEventListener('click', () => closeModal(aboutModal));
        closeHowToPlayModal.addEventListener('click', () => closeModal(howToPlayModal));

        // Close modal if user clicks outside of it
        window.addEventListener('click', (event) => {
            if (event.target == aboutModal) closeModal(aboutModal);
            if (event.target == howToPlayModal) closeModal(howToPlayModal);
        });


        // --- SETTINGS & INITIALIZATION ---
        function updateSettingsUI() {
            // Read values
            // Note: gameMode global variable should be updated here or in the listener? 
            // Better to update globals in the listener or at start of game, but for UI sync we might need it.
            // Let's rely on reading the DOM state for UI updates.
            const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;

            document.body.classList.remove('party-mode', 'streaming-mode');
            const isDarkModeActive = document.body.classList.contains('dark-mode');
            document.body.style.setProperty('--bg-color', isDarkModeActive ? 'var(--dark-bg)' : 'var(--light-bg)');
            document.body.style.setProperty('--text-color', isDarkModeActive ? 'var(--dark-text)' : 'var(--light-text)');

            streamingModeTitle.style.display = 'none';

            if (selectedMode === 'challenge') {
                roundsGroup.style.display = 'none';
                durationGroup.style.display = 'block';
                partyTimerGroup.style.display = 'none';
                streamingTimerGroup.style.display = 'none';
                scoreDisplay.style.display = 'flex';
                roundDisplay.style.display = 'none';
                optionsContainer.style.display = 'grid';
                timerDisplay.style.display = 'block';
            } else if (selectedMode === 'streaming') {
                document.body.classList.add('streaming-mode');
                streamingModeTitle.style.display = 'block';
                roundsGroup.style.display = 'none';
                durationGroup.style.display = 'none';
                partyTimerGroup.style.display = 'none';
                streamingTimerGroup.style.display = 'block';
                scoreDisplay.style.display = 'none';
                roundDisplay.style.display = 'none';
                optionsContainer.style.display = 'none';
                timerDisplay.style.display = 'block';
            } else { // Single or Party
                roundsGroup.style.display = 'block';
                durationGroup.style.display = 'none';
                partyTimerGroup.style.display = 'none';
                streamingTimerGroup.style.display = 'none';
                scoreDisplay.style.display = 'flex';
                roundDisplay.style.display = 'inline';
                optionsContainer.style.display = 'grid';
                if (selectedMode === 'single') {
                    timerDisplay.style.display = 'none';
                } else { // Party mode
                    document.body.classList.add('party-mode');
                    partyTimerGroup.style.display = 'block';
                    timerDisplay.style.display = 'block';
                }
            }
            // Update global gameMode if needed for immediate feedback, though startGame overrides it
            gameMode = selectedMode;
            updateModeInfo();
        }

        // Add listeners once
        gameModeRadios.forEach(radio => radio.addEventListener('change', updateSettingsUI));

        function preloadImages(questionsToPreload) {
            questionsToPreload.forEach(q => {
                const img = new Image();
                img.src = q.logoUrl;
            });
        }

        startGameBtn.addEventListener('click', () => {
            if (!audioCtx && soundEffectsEnabled) {
                try {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    console.warn("Web Audio API is not supported.", e);
                    soundEffectsEnabled = false;
                    soundEffectsCheckbox.checked = false;
                }
            }
            playSound('click');

            gameMode = document.querySelector('input[name="gameMode"]:checked').value;
            difficulty = document.querySelector('input[name="difficulty"]:checked').value;
            soundEffectsEnabled = soundEffectsCheckbox.checked;

            // Update timer configs
            partyTimerDuration = parseInt(partyTimerInput.value) || 15;
            streamingRevealDuration = parseInt(streamingTimerInput.value) || 7;

            let questionsByDifficulty = allQuestions.filter(q => q.difficulty === difficulty);
            if (questionsByDifficulty.length === 0) {
                showMessage(`No hay preguntas disponibles para la dificultad ${difficulty}. Intenta otra.`, 'warning');
                return;
            }

            currentQuestions = shuffleArray([...questionsByDifficulty]);

            if (gameMode === 'challenge') {
                totalRounds = currentQuestions.length;
                const durationMinutes = parseInt(sessionDurationSelect.value);
                timeLeft = durationMinutes * 60;
                startSessionTimer();
            } else if (gameMode === 'streaming') {
                totalRounds = currentQuestions.length;
            } else { // Single or Party
                totalRounds = parseInt(numRoundsInput.value);
                if (isNaN(totalRounds) || totalRounds <= 0 || totalRounds > 200) {
                    showMessage(`Por favor, introduce un número válido de rondas`, 'warning');
                    numRoundsInput.value = 10;
                    return;
                }

                // For Party Mode, we want infinite loop, but totalRounds acts as batch size
                // We don't need to limit if user wants more, but usually we slice for Single
                if (gameMode === 'single') {
                    if (totalRounds > currentQuestions.length) totalRounds = currentQuestions.length;
                    currentQuestions = currentQuestions.slice(0, totalRounds);
                } else if (gameMode === 'party') {
                    // Ensure batch size isn't larger than available questions (repeats handled by reshuffle later)
                    if (totalRounds > currentQuestions.length) totalRounds = currentQuestions.length;
                    currentQuestions = currentQuestions.slice(0, totalRounds);
                }
            }

            // Preload images
            preloadImages(currentQuestions);

            score = 0;
            currentQuestionIndex = 0;
            updateScoreDisplay();

            showScreen('gameScreen');
            updateSettingsUI();
            loadQuestion();
        });

        // --- GAME LOGIC ---
        function loadQuestion() {
            clearAllTimers();

            if (gameMode === 'streaming') {
                if (currentQuestions.length === 0) {
                    endGame();
                    return;
                }
                if (currentQuestionIndex >= currentQuestions.length) {
                    currentQuestionIndex = 0;
                }
            } else if (currentQuestionIndex >= currentQuestions.length || (gameMode !== 'challenge' && gameMode !== 'party' && currentQuestionIndex >= totalRounds)) {
                // Check if Party Mode ended batch is handled in revealAnswer, but here we can catch boundary
                if (gameMode === 'party') {
                    // Should have been handled by revealAnswer or needs restart
                    // But if we fall through here, safe to End or Restart?
                    // Let's assume revealAnswer handles the loop.
                } else {
                    endGame();
                    return;
                }
            }

            const question = currentQuestions[currentQuestionIndex];
            if (!question) {
                // If we are in party mode and question is missing (maybe index OOB), try to restart batch
                if (gameMode === 'party') {
                    // Fail-safe: restart batch
                    restartPartyBatch();
                    return;
                }
                endGame();
                return;
            }
            logoImg.src = question.logoUrl;
            feedbackMessage.style.display = 'none';
            feedbackMessage.className = 'feedback-message';
            nextQuestionBtn.style.display = 'none';

            if (gameMode === 'streaming') {
                optionsContainer.style.display = 'none';
                timerDisplay.textContent = `Revelando en: ${streamingRevealDuration}s`;
                timeLeft = streamingRevealDuration;
                streamingRevealInterval = setInterval(() => {
                    timeLeft--;
                    timerDisplay.textContent = `Revelando en: ${timeLeft}s`;
                    if (timeLeft <= 0) {
                        clearInterval(streamingRevealInterval);
                        revealAnswerAndLoadNextStreaming();
                    }
                }, 1000);
            } else {
                optionsContainer.style.display = 'grid';
                optionsContainer.innerHTML = '';
                const displayOptions = shuffleArray([...question.options]);
                displayOptions.forEach((option, index) => {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-option');
                    button.textContent = option;
                    button.dataset.option = option;
                    button.addEventListener('click', handleGuess);
                    button.dataset.key = String.fromCharCode(65 + index);
                    optionsContainer.appendChild(button);
                });
                updateRoundDisplay();
                if (gameMode === 'party' || gameMode === 'challenge') {
                    startQuestionTimer(gameMode === 'party' ? partyTimerDuration : 15);
                }
            }
        }

        function restartPartyBatch() {
            showMessage("Cargando más logotipos...", "success", 1000);
            let questionsByDifficulty = allQuestions.filter(q => q.difficulty === difficulty);
            currentQuestions = shuffleArray([...questionsByDifficulty]);
            let batchSize = parseInt(numRoundsInput.value) || 10;
            if (batchSize > questionsByDifficulty.length) batchSize = questionsByDifficulty.length;
            totalRounds = batchSize;
            currentQuestions = currentQuestions.slice(0, totalRounds);
            currentQuestionIndex = 0;
            loadQuestion();
        }

        updateModeInfo();


        function updateModeInfo() {
            let label = '';
            let instruction = '';
            switch (gameMode) {
                case 'single':
                    label = 'Un jugador';
                    instruction = 'Tómate tu tiempo y adivina el logotipo.';
                    break;
                case 'party':
                    label = 'Modo Fiesta';
                    instruction = `¡Adivina rápido! Tienes ${partyTimerDuration} segundos por logotipo.`;
                    break;
                case 'challenge':
                    label = 'Modo Desafío';
                    instruction = '¡Responde a tantos como puedas antes de que termine la sesión!';
                    break;
                case 'streaming':
                    label = 'Modo Streaming';
                    instruction = 'Relájate y observa cómo se revelan las respuestas.';
                    break;
            }
            if (currentModeLabel) currentModeLabel.textContent = label;
            if (modeInstruction) modeInstruction.textContent = instruction;
        }

        function revealAnswerAndLoadNextStreaming() {
            const question = currentQuestions[currentQuestionIndex];
            if (!question) { // Safety check
                loadQuestion(); // Try to load next or reset
                return;
            }
            feedbackMessage.textContent = `La respuesta es: ${question.brandName}`;
            feedbackMessage.className = 'feedback-message info';
            feedbackMessage.style.display = 'block';
            playSound('correct');

            timerDisplay.textContent = `Siguiente en: ${STREAMING_NEXT_DELAY}s`;
            timeLeft = STREAMING_NEXT_DELAY;
            streamingNextInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Siguiente en: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(streamingNextInterval);
                    currentQuestionIndex++;
                    loadQuestion();
                }
            }, 1000);
        }


        function updateScoreDisplay() {
            scoreDisplay.textContent = `Puntuación: ${score}`;
        }

        function updateRoundDisplay() {
            if (gameMode !== 'challenge' && gameMode !== 'streaming') {
                roundDisplay.textContent = `Ronda: ${currentQuestionIndex + 1}/${totalRounds}`;
            } else if (gameMode === 'challenge') {
                roundDisplay.textContent = `Pregunta: ${currentQuestionIndex + 1}`;
            }
        }

        function clearAllTimers() {
            clearInterval(questionTimerInterval);
            clearInterval(sessionTimerInterval);
            clearInterval(streamingRevealInterval);
            clearInterval(streamingNextInterval);
        }

        function startQuestionTimer(duration) {
            clearAllTimers();
            timeLeft = duration;
            timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
            questionTimerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(questionTimerInterval);
                    handleTimeout();
                }
            }, 1000);
        }

        function startSessionTimer() {
            clearAllTimers();
            timerDisplay.textContent = `Tiempo sesión: ${formatTime(timeLeft)}`;
            sessionTimerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = `Tiempo sesión: ${formatTime(timeLeft)}`;
                if (timeLeft <= 0) {
                    clearInterval(sessionTimerInterval);
                    if (gameScreen.classList.contains('active')) {
                        showMessage("¡Tiempo de la sesión terminado!", 'info');
                        endGame();
                    }
                }
            }, 1000);
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }


        function handleTimeout() {
            if (!currentQuestions[currentQuestionIndex]) return; // Safety check
            feedbackMessage.textContent = "¡Tiempo terminado! La respuesta correcta era: " + currentQuestions[currentQuestionIndex].brandName;
            feedbackMessage.className = 'feedback-message info';
            feedbackMessage.style.display = 'block';
            playSound('incorrect');
            revealAnswer(null);
        }

        function handleGuess(event) {
            clearInterval(questionTimerInterval);
            if (!currentQuestions[currentQuestionIndex]) return; // Safety check

            const selectedOption = event.target.dataset.option;
            const correctAnswer = currentQuestions[currentQuestionIndex].brandName;

            if (selectedOption === correctAnswer) {
                score++;
                feedbackMessage.textContent = '¡Correcto!';
                feedbackMessage.className = 'feedback-message correct';
                playSound('correct');
            } else {
                feedbackMessage.textContent = `Incorrecto. Respuesta correcta: ${correctAnswer}`;
                feedbackMessage.className = 'feedback-message incorrect';
                playSound('incorrect');
            }
            feedbackMessage.style.display = 'block';
            updateScoreDisplay();
            revealAnswer(selectedOption);
        }

        function revealAnswer(selectedOptionText) {
            if (!currentQuestions[currentQuestionIndex]) return; // Safety check
            const correctAnswer = currentQuestions[currentQuestionIndex].brandName;
            document.querySelectorAll('.btn-option').forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.option === correctAnswer) {
                    btn.classList.add('correct');
                } else if (btn.dataset.option === selectedOptionText && selectedOptionText !== correctAnswer) {
                    btn.classList.add('incorrect');
                }
            });

            if (gameMode === 'party') {
                // Party Mode Interstitial
                let interstitialTime = 4;
                timerDisplay.textContent = `Siguiente logotipo en: ${interstitialTime}s`;

                const partyNextInterval = setInterval(() => {
                    interstitialTime--;
                    timerDisplay.textContent = `Siguiente logotipo en: ${interstitialTime}s`;
                    if (interstitialTime <= 0) {
                        clearInterval(partyNextInterval);
                        currentQuestionIndex++;
                        if (currentQuestionIndex >= totalRounds) {
                            // Infinite Party Mode: Restart Batch
                            restartPartyBatch();
                        } else {
                            loadQuestion();
                        }
                    }
                }, 1000);
            } else if (gameMode === 'challenge' && timeLeft > 0) {
                setTimeout(() => {
                    currentQuestionIndex++;
                    loadQuestion();
                }, 2000);
            } else if (gameMode === 'single') {
                if (currentQuestionIndex < totalRounds - 1) {
                    nextQuestionBtn.textContent = 'Siguiente pregunta';
                    nextQuestionBtn.style.display = 'block';
                } else {
                    nextQuestionBtn.textContent = 'Mostrar resultados';
                    nextQuestionBtn.style.display = 'block';
                }
            } else if (gameMode === 'challenge' && timeLeft <= 0) {
                setTimeout(endGame, 2000);
            } else {
                setTimeout(endGame, 2000);
            }
        }

        nextQuestionBtn.addEventListener('click', () => {
            playSound('click');
            currentQuestionIndex++;
            if (currentQuestionIndex >= totalRounds && gameMode !== 'challenge') {
                endGame();
            } else {
                loadQuestion();
            }
        });

        function endGame() {
            clearAllTimers();
            showScreen('gameOverScreen');

            if (gameMode === 'streaming') {
                finalScoreDisplay.textContent = "Sesión de streaming finalizada. Selecciona 'Jugar de nuevo' para volver a los ajustes.";
                highscoreSection.style.display = 'none';
                shareScoreBtn.style.display = 'none';
            } else {
                highscoreSection.style.display = 'block';
                shareScoreBtn.style.display = 'inline-block';
                let resultText = `Conseguiste ${score} de ${currentQuestionIndex > 0 ? currentQuestionIndex : totalRounds} preguntas intentadas.`;
                if (gameMode !== 'challenge') {
                    resultText = `Conseguiste ${score} de ${totalRounds} rondas.`;
                }
                finalScoreDisplay.textContent = resultText;
                saveHighScore(score, gameMode, difficulty, gameMode === 'challenge' ? currentQuestionIndex : totalRounds);
                displayHighScores();
            }
        }

        // --- HIGH SCORES (localStorage) ---
        function saveHighScore(currentScore, mode, diff, questionsOrRounds) {
            if (mode === 'streaming') return;
            try {
                const highScores = JSON.parse(localStorage.getItem('guessLogoHighScores') || '[]');
                const scoreEntry = {
                    score: currentScore,
                    mode: mode,
                    difficulty: diff,
                    rounds: questionsOrRounds,
                    date: new Date().toLocaleDateString()
                };
                highScores.push(scoreEntry);
                highScores.sort((a, b) => b.score - a.score || b.rounds - a.rounds);
                highScores.splice(10);
                localStorage.setItem('guessLogoHighScores', JSON.stringify(highScores));
            } catch (e) {
                console.error("Could not save high score:", e);
            }
        }

        function displayHighScores() {
            if (gameMode === 'streaming' && gameOverScreen.classList.contains('active')) return;
            try {
                const highScores = JSON.parse(localStorage.getItem('guessLogoHighScores') || '[]');
                highscoreList.innerHTML = '';
                if (highScores.length === 0) {
                    highscoreList.innerHTML = '<li>¡Aún no hay puntuaciones altas!</li>';
                    return;
                }
                highScores.forEach(entry => {
                    const translatedMode = entry.mode === 'single' ? 'Un jugador' : entry.mode === 'party' ? 'Modo Fiesta' : 'Modo Desafío';
                    const translatedDiff = entry.difficulty === 'easy' ? 'Fácil' : entry.difficulty === 'medium' ? 'Medio' : 'Difícil';
                    const li = document.createElement('li');
                    li.textContent = `${entry.score}/${entry.rounds} (${translatedDiff}, ${translatedMode}) - ${entry.date}`;
                    highscoreList.appendChild(li);
                });
            } catch (e) {
                console.error("Could not display high scores:", e);
                highscoreList.innerHTML = '<li>Error al cargar las puntuaciones.</li>';
            }
        }

        playAgainBtn.addEventListener('click', () => {
            playSound('click');
            scoreDisplay.style.display = 'flex';
            roundDisplay.style.display = 'inline';
            optionsContainer.style.display = 'grid';
            highscoreSection.style.display = 'block';
            shareScoreBtn.style.display = 'inline-block';
            streamingModeTitle.style.display = 'none';

            showScreen('settingsScreen');
            document.getElementById('modeSingle').checked = true;
            updateSettingsUI();
        });

        shareScoreBtn.addEventListener('click', () => {
            playSound('click');
            const translatedMode = gameMode === 'single' ? 'Un jugador' : gameMode === 'party' ? 'Modo Fiesta' : gameMode === 'challenge' ? 'Modo Desafío' : 'Modo Streaming';
            const translatedDiff = difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil';
            const textToCopy = `¡He conseguido ${score} puntos en Adivina el Logotipo! (Modo: ${translatedMode}, Dificultad: ${translatedDiff}, Rondas/Preguntas: ${gameMode === 'challenge' ? currentQuestionIndex : totalRounds}). ¡Pruébalo!`;
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showMessage('¡Puntuación copiada al portapapeles!', 'success', 2000);
            } catch (err) {
                showMessage('Error al copiar la puntuación.', 'error', 2000);
            }
            document.body.removeChild(textArea);
        });

        // --- DARK MODE ---
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('guessLogoDarkMode', isDarkMode);
            darkModeToggle.textContent = isDarkMode ? '☀️' : '�';

            // CSS variables should handle the theme changes via :root and .dark-mode
            // Explicitly setting body styles here might be redundant but kept for safety
            document.body.style.setProperty('--bg-color', isDarkMode ? 'var(--dark-bg)' : 'var(--light-bg)');
            document.body.style.setProperty('--text-color', isDarkMode ? 'var(--dark-text)' : 'var(--light-text)');
            playSound('click');
        });

        function loadDarkModePreference() {
            const isDarkMode = localStorage.getItem('guessLogoDarkMode') === 'true';
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.textContent = '☀️';
            } else {
                document.body.classList.remove('dark-mode');
                darkModeToggle.textContent = '🌙';
            }
            document.body.style.setProperty('--bg-color', isDarkMode ? 'var(--dark-bg)' : 'var(--light-bg)');
            document.body.style.setProperty('--text-color', isDarkMode ? 'var(--dark-text)' : 'var(--light-text)');
        }

        // --- KEYBOARD INPUT ---
        document.addEventListener('keydown', (event) => {
            const isInteractiveScreen = gameScreen.classList.contains('active') ||
                settingsScreen.classList.contains('active') ||
                gameOverScreen.classList.contains('active');

            if (gameMode === 'streaming' && gameScreen.classList.contains('active')) return;
            if (!isInteractiveScreen) return;

            // Close modals with Escape key
            if (event.key === 'Escape') {
                if (aboutModal.style.display === 'block') closeModal(aboutModal);
                if (howToPlayModal.style.display === 'block') closeModal(howToPlayModal);
                return; // Prevent other key actions if a modal was closed
            }

            const key = event.key.toUpperCase();
            let buttonToClick = null;

            if (gameScreen.classList.contains('active') && optionsContainer.children.length > 0 && optionsContainer.style.display !== 'none') {
                if (key >= '1' && key <= '4') {
                    buttonToClick = optionsContainer.children[parseInt(key) - 1];
                } else if (key >= 'A' && key <= 'D') {
                    for (let i = 0; i < optionsContainer.children.length; i++) {
                        if (optionsContainer.children[i].dataset.key === key) {
                            buttonToClick = optionsContainer.children[i];
                            break;
                        }
                    }
                } else if ((key === 'ENTER' || key === ' ') && nextQuestionBtn.style.display !== 'none' && !nextQuestionBtn.disabled) {
                    buttonToClick = nextQuestionBtn;
                }
            }

            if ((key === 'ENTER' || key === ' ') && !buttonToClick) {
                if (settingsScreen.classList.contains('active') && startGameBtn.offsetParent !== null) {
                    buttonToClick = startGameBtn;
                } else if (gameOverScreen.classList.contains('active') && playAgainBtn.offsetParent !== null) {
                    buttonToClick = playAgainBtn;
                }
            }


            if (buttonToClick && !buttonToClick.disabled) {
                event.preventDefault();
                buttonToClick.click();
            }
        });


        // --- INITIAL LOAD ---
        window.addEventListener('load', () => {
            loadDarkModePreference();
            updateSettingsUI();
            showScreen('settingsScreen');
        });
