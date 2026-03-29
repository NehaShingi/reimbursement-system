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

    // --- Authentication Logic (Login) ---
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
});
