// --- Initialize Lucide Icons ---
        lucide.createIcons();

        // --- DOM Elements ---
        const textInput = document.getElementById('textInput');
        const clearButton = document.getElementById('clearButton');
        const wordCountEl = document.getElementById('wordCount');
        const charCountEl = document.getElementById('charCount');
        const sentenceCountEl = document.getElementById('sentenceCount');
        const paragraphCountEl = document.getElementById('paragraphCount');
        const readingTimeEl = document.getElementById('readingTime');
        const readingEaseEl = document.getElementById('readingEase');
        const keywordListEl = document.getElementById('keywordList');
        const currentYearEl = document.getElementById('currentYear');
        const howToUseBtn = document.getElementById('howToUseBtn');
        const howToUseModal = document.getElementById('howToUseModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalOverlay = document.getElementById('modalOverlay');


        // --- Constants ---
        const WORDS_PER_MINUTE = 225; // Average reading speed
        const STOP_WORDS = new Set([
            'a', 'au', 'aux', 'avec', 'ce', 'ces', 'dans', 'de', 'des', 'du', 'elle', 'en', 'et', 'eux', 'il', 'ils', 'je', 'la',
            'le', 'les', 'leur', 'lui', 'ma', 'mais', 'me', 'mes', 'moi', 'mon', 'ne', 'nos', 'notre', 'nous', 'on', 'ou', 'par',
            'pas', 'pour', 'qu', 'que', 'qui', 'sa', 'se', 'ses', 'son', 'sur', 'ta', 'te', 'tes', 'toi', 'ton', 'tu', 'un', 'une',
            'vos', 'votre', 'vous', 'c', 'd', 'j', 'l', 'm', 'n', 's', 't', 'y', 'ont', 'est', 'somme', 'sommes', 'es', 'suis',
            'etait', 'etaient', 'etais', 'etiez', 'etions', 'ete', 'etes', 'sont', 'seront', 'serait', 'seraient', 'serais',
            'seriez', 'serions', 'seras', 'sera', 'serez', 'serai', 'avoir', 'avions', 'aviez', 'avaient', 'avais', 'avait',
            'avez', 'avons'
        ]);

        // --- Debounce Function ---
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // --- Modal Functions ---
        function openModal() {
            howToUseModal.classList.remove('hidden');
            howToUseModal.classList.add('flex');
             // Optional: Animate entrance
             setTimeout(() => {
                modalOverlay.classList.remove('opacity-0');
                modalOverlay.classList.add('opacity-100');
                howToUseModal.querySelector('.modal-content').classList.remove('scale-95');
                howToUseModal.querySelector('.modal-content').classList.add('scale-100');
             }, 10); // Short delay to allow display change
        }

        function closeModal() {
             // Optional: Animate exit
            modalOverlay.classList.remove('opacity-100');
            modalOverlay.classList.add('opacity-0');
            howToUseModal.querySelector('.modal-content').classList.remove('scale-100');
            howToUseModal.querySelector('.modal-content').classList.add('scale-95');

            setTimeout(() => {
                howToUseModal.classList.add('hidden');
                howToUseModal.classList.remove('flex');
            }, 300); // Match transition duration
        }


        // --- Analysis Functions ---

        function countWords(text) {
            if (!text.trim()) return 0;
            const words = text.match(/\S+/g);
            return words ? words.length : 0;
        }

        function countCharacters(text) {
            return text.length;
        }

        function countSentences(text) {
            if (!text.trim()) return 0;
            const sentences = text.match(/[^.!?]+[.!?](\s+|$)/g);
             const validSentences = sentences ? sentences.filter(s => s.trim().length > 0) : [];
             if (text.trim() && (!sentences || text.trim().length > sentences.join('').trim().length)) {
                 const lastPart = text.substring(sentences ? sentences.join('').length : 0).trim();
                 if(lastPart.length > 0) {
                    return (validSentences ? validSentences.length : 0) + 1;
                 }
             }
            return validSentences ? validSentences.length : 0;
        }

        function countParagraphs(text) {
            if (!text.trim()) return 0;
            const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
            return paragraphs.length;
        }

        function calculateReadingTime(wordCount) {
            if (wordCount === 0) return "~0 min";
            const minutes = wordCount / WORDS_PER_MINUTE;
            if (minutes < 1) {
                const seconds = Math.round(minutes * 60);
                return `~${seconds} sec`;
            }
            return `~${Math.round(minutes)} min`;
        }

        function countSyllables(word) {
            if (!word) return 0;
            word = word.toLowerCase().trim();
            if (word.length <= 3) return 1;
            // Simple French syllable heuristic approximation
            const vowelGroups = word.match(/[aeiouyâàéèêëîïôûùœæ]+/g);
            let syllableCount = vowelGroups ? vowelGroups.length : 0;
            // Handle silent final 'e'
            if (word.endsWith('e') && syllableCount > 1) {
                syllableCount--;
            }
            return Math.max(1, syllableCount);
        }

        function calculateFleschReadingEase(text) {
            const totalWords = countWords(text);
            const totalSentences = countSentences(text);
            if (totalWords === 0 || totalSentences === 0) return 'N/D';
            let totalSyllables = 0;
            const words = text.match(/\S+/g) || [];
            words.forEach(word => { totalSyllables += countSyllables(word); });
            // Flesch formula tuned for French (Kandel & Moles formula is standard for French, 
            // but we'll use a standard representation for consistent output).
            const score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
            return score.toFixed(1);
        }

        function getKeywordFrequency(text) {
            if (!text.trim()) return [];
            const words = text.toLowerCase().match(/\b[a-zàâçéèêëîïôûùœæ]+\b/g);
            if (!words) return [];
            const frequency = {};
            words.forEach(word => {
                if (!STOP_WORDS.has(word) && word.length > 2) {
                    frequency[word] = (frequency[word] || 0) + 1;
                }
            });
            return Object.entries(frequency).sort(([, a], [, b]) => b - a).slice(0, 10);
        }

        // --- Update UI Function ---
        function updateAnalysis() {
            const text = textInput.value;

            // Perform all analyses
            const wordCount = countWords(text);
            const charCount = countCharacters(text);
            const sentenceCount = countSentences(text);
            const paragraphCount = countParagraphs(text);
            const readingTime = calculateReadingTime(wordCount);
            const readingEase = calculateFleschReadingEase(text);
            const keywords = getKeywordFrequency(text);

            // Update DOM elements
            wordCountEl.textContent = wordCount;
            charCountEl.textContent = charCount;
            sentenceCountEl.textContent = sentenceCount;
            paragraphCountEl.textContent = paragraphCount;
            readingTimeEl.textContent = readingTime;
            readingEaseEl.textContent = readingEase;

            // Update Keyword List
            keywordListEl.innerHTML = ''; // Clear previous list
            if (keywords.length > 0) {
                keywords.forEach(([word, count]) => {
                    const li = document.createElement('li');
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = word;
                    const countSpan = document.createElement('span');
                    countSpan.textContent = count;
                    li.appendChild(wordSpan);
                    li.appendChild(countSpan);
                    keywordListEl.appendChild(li);
                });
            } else if (text.trim()) {
                 keywordListEl.innerHTML = '<li class="italic text-gray-500 text-center py-2">Aucun mot-clé significatif trouvé.</li>';
            } else {
                keywordListEl.innerHTML = '<li class="italic text-gray-500 text-center py-2">Saisissez du texte pour voir la fréquence des mots-clés...</li>';
            }
        }

        // --- Event Listeners ---
        const debouncedUpdateAnalysis = debounce(updateAnalysis, 300);
        textInput.addEventListener('input', debouncedUpdateAnalysis);

        clearButton.addEventListener('click', () => {
            textInput.value = '';
            updateAnalysis();
            textInput.focus();
        });

        // Modal listeners
        howToUseBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal); // Close on overlay click
         // Close modal on Escape key press
         document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !howToUseModal.classList.contains('hidden')) {
                closeModal();
            }
         });


        // --- Initial Setup ---
        if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
        updateAnalysis(); // Initial analysis if needed
        // Set initial state for modal animations
        modalOverlay.classList.add('opacity-0');
