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
            'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
            'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
            'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
            'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
            'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m',
            'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
            'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
            'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t',
            'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
            'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
            'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t',
            'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
            'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
            'yourselves'
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


        // --- Analysis Functions (Copied from previous version, no changes needed) ---

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
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            const vowelGroups = word.match(/[aeiouy]+/g);
            let syllableCount = vowelGroups ? vowelGroups.length : 0;
            return Math.max(1, syllableCount);
        }

        function calculateFleschReadingEase(text) {
            const totalWords = countWords(text);
            const totalSentences = countSentences(text);
            if (totalWords === 0 || totalSentences === 0) return 'N/A';
            let totalSyllables = 0;
            const words = text.match(/\S+/g) || [];
            words.forEach(word => { totalSyllables += countSyllables(word); });
            const score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
            return score.toFixed(1);
        }

        function getKeywordFrequency(text) {
            if (!text.trim()) return [];
            const words = text.toLowerCase().match(/\b[a-z]+\b/g);
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
                 keywordListEl.innerHTML = '<li class="italic text-gray-500 text-center py-2">No significant keywords found.</li>';
            } else {
                keywordListEl.innerHTML = '<li class="italic text-gray-500 text-center py-2">Enter text to see keyword frequency...</li>';
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
