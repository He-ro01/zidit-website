document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const passwordInput = document.getElementById("signup_password");
    const requirementsDiv = document.getElementById("requirements");

    // ===================== Password Live Check =====================
    passwordInput.addEventListener("focus", () => {
        requirementsDiv.style.display = "block";
    });

    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.trim() === "") {
            requirementsDiv.style.display = "none";
        }
    });

    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        updateRequirement("at-least-8-characters", password.length >= 8);
        updateRequirement("one-uppercase-letter", /[A-Z]/.test(password));
        updateRequirement("one-number", /[0-9]/.test(password));
        updateRequirement("one-special-character", /[!@#$%^&*(),.?\":{}|<>]/.test(password));
    });

    function updateRequirement(id, isValid) {
        const el = document.getElementById(id);
        const checkbox = el.querySelector("input");
        const label = el.querySelector("span");

        checkbox.checked = isValid;
        el.classList.toggle("met", isValid);
        el.classList.toggle("unmet", !isValid);
        checkbox.style.borderColor = isValid ? "#00cc66" : "#FFD580";
        label.style.color = isValid ? "#00cc66" : "#FFD580";
    }

    function isPasswordValid(password) {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?\":{}|<>]/.test(password)
        );
    }

    function showError(inputId, message) {
        const section = document.getElementById(`${inputId}-section`);
        const errorWrapper = section.querySelector(".error-text-wrapper");
        errorWrapper.querySelector("span").textContent = message;
        errorWrapper.style.display = "block";
    }

    function hideError(inputId) {
        const section = document.getElementById(`${inputId}-section`);
        const errorWrapper = section.querySelector(".error-text-wrapper");
        errorWrapper.querySelector("span").textContent = "";
        errorWrapper.style.display = "none";
    }

    // ===================== TOGGLER: Button Spinner =====================
    function toggleButtonLoading(button, isLoading) {
        const spinner = button.querySelector(".spinner");
        const span = button.querySelector("span");
        if (spinner && span) {
            spinner.style.display = isLoading ? "inline-block" : "none";
            span.style.display = isLoading ? "none" : "inline";
            button.disabled = isLoading;
        }
    }

    // ===================== SIGNUP =====================
    signupForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const signupButton = signupForm.querySelector("button[type='submit']");
        toggleButtonLoading(signupButton, true);

        const fieldsToReset = [
            "name", "surname", "mobile-number",
            "email", "username", "password", "confirm-password"
        ];
        fieldsToReset.forEach(id => hideError(id));

        const name = document.getElementById("signup-name").value.trim();
        const surname = document.getElementById("signup-surname").value.trim();
        const mobileInput = document.getElementById("signup-mobile-number").value.trim();
        const email = document.getElementById("signup_email").value.trim();
        const username = document.getElementById("signup_username").value.trim();
        const password = passwordInput.value;
        const confirmPassword = document.getElementById("confirm_password").value;

        if (password !== confirmPassword) {
            showError("confirm-password", "Passwords do not match!");
            toggleButtonLoading(signupButton, false);
            return;
        }

        if (!isPasswordValid(password)) {
            showError("password", "Password does not meet all requirements!");
            toggleButtonLoading(signupButton, false);
            return;
        }

        let formattedMobileNumber = mobileInput.startsWith("0")
            ? "234" + mobileInput.slice(1)
            : mobileInput;

        try {
            const apiKey = "06fe1e1d6ace4db98abd42b19f2d5ecb";
            const emailCheckRes = await fetch(
                `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`
            );
            const emailData = await emailCheckRes.json();

            if (emailData.deliverability !== "DELIVERABLE") {
                showError("email", "Email is not deliverable.");
                toggleButtonLoading(signupButton, false);
                return;
            }

            const data = {
                name, surname,
                mobileNumber: formattedMobileNumber,
                username, email, password
            };

            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem("zd_token", result.token);
                alert("Signup successful!");
                console.log("Token:", result.token);
                signupForm.reset();
                location.reload();
            } else {
                showError("username", result.error || "Signup failed.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Something went wrong!");
        }

        toggleButtonLoading(signupButton, false);
    });

    // ===================== LOGIN =====================
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginButton = loginForm.querySelector("button[type='submit']");
        toggleButtonLoading(loginButton, true);

        const data = {
            email: document.getElementById('login_email').value,
            password: document.getElementById('login_password').value
        };

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('zd_token', result.token);
                alert('Login successful');
                console.log('User:', result.user);
                loginForm.reset();
                location.reload();
            } else {
                alert(result.message || 'Login failed.');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Something went wrong!');
        }

        toggleButtonLoading(loginButton, false);
    });

    // ===================== LOGOUT =====================
    document.getElementById('logout-button')?.addEventListener('click', () => {
        localStorage.removeItem('zd_token');
        sessionStorage.removeItem('zd_token');
        location.reload();
    });
});
