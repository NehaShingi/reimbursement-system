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

    // --- Authentication Logic (Login & Signup) ---
    setupPasswordToggle('password', 'togglePassword');

    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            let isValid = true;

            // Simple validation
            if (!email.value.includes('@')) {
                email.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                email.parentElement.classList.remove('invalid');
            }

            if (password.value.length < 6) {
                password.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                password.parentElement.classList.remove('invalid');
            }

            if (isValid) {
                console.log('Login successful for:', email.value);
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Signup Form Validation & Currency Mapping
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const countrySelect = document.getElementById('country');
        const currencyBadge = document.getElementById('currencyBadge');
        
        const currencyMap = {
            'US': 'USD ($)',
            'IN': 'INR (₹)',
            'UK': 'GBP (£)',
            'CA': 'CAD ($)',
            'AU': 'AUD ($)'
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
                if (!input.value) {
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

    // --- Dashboard Logic ---
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

    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Expense submitted successfully! View status in the pipeline below.');
        });
    }
});
