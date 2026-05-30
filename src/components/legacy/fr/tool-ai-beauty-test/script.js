// Wrap the entire script in a DOMContentLoaded listener for robustness
        document.addEventListener('DOMContentLoaded', function () {

            // --- Feature State Management ---
            const featureState = {
                // Reduced initial delays for quicker testing/demo
                scanner: { delay: 2500, intervalId: null, timeoutId: null, loaderTextId: 'scanner-loader-text', loaderId: 'scanner-loader', resultsId: 'scanner-results' },
                lookalike: { delay: 3000, intervalId: null, timeoutId: null, loaderTextId: 'lookalike-loader-text', loaderId: 'lookalike-loader', resultsId: 'lookalike-results' },
                analysis: { delay: 2000, intervalId: null, timeoutId: null, loaderTextId: 'analysis-loader-text', loaderId: 'analysis-loader', resultsId: 'analysis-results' },
                showdown: { delay: 3500, intervalId: null, timeoutId: null, loaderTextId: 'showdown-loader-text', loaderId: 'showdown-loader', resultsId: 'showdown-results' },
                'how-to-use': { resultsId: 'how-to-use' },
                about: { resultsId: 'about' },
                'why-choose': { resultsId: 'why-choose' }
            };
            const DELAY_INCREMENT = 500; // Smaller increment

            // --- Navigation ---
            // Use event delegation for potentially dynamic elements (though not strictly needed here)
            $(document).on('click', '.nav-btn', function () {
                const targetId = $(this).data('target');
                const $targetElement = $('#' + targetId);

                if (!$targetElement.length) return; // Exit if target doesn't exist

                // Hide all content sections (except 'why-choose' initially)
                $('.content-section').not('#why-choose').addClass('hidden');
                // Remove active styles from all buttons
                $('.nav-btn').removeClass('text-indigo-600 bg-indigo-100 font-semibold').addClass('text-gray-600 font-medium');

                // Show the target section
                $targetElement.removeClass('hidden');
                // Add active styles to the clicked button
                $(this).addClass('text-indigo-600 bg-indigo-100 font-semibold').removeClass('text-gray-600 font-medium');

                // Show 'Why Choose' only if a feature section is active
                if (targetId === 'scanner' || targetId === 'lookalike' || targetId === 'analysis' || targetId === 'showdown') {
                    $('#why-choose').removeClass('hidden');
                } else {
                    $('#why-choose').addClass('hidden'); // Hide for 'How to Use' and 'About'
                }

                // Smooth scroll to the section
                const headerHeight = $('header').outerHeight() || 60; // Get header height or default
                $('html, body').animate({
                    scrollTop: $targetElement.offset().top - headerHeight - 15 // Adjust offset for sticky header + margin
                }, 300);
            });

            // --- Utility Functions ---
            function showLoader(loaderId, textElementId = null, initialText = "Chargement 0%") {
                $('#' + loaderId).removeClass('hidden');
                if (textElementId) {
                    $('#' + textElementId).text(initialText);
                }
            }
            function hideLoader(loaderId) {
                $('#' + loaderId).addClass('hidden');
            }
            function showResults(resultsId) {
                $('#' + resultsId).removeClass('hidden');
            }
            function hideResults(resultsId) { $('#' + resultsId).addClass('hidden'); }

            // Function to clear timers for a specific feature
            function clearFeatureTimers(featureKey) {
                const state = featureState[featureKey];
                // Add checks for state existence
                if (!state || (!state.intervalId && !state.timeoutId)) return;

                if (state.intervalId) {
                    clearInterval(state.intervalId);
                    state.intervalId = null;
                }
                if (state.timeoutId) {
                    clearTimeout(state.timeoutId);
                    state.timeoutId = null;
                }
                // Check if loaderTextId exists before trying to access it
                if (state.loaderTextId && $('#' + state.loaderTextId).length) {
                    $('#' + state.loaderTextId).text('Chargement 0%');
                }
            }

            // Function to start the progressive loading process
            function startProgressiveLoad(featureKey, loadingTextPrefix, onComplete) {
                const state = featureState[featureKey];
                // Add checks for state and delay property
                if (!state || typeof state.delay === 'undefined') return;

                // Ensure previous timers for this feature are cleared
                clearFeatureTimers(featureKey);
                // Check if resultsId exists before hiding
                if (state.resultsId) hideResults(state.resultsId);

                const startTime = Date.now();
                const totalDelay = state.delay;

                // Check if loader elements exist before showing
                if (state.loaderId && state.loaderTextId) {
                    showLoader(state.loaderId, state.loaderTextId, `${loadingTextPrefix} 0%`);
                }

                // Clear previous interval if any (safety check)
                if (state.intervalId) clearInterval(state.intervalId);

                state.intervalId = setInterval(() => {
                    const elapsedTime = Date.now() - startTime;
                    let percentage = Math.min(100, Math.floor((elapsedTime / totalDelay) * 100));
                    // Check if loaderTextId exists before updating
                    if (state.loaderTextId && $('#' + state.loaderTextId).length) {
                        $('#' + state.loaderTextId).text(`${loadingTextPrefix} ${percentage}%`);
                    }
                    // Clear interval inside itself when 100% is reached
                    if (percentage >= 100) {
                        clearInterval(state.intervalId);
                        state.intervalId = null;
                    }
                }, 100);

                // Clear previous timeout if any (safety check)
                if (state.timeoutId) clearTimeout(state.timeoutId);

                state.timeoutId = setTimeout(() => {
                    // Ensure interval is cleared if timeout finishes first
                    if (state.intervalId) {
                        clearInterval(state.intervalId);
                        state.intervalId = null;
                    }
                    // Check if loaderTextId exists before updating
                    if (state.loaderTextId && $('#' + state.loaderTextId).length) {
                        $('#' + state.loaderTextId).text(`${loadingTextPrefix} 100%`);
                    }

                    // Execute the completion callback
                    if (typeof onComplete === 'function') {
                        onComplete();
                    }

                    // Check if loaderId and resultsId exist before hiding/showing
                    if (state.loaderId) hideLoader(state.loaderId);
                    if (state.resultsId) showResults(state.resultsId);

                    // Increment delay for the *next* time this feature is used
                    state.delay += DELAY_INCREMENT;
                    state.timeoutId = null; // Clear timeout ID

                }, totalDelay);
            }

            // Simple hash function (remains the same)
            function simpleHash(str) {
                let hash = 0;
                if (!str || str.length === 0) return hash;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash |= 0; // Convert to 32bit integer
                }
                return Math.abs(hash);
            }

            // Generic function to handle image preview
            function previewImage(inputId, previewImgId) {
                const input = document.getElementById(inputId);
                // Add safety check for input element
                if (!input) return null;

                const file = input.files ? input.files[0] : null;
                const $previewElement = $('#' + previewImgId);
                // Add safety check for preview element
                if (!$previewElement.length) return null;


                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        $previewElement.attr('src', e.target.result);
                        // Update alt text safely
                        let baseAlt = $previewElement.attr('alt')?.split(' - ')[0] || "Zone de prévisualisation";
                        $previewElement.attr('alt', `${baseAlt} - Aperçu de ${file.name}`);
                    }
                    reader.onerror = function () { // Handle potential read errors
                        console.error("Error reading file:", file.name);
                        resetPreview(previewImgId); // Reset on error
                    }
                    reader.readAsDataURL(file);
                    return file;
                } else {
                    resetPreview(previewImgId); // Reset if no file or invalid type
                    if (file && !file.type.startsWith('image/')) {
                        // Use a more robust notification method if available, otherwise alert
                        alert("Veuillez télécharger un fichier image valide (ex: JPG, PNG, GIF).");
                    }
                    return null;
                }
            }

            // Helper function to reset image preview and alt text
            function resetPreview(previewImgId) {
                const $previewElement = $('#' + previewImgId);
                if (!$previewElement.length) return;

                const placeholder = `https://placehold.co/${$previewElement.attr('width') || 400}x${$previewElement.attr('height') || 300}/e2e8f0/cbd5e1?text=Télécharger+Image`;
                $previewElement.attr('src', placeholder);

                let originalAlt = "Zone de prévisualisation pour l'image téléchargée";
                // Determine original alt text based on ID
                if (previewImgId === 'scanner-img-preview') originalAlt = "Zone de prévisualisation pour le scan de beauté";
                else if (previewImgId === 'lookalike-img-preview') originalAlt = "Zone de prévisualisation pour le sosie";
                else if (previewImgId === 'analysis-img-preview') originalAlt = "Zone de prévisualisation pour l'analyse";
                else if (previewImgId === 'showdown-img-preview1') originalAlt = "Aperçu Image 1";
                else if (previewImgId === 'showdown-img-preview2') originalAlt = "Aperçu Image 2";
                else if (previewImgId === 'celebrity-img') originalAlt = "Placeholder de Correspondance Célébrité";

                $previewElement.attr('alt', originalAlt);
            }


            // --- Feature Logic (Event Handlers) ---

            // 1. Face Scanner
            $('#scanner-upload').on('change', function () {
                const featureKey = 'scanner';
                const file = previewImage('scanner-upload', 'scanner-img-preview');

                if (file) {
                    const filename = file.name;
                    const onCompleteScanner = () => {
                        const hash = simpleHash(filename);
                        const overallScore = (hash % 41) + 60;
                        const eyesScore = ((hash + 10) % 36) + 65;
                        const lipsScore = ((hash + 20) % 31) + 60;
                        const noseScore = ((hash + 30) % 36) + 62;
                        const symmetryScore = ((hash + 40) % 26) + 70;

                        $('#scanner-score').text(`${overallScore} / 100`);
                        $('#scanner-eyes').text(eyesScore);
                        $('#scanner-lips').text(lipsScore);
                        $('#scanner-nose').text(noseScore);
                        $('#scanner-symmetry').text(symmetryScore);
                    };
                    startProgressiveLoad(featureKey, "Scan en cours", onCompleteScanner);
                } else {
                    clearFeatureTimers(featureKey);
                    if (featureState[featureKey]?.loaderId) hideLoader(featureState[featureKey].loaderId);
                    if (featureState[featureKey]?.resultsId) hideResults(featureState[featureKey].resultsId);
                    // Reset scores
                    $('#scanner-score').text('-- / 100');
                    $('#scanner-eyes, #scanner-lips, #scanner-nose, #scanner-symmetry').text('--');
                }
            });

            // 2. Celebrity Look-Alike
            const celebrities = [ // Using slightly more descriptive placeholders
                { name: "Exemple Élégance", img: "https://placehold.co/160x160/FFC0CB/4a4a4a?text=EE" },
                { name: "Dynamo Dashing", img: "https://placehold.co/160x160/ADD8E6/4a4a4a?text=DD" },
                { name: "Étoile Radieuse", img: "https://placehold.co/160x160/90EE90/4a4a4a?text=ER" },
                { name: "Champion Charmant", img: "https://placehold.co/160x160/FFFFE0/4a4a4a?text=CC" },
                { name: "Icône Glamour", img: "https://placehold.co/160x160/E6E6FA/4a4a4a?text=IG" },
                { name: "Figure Héroïque", img: "https://placehold.co/160x160/D3D3D3/4a4a4a?text=FH" },
                { name: "Sirène Superbe", img: "https://placehold.co/160x160/FFA07A/4a4a4a?text=SS" }
            ];
            $('#lookalike-upload').on('change', function () {
                const featureKey = 'lookalike';
                const file = previewImage('lookalike-upload', 'lookalike-img-preview');

                if (file) {
                    const filename = file.name;
                    const onCompleteLookalike = () => {
                        const hash = simpleHash(filename);
                        const randomIndex = hash % celebrities.length;
                        const match = celebrities[randomIndex];
                        const confidence = ((hash + 5) % 36) + 65;

                        $('#celebrity-name').text(match.name);
                        // Update src and alt text for the result image
                        $('#celebrity-img').attr('src', match.img).attr('alt', `Correspondance de célébrité simulée : ${match.name}`);
                        $('#celebrity-confidence').text(confidence);
                    };
                    startProgressiveLoad(featureKey, "Recherche de correspondances", onCompleteLookalike);
                } else {
                    clearFeatureTimers(featureKey);
                    if (featureState[featureKey]?.loaderId) hideLoader(featureState[featureKey].loaderId);
                    if (featureState[featureKey]?.resultsId) hideResults(featureState[featureKey].resultsId);
                    // Reset lookalike info
                    $('#celebrity-name').text('--');
                    $('#celebrity-confidence').text('--');
                    resetPreview('celebrity-img'); // Reset the image placeholder
                }
            });

            // 3. Face Parts Analysis
            const analysisTexts = { // Descriptions remain the same
                eyes: [
                    "Yeux expressifs, indiquant souvent un observateur attentif avec un monde intérieur vibrant.",
                    "Yeux enfoncés, suggérant une nature réfléchie, introspective et peut-être mystérieuse.",
                    "Yeux écartés, laissant entendre une perspective large et ouverte et une tolérance aux idées nouvelles.",
                    "Yeux clairs et brillants, reflétant une énergie abondante, de la curiosité et de l'enthousiasme pour la vie.",
                    "Yeux en amande, souvent considérés comme équilibrés, esthétiquement plaisants et indiquant potentiellement une sensibilité artistique."
                ],
                lips: [
                    "Lèvres pleines, souvent associées à la générosité, à la chaleur et à de forts instincts nourriciers.",
                    "Lèvres fines, suggérant une personnalité plus réservée, précise et peut-être soucieuse du détail.",
                    "Un arc de cupidon défini, indiquant la créativité, de fortes compétences en communication et de l'éloquence.",
                    "Lèvres équilibrées et symétriques, reflétant l'équilibre émotionnel, la stabilité et l'équité.",
                    "Un sourire naturellement tourné vers le haut, véhiculant l'accessibilité, l'optimisme et une disposition amicale."
                ],
                nose: [
                    "Un pont de nez droit, souvent lié à la logique, à l'organisation et à une approche méthodique.",
                    "Un nez proéminent ou fort, suggérant des qualités de leadership, de l'ambition et de la détermination.",
                    "Un nez plus petit et raffiné, laissant entendre une sensibilité, une attention aux détails et des goûts raffinés.",
                    "Un bout de nez arrondi, associé à un comportement amical, accessible et sociable.",
                    "Un nez légèrement retroussé, parfois lié à l'optimisme, à la curiosité et à l'espièglerie."
                ]
            };
            $('#analysis-upload').on('change', function () {
                const featureKey = 'analysis';
                const file = previewImage('analysis-upload', 'analysis-img-preview');

                const resetAnalysisText = () => {
                    $('#analysis-eyes-text, #analysis-lips-text, #analysis-nose-text').text('Téléchargez une image pour voir l\'analyse.');
                }

                resetAnalysisText(); // Reset text initially

                if (file) {
                    const filename = file.name;
                    const onCompleteAnalysis = () => {
                        const hash = simpleHash(filename);
                        $('#analysis-eyes-text').text(analysisTexts.eyes[(hash + 1) % analysisTexts.eyes.length]);
                        $('#analysis-lips-text').text(analysisTexts.lips[(hash + 2) % analysisTexts.lips.length]);
                        $('#analysis-nose-text').text(analysisTexts.nose[(hash + 3) % analysisTexts.nose.length]);
                    };
                    startProgressiveLoad(featureKey, "Analyse des caractéristiques", onCompleteAnalysis);
                } else {
                    clearFeatureTimers(featureKey);
                    if (featureState[featureKey]?.loaderId) hideLoader(featureState[featureKey].loaderId);
                    if (featureState[featureKey]?.resultsId) hideResults(featureState[featureKey].resultsId);
                    resetAnalysisText(); // Ensure text remains reset
                }
            });

            // 4. Beauty Showdown
            let showdownFilesReady = { file1: false, file2: false };
            let showdownFileNames = { file1: null, file2: null };

            function checkShowdownReady() {
                const featureKey = 'showdown';
                const resetShowdownUi = () => {
                    $('#showdown-score1, #showdown-score2').text('--');
                    $('#showdown-winner').html('').removeClass('winner-img1 winner-img2 winner-tie'); // Clear HTML and classes
                }

                if (showdownFilesReady.file1 && showdownFilesReady.file2) {
                    const onCompleteShowdown = () => {
                        const hash1 = simpleHash(showdownFileNames.file1 || ""); // Add fallback for null
                        const hash2 = simpleHash(showdownFileNames.file2 || ""); // Add fallback for null
                        const score1 = ((hash1 + 50) % 46) + 55;
                        const score2 = ((hash2 + 60) % 46) + 55;

                        $('#showdown-score1').text(score1);
                        $('#showdown-score2').text(score2);

                        let winnerText = '';
                        let winnerClass = '';
                        if (score1 > score2) {
                            winnerText = '<i class="fas fa-crown mr-1 sm:mr-2"></i> Image 1 Gagne !';
                            winnerClass = 'winner-img1';
                        } else if (score2 > score1) {
                            winnerText = '<i class="fas fa-crown mr-1 sm:mr-2"></i> Image 2 Gagne !';
                            winnerClass = 'winner-img2';
                        } else {
                            winnerText = '<i class="fas fa-handshake mr-1 sm:mr-2"></i> C\'est une Égalité !';
                            winnerClass = 'winner-tie';
                        }
                        $('#showdown-winner')
                            .html(winnerText)
                            .removeClass('winner-img1 winner-img2 winner-tie')
                            .addClass(winnerClass);
                    };
                    startProgressiveLoad(featureKey, "Comparaison des scores", onCompleteShowdown);
                } else {
                    // If one or both files are missing/invalid, clear UI
                    clearFeatureTimers(featureKey);
                    if (featureState[featureKey]?.loaderId) hideLoader(featureState[featureKey].loaderId);
                    if (featureState[featureKey]?.resultsId) hideResults(featureState[featureKey].resultsId);
                    resetShowdownUi();
                }
            }

            $('#showdown-upload1').on('change', function () {
                const file = previewImage('showdown-upload1', 'showdown-img-preview1');
                showdownFilesReady.file1 = !!file;
                showdownFileNames.file1 = file ? file.name : null;
                checkShowdownReady();
            });

            $('#showdown-upload2').on('change', function () {
                const file = previewImage('showdown-upload2', 'showdown-img-preview2');
                showdownFilesReady.file2 = !!file;
                showdownFileNames.file2 = file ? file.name : null;
                checkShowdownReady();
            });

            // --- Initialization ---
            $('#current-year').text(new Date().getFullYear());

            // Set initial active button and section
            $('.nav-btn[data-target="scanner"]')
                .addClass('text-indigo-600 bg-indigo-100 font-semibold')
                .removeClass('text-gray-600 font-medium');

            // Hide all content sections initially, except the default and 'why-choose'
            $('.content-section').addClass('hidden');
            $('#scanner').removeClass('hidden');
            $('#why-choose').removeClass('hidden');

        }); // End DOMContentLoaded
