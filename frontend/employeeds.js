document.addEventListener('DOMContentLoaded', () => {
    // --- Dashboard Logic ---

    // Tab Navigation Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                if (!tabName) return;

                // Update active buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update visible sections
                document.querySelectorAll('.dashboard-section').forEach(sec => {
                    sec.classList.remove('active');
                });
                const targetSection = document.getElementById(tabName + 'Section');
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    // Expense Form submission placeholder
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Expense submitted successfully! View status in the pipeline below.');
        });
    }

    // Upload zone simulation (Optional styling for better UX)
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('click', () => {
            alert('Opening file selector for receipt scanning...');
        });
    }

    // --- Currency Converter Logic ---
    const convertAmount = document.getElementById('convertAmount');
    const convertFrom = document.getElementById('convertFrom');
    const convertTo = document.getElementById('convertTo');
    const convertResult = document.getElementById('convertResult');
    const exchangeRateDisplay = document.getElementById('exchangeRate');

    const rates = {
        USD: { INR: 83.50, EUR: 0.92, USD: 1, GBP: 0.79, JPY: 148.2 },
        INR: { USD: 0.012, EUR: 0.011, INR: 1, GBP: 0.0094, JPY: 1.78 },
        EUR: { USD: 1.09, INR: 91.20, EUR: 1, GBP: 0.86, JPY: 161.5 },
        GBP: { USD: 1.27, INR: 106.1, EUR: 1.17, GBP: 1, JPY: 188.4 },
        JPY: { USD: 0.0067, INR: 0.56, EUR: 0.0062, GBP: 0.0053, JPY: 1 }
    };

    function performConversion() {
        if (!convertAmount || !convertResult) return;
        const amount = parseFloat(convertAmount.value) || 0;
        const from = convertFrom.value;
        const to = convertTo.value;
        const rate = rates[from][to];
        const result = amount * rate;

        convertResult.textContent = `${result.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${to}`;
        exchangeRateDisplay.textContent = `1 ${from} = ${rate.toFixed(2)} ${to}`;
    }

    if (convertAmount) {
        [convertAmount, convertFrom, convertTo].forEach(el => {
            el.addEventListener('input', performConversion);
        });

        // Initial calc
        performConversion();
    }

    // --- Real-time Expense Form Conversion ---
    const currencySelect = document.getElementById('currencySelect');
    const amountInput = document.getElementById('amountInput');
    const categorySelect = document.getElementById('categorySelect');
    const descInput = document.getElementById('descInput');

    // Display elements
    const liveCategory = document.getElementById('liveCategory');
    const liveDesc = document.getElementById('liveDesc');
    const liveOrigAmount = document.getElementById('liveOrigAmount');
    const liveConvAmount = document.getElementById('liveConvAmount');
    const liveRate = document.getElementById('liveRate');

    const symbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', JPY: '¥' };

    function updateLiveConversion() {
        if (!liveConvAmount) return;

        const from = currencySelect.value;
        const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
        const to = 'INR'; // Admin chosen currency (Default INR)
        const rate = rates[from] ? rates[from][to] : 1;
        const result = amount * rate;

        // Update UI with real-time feedback
        if (liveCategory) liveCategory.textContent = descInput.value || 'Expense item';
        if (liveDesc) liveDesc.textContent = categorySelect.options[categorySelect.selectedIndex].text;
        if (liveOrigAmount) liveOrigAmount.textContent = `${symbols[from] || ''} ${amount.toLocaleString()} ${from}`;
        if (liveConvAmount) liveConvAmount.textContent = `₹ ${Math.round(result).toLocaleString()}`;
        if (liveRate) liveRate.textContent = `Rate: 1 ${from} = ₹ ${rate.toFixed(2)}`;
    }

    if (currencySelect) {
        [currencySelect, amountInput, categorySelect, descInput].forEach(el => {
            if (el) el.addEventListener('input', updateLiveConversion);
        });

        // Initialize display
        updateLiveConversion();
    }
});
