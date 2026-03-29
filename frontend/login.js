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

    // --- Login Logic ---
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email');
            const password = document.getElementById('password');
            let isValid = true;

            // Validation
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

            // --- Backend Call ---
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

                        // Store user
                        localStorage.setItem("user", JSON.stringify(data.user));

                        window.location.href = "dashboard.html";
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
