document.addEventListener('DOMContentLoaded', () => {
            // Get references to DOM elements
            const remInput = document.getElementById('rem-input');
            const baseFontSizeSelect = document.getElementById('base-font-size');
            const resultValue = document.getElementById('result-value');
            const tableBody = document.getElementById('conversion-table-body');
            const currentYearSpan = document.getElementById('current-year');
            
            // Set current year in footer
            if(currentYearSpan) {
                currentYearSpan.textContent = new Date().getFullYear();
            }

            /**
             * Convierte un valor REM a un valor de píxel basado en un tamaño de fuente base.
             * Actualiza la visualización del resultado en la página.
             */
            function convertRemToPx() {
                const remValue = parseFloat(remInput.value);
                const baseSize = parseFloat(baseFontSizeSelect.value);

                // Validation
                if (isNaN(remValue) || isNaN(baseSize) || baseSize <= 0) {
                    resultValue.textContent = '...';
                    return;
                }

                const pxValue = remValue * baseSize;
                
                // Format the result, removing trailing zeros if it's an integer
                const formattedPx = parseFloat(pxValue.toFixed(4));

                resultValue.textContent = `${formattedPx}px`;
            }

            /**
             * Rellena la tabla de conversión con valores REM comunes.
             * La tabla se basa en un tamaño de fuente base fijo de 16px para referencia rápida.
             */
            function populateConversionTable() {
                const baseForTable = 16;
                const commonRemValues = [0.125, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6];
                let tableHTML = '';

                commonRemValues.forEach(rem => {
                    const px = rem * baseForTable;
                    tableHTML += `
                        <tr class="hover:bg-slate-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">${rem}rem</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${px}px</td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = tableHTML;
            }

            // --- Event Listeners ---

            // Conversión en tiempo real al cambiar la entrada
            remInput.addEventListener('input', convertRemToPx);
            baseFontSizeSelect.addEventListener('change', convertRemToPx);

            // --- Initial Setup ---
            populateConversionTable();
            convertRemToPx(); // Realizar una conversión inicial al cargar la página
        });
