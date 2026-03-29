document.addEventListener('DOMContentLoaded', () => {
    // --- Global Helpers ---
    const setupPasswordToggle = (inputId, btnId) => {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;

        const eyeShow = btn.querySelector('#eyeShow');
        const eyeHide = btn.querySelector('#eyeHide');

        btn.addEventListener('click', () => {
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            
            if (eyeShow && eyeHide) {
                eyeShow.style.display = isPassword ? 'none' : 'block';
                eyeHide.style.display = isPassword ? 'block' : 'none';
            }
        });
    };

    // --- Authentication Logic (Signup) ---
    setupPasswordToggle('password', 'togglePassword');

    // Signup Form Validation & Currency Mapping
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const countrySelect = document.getElementById('country');
        const currencyBadge = document.getElementById('currencyBadge');
        
        const currencyMap = {
            'US': 'USD ($)',
            'IN': 'INR (₹)',
            'GB': 'GBP (£)',
            'CA': 'CAD ($)',
            'AU': 'AUD ($)',
            'DE': 'EUR (€)',
            'FR': 'EUR (€)',
            'JP': 'JPY (¥)'
        };

        if (countrySelect && currencyBadge) {
            countrySelect.addEventListener('change', () => {
                const currency = currencyMap[countrySelect.value] || 'Not selected';
                currencyBadge.textContent = currency;
            });
        }

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = signupForm.querySelectorAll('input, select');
            let isValid = true;

            inputs.forEach(input => {
                if (input.required && !input.value) {
                    input.parentElement.classList.add('invalid');
                    isValid = false;
                } else {
                    input.parentElement.classList.remove('invalid');
                }
            });

            if (isValid) {
                alert('Account created successfully! Please log in.');
                window.location.href = 'login.html';
            }
        });
    }
});
