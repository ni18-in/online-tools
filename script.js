// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the necessary DOM elements
    const searchInput = document.getElementById('tool-search-input');
    const toolCards = document.querySelectorAll('.tool-card'); // Get all tool cards
    const noResultsMessage = document.getElementById('no-results-message');
    const toolGrid = document.querySelector('.tool-grid'); // Get the container for cards

    // Check if all required elements exist before proceeding
    if (!searchInput || !toolCards.length || !noResultsMessage || !toolGrid) {
        console.error('Search initialization failed: One or more required elements not found.');
        // Optionally disable search input if setup fails
        if(searchInput) searchInput.disabled = true;
        return; // Exit if essential elements are missing
    }

    // Function to perform the filtering
    function filterTools() {
        // Get the search term, convert to lowercase, and remove leading/trailing whitespace
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0; // Counter for visible cards

        // Loop through each tool card
        toolCards.forEach(card => {
            // Get the text content from the card's heading (h3) and paragraph (p)
            // Convert to lowercase for case-insensitive comparison
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const cardText = title + ' ' + description; // Combine text to search within

            // Check if the combined card text includes the search term
            const isMatch = cardText.includes(searchTerm);

            // Show or hide the card based on whether it matches
            // We use 'flex' because the .tool-card uses display: flex in the CSS
            card.style.display = isMatch ? 'flex' : 'none';

            // If it's a match, increment the visible count
            if (isMatch) {
                visibleCount++;
            }
        });

        // Show or hide the 'no results' message based on the visible count
        noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';

        // Optional: Add/remove a class from the grid if no results are found
        // This could be used for different styling when the grid is empty
        if (visibleCount === 0) {
            toolGrid.classList.add('no-results');
        } else {
            toolGrid.classList.remove('no-results');
        }
    }

    // Add an event listener to the search input
    // 'input' event triggers every time the value changes (live search)
    searchInput.addEventListener('input', filterTools);

    // Optional: Initial filter call in case the input has a pre-filled value (e.g., from browser autocomplete)
    // filterTools(); // Uncomment if needed, but usually not necessary for type="search"

}); // End of DOMContentLoaded listener