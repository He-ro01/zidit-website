
// Handling switching between Login and Signup
document.getElementById('switch-to-signup').addEventListener('click', () => {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
});

document.getElementById('switch-to-login').addEventListener('click', () => {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
});


//
document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the 'toggle-password' class
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get the sibling password input
            const passwordInput = button.previousElementSibling;

            // Toggle the input type between password and text
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                button.querySelector('i').textContent = "visibility"; // Change the icon
            } else {
                passwordInput.type = "password";
                button.querySelector('i').textContent = "visibility_off"; // Change the icon back
            }
        });
    });
});
