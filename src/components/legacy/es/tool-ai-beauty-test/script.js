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
            function showLoader(loaderId, textElementId = null, initialText = "Cargando 0%") { // Translated text
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
                    $('#' + state.loaderTextId).text('Cargando 0%'); // Translated text
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
                        let baseAlt = $previewElement.attr('alt')?.split(' - ')[0] || "Área de vista previa"; // Translated text
                        $previewElement.attr('alt', `${baseAlt} - Vista previa de ${file.name}`); // Translated text
                    }
                    reader.onerror = function () { // Handle potential read errors
                        console.error("Error al leer el archivo:", file.name); // Translated text
                        resetPreview(previewImgId); // Reset on error
                    }
                    reader.readAsDataURL(file);
                    return file;
                } else {
                    resetPreview(previewImgId); // Reset if no file or invalid type
                    if (file && !file.type.startsWith('image/')) {
                        // Use a more robust notification method if available, otherwise alert
                        alert("Por favor, sube un archivo de imagen válido (ej. JPG, PNG, GIF)."); // Translated text
                    }
                    return null;
                }
            }

            // Helper function to reset image preview and alt text
            function resetPreview(previewImgId) {
                const $previewElement = $('#' + previewImgId);
                if (!$previewElement.length) return;

                const placeholder = `https://placehold.co/${$previewElement.attr('width') || 400}x${$previewElement.attr('height') || 300}/e2e8f0/cbd5e1?text=Subir+Imagen`; // Translated text
                $previewElement.attr('src', placeholder);

                let originalAlt = "Área de vista previa para la imagen subida"; // Translated text
                // Determine original alt text based on ID
                if (previewImgId === 'scanner-img-preview') originalAlt = "Área de vista previa para la imagen subida para el escaneo de belleza"; // Translated text
                else if (previewImgId === 'lookalike-img-preview') originalAlt = "Área de vista previa para la imagen subida para detección de parecido a celebridad"; // Translated text
                else if (previewImgId === 'analysis-img-preview') originalAlt = "Área de vista previa para la imagen subida para análisis de partes de la cara"; // Translated text
                else if (previewImgId === 'showdown-img-preview1') originalAlt = "Área de vista previa para la primera imagen en duelo de belleza"; // Translated text
                else if (previewImgId === 'showdown-img-preview2') originalAlt = "Área de vista previa para la segunda imagen en duelo de belleza"; // Translated text
                else if (previewImgId === 'celebrity-img') originalAlt = "Marcador de posición de Coincidencia de Celebridad"; // Translated text

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
                    startProgressiveLoad(featureKey, "Escaneando", onCompleteScanner); // Translated text
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
                { name: "Ejemplo de Elegancia", img: "https://placehold.co/160x160/FFC0CB/4a4a4a?text=EE" }, // Translated text
                { name: "Dínamo Apuesto", img: "https://placehold.co/160x160/ADD8E6/4a4a4a?text=DD" }, // Translated text
                { name: "Estrella Radiante", img: "https://placehold.co/160x160/90EE90/4a4a4a?text=RS" }, // Translated text
                { name: "Campeón Encantador", img: "https://placehold.co/160x160/FFFFE0/4a4a4a?text=CC" }, // Translated text
                { name: "Icono de Glamour", img: "https://placehold.co/160x160/E6E6FA/4a4a4a?text=GI" }, // Translated text
                { name: "Figura Heroica", img: "https://placehold.co/160x160/D3D3D3/4a4a4a?text=HF" }, // Translated text
                { name: "Sirena Impresionante", img: "https://placehold.co/160x160/FFA07A/4a4a4a?text=SS" } // Translated text
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
                        $('#celebrity-img').attr('src', match.img).attr('alt', `Coincidencia simulada con celebridad: ${match.name}`); // Translated text
                        $('#celebrity-confidence').text(confidence);
                    };
                    startProgressiveLoad(featureKey, "Buscando Coincidencia", onCompleteLookalike); // Translated text
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
            const analysisTexts = { // Descriptions translated
                eyes: [
                    "Ojos expresivos, a menudo indicando un observador perspicaz con un mundo interior vibrante.",
                    "Ojos hundidos, sugiriendo una naturaleza reflexiva, introspectiva y quizás misteriosa.",
                    "Ojos muy separados, insinuando una perspectiva abierta y amplia y tolerancia a nuevas ideas.",
                    "Ojos brillantes y claros, que reflejan energía abundante, curiosidad y entusiasmo por la vida.",
                    "Ojos en forma de almendra, a menudo vistos como equilibrados, estéticamente agradables, y potencialmente indicando sensibilidad artística."
                ],
                lips: [
                    "Labios carnosos, a menudo asociados con generosidad, calidez y fuertes instintos de cuidado.",
                    "Labios delgados, sugiriendo una personalidad más reservada, precisa y quizás orientada al detalle.",
                    "Un arco de Cupido definido, indicando creatividad, fuertes habilidades de comunicación y elocuencia.",
                    "Labios equilibrados y simétricos, que reflejan equilibrio emocional, estabilidad y justicia.",
                    "Una sonrisa naturalmente hacia arriba, transmitiendo accesibilidad, optimismo y una disposición amigable."
                ],
                nose: [
                    "Un puente nasal recto, a menudo vinculado a la lógica, la organización y un enfoque metódico.",
                    "Una nariz prominente o fuerte, sugiriendo cualidades de liderazgo, ambición y decisión.",
                    "Una nariz más pequeña y refinada, insinuando sensibilidad, atención al detalle y gustos refinados.",
                    "Una punta nasal redondeada, asociada con un comportamiento amigable, accesible y sociable.",
                    "Una nariz ligeramente respingona ('celestial'), a veces vinculada al optimismo, la curiosidad y la alegría."
                ]
            };
            $('#analysis-upload').on('change', function () {
                const featureKey = 'analysis';
                const file = previewImage('analysis-upload', 'analysis-img-preview');

                const resetAnalysisText = () => {
                    $('#analysis-eyes-text, #analysis-lips-text, #analysis-nose-text').text('Sube una imagen para ver el análisis.'); // Translated text
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
                    startProgressiveLoad(featureKey, "Analizando Rasgos", onCompleteAnalysis); // Translated text
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
                            winnerText = '<i class="fas fa-crown mr-1 sm:mr-2"></i> ¡La Imagen 1 Gana!'; // Translated text
                            winnerClass = 'winner-img1';
                        } else if (score2 > score1) {
                            winnerText = '<i class="fas fa-crown mr-1 sm:mr-2"></i> ¡La Imagen 2 Gana!'; // Translated text
                            winnerClass = 'winner-img2';
                        } else {
                            winnerText = '<i class="fas fa-handshake mr-1 sm:mr-2"></i> ¡Es un Empate!'; // Translated text
                            winnerClass = 'winner-tie';
                        }
                        $('#showdown-winner')
                            .html(winnerText)
                            .removeClass('winner-img1 winner-img2 winner-tie')
                            .addClass(winnerClass);
                    };
                    startProgressiveLoad(featureKey, "Comparando Puntuaciones", onCompleteShowdown); // Translated text
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
