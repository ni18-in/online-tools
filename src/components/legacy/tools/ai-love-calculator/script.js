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

        /**
         * Calculates a deterministic, happy love score based on names and ages.
         * @param {string} name1 - The first person's name.
         * @param {number} age1 - The first person's age.
         * @param {string} name2 - The second person's name.
         * @param {number} age2 - The second person's age.
         * @returns {number} The final love score, always between 70 and 100.
         */
        function calculateLoveScore(name1, age1, name2, age2) {
            // Guard against empty inputs
            if (!name1 || !name2 || !age1 || !age2) return 0;

            const name1Processed = name1.toLowerCase().replace(/\s/g, '');
            const name2Processed = name2.toLowerCase().replace(/\s/g, '');

            // Combine names for a base value
            const combinedNames = name1Processed + name2Processed;
            const nameValue = [...combinedNames].reduce((acc, char) => acc + char.charCodeAt(0), 0);

            // Use ages to create a seed
            const ageSeed = parseInt(age1) + parseInt(age2);

            // A "happier" deterministic formula that always produces high scores.
            // The result will always be between 70 and 100, ensuring a "happy" result.
            const score = 70 + ((nameValue + ageSeed) % 31); // (0-30) + 70 = 70-100

            return score;
        }


        /**
         * Gets the compatibility status and prediction based on the score.
         * @param {number} score - The love score.
         * @returns {object} An object with status and prediction strings.
         */
        function getCompatibilityDetails(score) {
            if (score >= 90) {
                return {
                    status: "Perfect Match 💑",
                    prediction: "Your future is full of roses and endless pizza dates!"
                };
            } else if (score >= 70) {
                return {
                    status: "Strong Connection 💕",
                    prediction: "You two complete each other’s memes. A match made in digital heaven."
                };
            } else if (score >= 50) {
                return {
                    status: "Average Match 🙂",
                    prediction: "There's potential here! A mix of some drama and some dhamaal."
                };
            } else if (score >= 30) {
                return {
                    status: "Tough Match 💔",
                    prediction: "This might require a lot of Netflix, patience, and maybe separate blankets."
                };
            } else {
                return {
                    status: "Oops! 🚫",
                    prediction: "The stars aren't aligned. Have you considered getting a dog instead?"
                };
            }
        }

        /**
         * Animates the score from 0 to the final score.
         * @param {number} finalScore - The target score to animate to.
         */
        function animateScore(finalScore) {
            let currentScore = 0;
            const interval = setInterval(() => {
                if (currentScore >= finalScore) {
                    clearInterval(interval);
                    // Ensure final score is exact
                    scoreText.textContent = `${finalScore}%`;
                } else {
                    currentScore++;
                    scoreText.textContent = `${currentScore}%`;
                }
            }, 20); // Adjust timing for faster/slower animation
        }
        
        // Event Listener for the Calculate Button
        calculateBtn.addEventListener('click', () => {
            // 1. Get and validate inputs
            const name1 = name1Input.value.trim();
            const age1 = parseInt(age1Input.value, 10);
            const name2 = name2Input.value.trim();
            const age2 = parseInt(age2Input.value, 10);

            if (!name1 || !name2 || !age1 || !age2) {
                errorMessage.textContent = 'Please fill in all fields! 🙏';
                return;
            }
            if (age1 <= 0 || age2 <= 0) {
                errorMessage.textContent = 'Age must be a positive number.';
                return;
            }
            errorMessage.textContent = '';
            shareFeedback.textContent = '';

            // 2. Calculate score and get details
            const score = calculateLoveScore(name1, age1, name2, age2);
            const details = getCompatibilityDetails(score);

            // 3. Update the UI
            // Reset animation for re-calculation
            resultSection.classList.add('hidden');
            progressBar.classList.remove('progress-bar-animated');
            // We need a small delay to allow the browser to apply the style changes
            setTimeout(() => {
                // Set the custom property for the progress bar width
                progressBar.style.setProperty('--progress-width', `${score}%`);
                progressBar.classList.add('progress-bar-animated');
                
                animateScore(score);
                compatibilityStatus.textContent = details.status;
                futurePrediction.textContent = details.prediction;

                resultSection.classList.remove('hidden');
                
                // Scroll to the result
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });

        // Event Listener for the Share Button
        shareBtn.addEventListener('click', () => {
            const score = scoreText.textContent;
            const status = compatibilityStatus.textContent;
            const textToCopy = `My love score is ${score}! The AI says it's a "${status}". Find out yours!`;
            
            // Create a temporary textarea to copy text
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                // Use execCommand as a fallback for iframe environments
                document.execCommand('copy');
                shareFeedback.textContent = 'Results copied to clipboard!';
            } catch (err) {
                shareFeedback.textContent = 'Could not copy results.';
                console.error('Fallback: Oops, unable to copy', err);
            }
            
            document.body.removeChild(textArea);

            // Hide the feedback message after a few seconds
            setTimeout(() => {
                shareFeedback.textContent = '';
            }, 3000);
        });
