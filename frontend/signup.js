document.addEventListener('DOMContentLoaded', () => {

    // --- Password Toggle ---
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

    setupPasswordToggle('password', 'togglePassword');

    // --- Signup Logic ---
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

        // Country → Currency
        if (countrySelect && currencyBadge) {
            countrySelect.addEventListener('change', () => {
                const currency = currencyMap[countrySelect.value] || 'Not selected';
                currencyBadge.textContent = currency;
            });
        }

        signupForm.addEventListener('submit', async (e) => {
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
    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful 🎉");

            localStorage.setItem("user", JSON.stringify(data.user));

            const role = data.user.role;

            if (role === "admin") {
                window.location.href = "adminds.html";
            } else if (role === "manager") {
                window.location.href = "managerds.html";
            } else {
                window.location.href = "employeeds.html";
            }

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
        alert("Server error ❌");
    }
}
        });
    }
});