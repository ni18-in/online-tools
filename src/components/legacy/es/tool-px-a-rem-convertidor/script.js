document.addEventListener('DOMContentLoaded', () => {
            // Get references to DOM elements
            const converterForm = document.getElementById('converter-form');
            const pxInput = document.getElementById('px-input');
            const baseFontSizeSelect = document.getElementById('base-font-size');
            const resultValue = document.getElementById('result-value');
            const tableBody = document.getElementById('conversion-table-body');

            /**
             * Converts a pixel value to a REM value based on a base font size.
             * Updates the result display on the page.
             */
            function convertPxToRem() {
                const pxValue = parseFloat(pxInput.value);
                const baseSize = parseFloat(baseFontSizeSelect.value);

                // Validation: Ensure we have valid numbers to work with
                if (isNaN(pxValue) || isNaN(baseSize) || baseSize === 0) {
                    resultValue.textContent = 'Inválido';
                    return;
                }

                const remValue = pxValue / baseSize;

                // Format the result to a reasonable number of decimal places
                const formattedRem = parseFloat(remValue.toFixed(4));

                resultValue.textContent = `${formattedRem}rem`;
            }

            /**
             * Populates the conversion table with values from 1px to 100px.
             * The table is based on a fixed base font size of 16px for quick reference.
             */
            function populateConversionTable() {
                const baseForTable = 16;
                let tableHTML = '';

                for (let px = 1; px <= 100; px++) {
                    const rem = parseFloat((px / baseForTable).toFixed(4));
                    tableHTML += `
                        <tr>
                            <td>${px}px</td>
                            <td>${rem}rem</td>
                        </tr>
                    `;
                }
                tableBody.innerHTML = tableHTML;
            }

            // --- Event Listeners ---

            // Prevent form submission from reloading the page
            converterForm.addEventListener('submit', (event) => {
                event.preventDefault();
                convertPxToRem();
            });

            // Real-time conversion on input change
            pxInput.addEventListener('input', convertPxToRem);
            baseFontSizeSelect.addEventListener('change', convertPxToRem);

            // --- Initial Setup ---

            // Populate the conversion table on page load
            populateConversionTable();

            // Perform an initial conversion on page load with default values
            convertPxToRem();
        });
