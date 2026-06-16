// DOM Element References
        const name1Input = document.getElementById('name1');
        const age1Input = document.getElementById('age1');
        const name2Input = document.getElementById('name2');
        const age2Input = document.getElementById('age2');
        const calculateBtn = document.getElementById('calculate-btn');
        const errorMessage = document.getElementById('error-message');
        const resultSection = document.getElementById('result-section');
        const progressBar = document.getElementById('progress-bar');
        const scoreText = document.getElementById('score-text');
        const compatibilityStatus = document.getElementById('compatibility-status');
        const futurePrediction = document.getElementById('future-prediction');
        const shareBtn = document.getElementById('share-btn');
        const shareFeedback = document.getElementById('share-feedback');

        function calculateLoveScore(name1, age1, name2, age2) {
            if (!name1 || !name2 || !age1 || !age2) return 0;
            const name1Processed = name1.toLowerCase().replace(/\s/g, '');
            const name2Processed = name2.toLowerCase().replace(/\s/g, '');
            const combinedNames = name1Processed + name2Processed;
            const nameValue = [...combinedNames].reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const ageSeed = parseInt(age1) + parseInt(age2);
            const score = 70 + ((nameValue + ageSeed) % 31);
            return score;
        }

        function getCompatibilityDetails(score) {
            if (score >= 90) {
                return {
                    status: "Pareja Perfecta 💑",
                    prediction: "¡Vuestro futuro está lleno de rosas y citas infinitas!"
                };
            } else if (score >= 70) {
                return {
                    status: "Conexión Fuerte 💕",
                    prediction: "Os completáis mutuamente. Una combinación hecha en el paraíso digital."
                };
            } else if (score >= 50) {
                return {
                    status: "Compatibilidad Media 🙂",
                    prediction: "¡Hay potencial! Una mezcla de algo de drama y mucha diversión."
                };
            } else if (score >= 30) {
                return {
                    status: "Compatibilidad Difícil 💔",
                    prediction: "Esto podría requerir mucha paciencia, Netflix y quizás mantas separadas."
                };
            } else {
                return {
                    status: "¡Ups! 🚫",
                    prediction: "Las estrellas no están alineadas. ¿Has pensado en adoptar un perrito?"
                };
            }
        }

        function animateScore(finalScore) {
            let currentScore = 0;
            const interval = setInterval(() => {
                if (currentScore >= finalScore) {
                    clearInterval(interval);
                    scoreText.textContent = `${finalScore}%`;
                } else {
                    currentScore++;
                    scoreText.textContent = `${currentScore}%`;
                }
            }, 20);
        }
        
        calculateBtn.addEventListener('click', () => {
            const name1 = name1Input.value.trim();
            const age1 = parseInt(age1Input.value, 10);
            const name2 = name2Input.value.trim();
            const age2 = parseInt(age2Input.value, 10);

            if (!name1 || !name2 || !age1 || !age2) {
                errorMessage.textContent = '¡Por favor, rellena todos los campos! 🙏';
                return;
            }
            if (age1 <= 0 || age2 <= 0) {
                errorMessage.textContent = 'La edad debe ser un número positivo.';
                return;
            }
            errorMessage.textContent = '';
            shareFeedback.textContent = '';

            const score = calculateLoveScore(name1, age1, name2, age2);
            const details = getCompatibilityDetails(score);

            resultSection.classList.add('hidden');
            progressBar.classList.remove('progress-bar-animated');
            setTimeout(() => {
                progressBar.style.setProperty('--progress-width', `${score}%`);
                progressBar.classList.add('progress-bar-animated');
                animateScore(score);
                compatibilityStatus.textContent = details.status;
                futurePrediction.textContent = details.prediction;
                resultSection.classList.remove('hidden');
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });

        shareBtn.addEventListener('click', () => {
            const score = scoreText.textContent;
            const status = compatibilityStatus.textContent;
            const textToCopy = `¡Mi puntuación de amor es ${score}! La IA dice que es «${status}». ¡Descubre la tuya!`;
            
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                shareFeedback.textContent = '¡Resultado copiado al portapapeles!';
            } catch (err) {
                shareFeedback.textContent = 'No se pudo copiar el resultado.';
                console.error('Fallback: Oops, unable to copy', err);
            }
            
            document.body.removeChild(textArea);
            setTimeout(() => { shareFeedback.textContent = ''; }, 3000);
        });
