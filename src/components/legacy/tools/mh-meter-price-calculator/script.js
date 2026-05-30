/**
         * MH Meter Price Calculator Logic
         * Based on MMRTA Tariff Card w.e.f 01/02/2025
         */

        const TARIFFS = {
            auto: {
                minFare: 26.00,
                minDist: 1.5,
                perKm: 17.14,
                waitingFactor: 0.10 // 10% of perKm rate per min
            },
            taxi_by: {
                minFare: 31.00,
                minDist: 1.5,
                perKm: 20.66,
                waitingFactor: 0.10
            },
            taxi_cool: {
                minFare: 48.00,
                minDist: 1.5,
                perKm: 32.05,
                waitingFactor: 0.10
            }
        };

        const LUGGAGE_RATE = 6.00;

        // UI Elements
        const form = document.getElementById('fareForm');
        const vehicleSelect = document.getElementById('vehicleType');
        const acContainer = document.getElementById('acOptionContainer');
        const acCheckbox = document.getElementById('ac');
        const resultSection = document.getElementById('result-section');

        // Modal Elements
        const modal = document.getElementById('aboutModal');
        const aboutBtn = document.getElementById('aboutBtn');
        const closeBtn = document.getElementById('closeModal');

        // Update Form UI based on selection
        function updateFormUI() {
            const type = vehicleSelect.value;
            if (type === 'taxi_by') {
                acContainer.style.display = 'flex';
            } else {
                acContainer.style.display = 'none';
                acCheckbox.checked = false;
            }
        }

        // Main Calculation
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const type = vehicleSelect.value;
            const config = TARIFFS[type];

            // Inputs
            const distance = parseFloat(document.getElementById('distance').value);
            const isMidnight = document.getElementById('midnight').checked;
            const isAC = document.getElementById('ac').checked;
            const waitingMins = parseFloat(document.getElementById('waiting').value) || 0;
            const luggageQty = parseInt(document.getElementById('luggage').value) || 0;

            if (isNaN(distance) || distance < 0) return;

            // 1. Base Fare Calculation
            let baseFare = 0;
            if (distance <= config.minDist) {
                baseFare = config.minFare;
            } else {
                const extraKm = distance - config.minDist;
                baseFare = config.minFare + (extraKm * config.perKm);
            }

            // 2. AC Surcharge
            let acCharge = 0;
            if (type === 'taxi_by' && isAC) {
                acCharge = baseFare * 0.10;
            }

            let runningTotal = baseFare + acCharge;

            // 3. Midnight Charge
            let midnightCharge = 0;
            if (isMidnight) {
                midnightCharge = runningTotal * 0.25;
            }

            // 4. Waiting Charges
            const waitingRate = config.perKm * config.waitingFactor;
            const waitingCharge = waitingMins * waitingRate;

            // 5. Luggage
            const luggageCharge = luggageQty * LUGGAGE_RATE;

            // 6. Final Total (Rounded)
            const finalRaw = runningTotal + midnightCharge + waitingCharge + luggageCharge;
            const finalRounded = Math.round(finalRaw);

            // Render Results
            document.getElementById('res-base').innerText = formatCurrency(baseFare);

            toggleRow('row-ac', isAC, acCharge);
            toggleRow('row-midnight', isMidnight, midnightCharge);

            document.getElementById('res-waiting').innerText = formatCurrency(waitingCharge);
            document.getElementById('res-luggage').innerText = formatCurrency(luggageCharge);
            document.getElementById('res-total').innerText = `₹${finalRounded}`;

            // Show Results
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        function formatCurrency(num) {
            return `₹${num.toFixed(2)}`;
        }

        function toggleRow(rowId, condition, amount) {
            const el = document.getElementById(rowId);
            const span = el.querySelector('span:last-child');
            if (condition) {
                el.classList.remove('hidden');
                span.innerText = formatCurrency(amount);
            } else {
                el.classList.add('hidden');
            }
        }

        // Modal Logic
        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            aboutBtn.focus();
        }

        aboutBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Initial run
        updateFormUI();
