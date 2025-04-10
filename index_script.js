// Initialize the loggedin status
let loggedin = false;
let userData = {}; const API_BASE_URL = 'https://zdwallet-backend.onrender.com';

document.getElementById('signupBtn').addEventListener('click', function () {
    fbq('track', 'CompleteRegistration');
    console.log("signupbtnclicked");
});
const token = localStorage.getItem("zd_token");
// Get the balance panel and toggle button elements
const balancePanel = document.getElementById('account-wrapper');
const menuButton = document.getElementById('menu-button');
const walletPanel = document.getElementById('wallet-panel');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const walletButton = document.getElementById('wallet-button');
const sidePanel = document.getElementById('profile-menu');

// Function to update the display based on loggedin status
function updateDisplay() {
    if (loggedin) {
        balancePanel.style.display = 'flex'; // Show the balance panel
        menuButton.style.display = 'flex';
        loginButton.style.display = 'none'
        signupButton.style.display = 'none'
    } else {
        balancePanel.style.display = 'none'; // Hide the balance panel
        loginButton.style.display = 'flex';
        signupButton.style.display = 'flex'
        menuButton.style.display = 'none';
    }
}

// Set initial display
updateDisplay();
checkLoginStatus();
menuButton.addEventListener('click', function () {
    PageSwitcher.ShowMenu();
});

loginButton.addEventListener('click', function () {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('signup-section').style.display = 'none';
    PageSwitcher.showAuth(); // Update the display based on the new status
});
signupButton.addEventListener('click', function () {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
    PageSwitcher.showAuth(); // Update the display based on the new status
});
walletButton.addEventListener('click', function () {
    PageSwitcher.ShowWallet(); // Update the display based on the new status
});
//
const PageSwitcher = (() => {
    const landingPage = document.getElementsByClassName('landing-page');
    const authPage = document.getElementsByClassName('auth-page');
    const backButton = document.getElementById('menu-back-button'); // 👈 assume this is your button

    const show = (elements) => {
        Array.from(elements).forEach(el => el.style.display = 'block');
    };

    const hide = (elements) => {
        Array.from(elements).forEach(el => el.style.display = 'none');
    };

    return {
        showLanding: () => {
            show(landingPage);
            hide(authPage);
            if (walletPanel) walletPanel.style.display = 'none';
            if (sidePanel) sidePanel.style.display = 'none';
            if (backButton) backButton.style.display = 'none';
            if (!loggedin) {
                if (loginButton) loginButton.style.display = 'flex';
                if (signupButton) signupButton.style.display = 'flex';
            }
            if (loggedin) {
                if (menuButton) menuButton.style.display = 'flex';
            }
        },
        showAuth: () => {
            hide(landingPage);
            show(authPage);
            if (walletPanel) walletPanel.style.display = 'none';
            if (backButton) backButton.style.display = 'flex';
            if (loginButton) loginButton.style.display = 'none';
            if (signupButton) signupButton.style.display = 'none';
        },
        ShowMenu: () => {
            hide(landingPage);
            hide(authPage);
            if (walletPanel) walletPanel.style.display = 'none';
            if (sidePanel) sidePanel.style.display = 'flex';
            if (backButton) backButton.style.display = 'flex';
            if (menuButton) menuButton.style.display = 'none';
        },
        ShowWallet: () => {
            hide(landingPage);
            hide(authPage);
            if (walletPanel) walletPanel.style.display = 'flex';
            if (sidePanel) sidePanel.style.display = 'none';
            if (backButton) backButton.style.display = 'flex';
            if (menuButton) menuButton.style.display = 'none';
        },
        init: () => {
            if (backButton) {
                backButton.addEventListener('click', () => {
                    PageSwitcher.showLanding();
                    console.log("hey");
                });
            }
        }
    };
})();

// 👇 Initialize menu logic after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("showing spinner");
    ShowSpinner("Just a sec...");
    PageSwitcher.init();
});
window.onload = function () {
    // Everything is fully loaded!
    console.log("Page fully loaded.");
    performYourFunction();
    HideSpinner();
};

function performYourFunction() {
    // Your logic goes here
    console.log("Running function after full load.");
}

// Function to check login status with token
async function checkLoginStatus() {
    if (!token) {
        loggedin = false;
        updateDisplay();
        return;
    }
    ShowSpinner('Retrieving Session')
    try {
        const res = await fetch(`${API_BASE_URL}/auth/check-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token })
        });

        const result = await res.json();

        if (result.loggedIn) {
            loggedin = true;
            await updateUserData();
            await verifyUserTransactions();
            console.log("logged in");
            HideSpinner();
        } else {
            console.log("not logged in");
            loggedin = false;
            HideSpinner();
        }

        updateDisplay();
    } catch (err) {
        HideSpinner();
        console.error("Error checking login status:", err);
        loggedin = false;
        updateDisplay();
    }
}


const updateUserData = async () => {
    try {
        // Make a request to fetch user data (e.g., balance, username, etc.)
        const response = await fetch(`${API_BASE_URL}/user/data`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Pass the token for authentication
            },
        });

        userData = await response.json();

        if (userData && userData.username) {
            // Update the frontend with user data
            updateUI(userData);
        } else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};

const updateUI = (userData) => {
    // Update the user's balance, username, etc.
    const balanceText = document.getElementById('balance-amount');
    const usernameText = document.getElementById('username-text');
    //const profileName = document.getElementById('profile-pic');
    console.log(userData);
    if (balanceText) {
        balanceText.textContent = '₦.' + userData.walletBalance; // Update balance
    }

    if (usernameText) {
        usernameText.textContent = userData.username;
    }

    /*  if (profileName) {
          profileName.querySelector('span').textContent = userData.username; // Update profile name
      }*/
};

// Call checkLogin when the page loads to verify login status and update the UI
window.addEventListener('load', () => {
    console.log("data dist");
    checkLoginStatus();
});

paystackButton = document.getElementById('paystack-button');
paystackButton.addEventListener('click', payWithPaystack);

function payWithPaystack(e) {
    e.preventDefault(); // Prevent page reload

    const amountInput = document.getElementById('fund-amount');
    const amount = parseFloat(amountInput.value);

    // Check if the amount is valid and >= 200
    if (isNaN(amount) || amount < 200) {
        alert('Minimum fund amount is ₦200');
        return; // Cancel the payment
    }

    console.log("paying");

    var handler = PaystackPop.setup({
        key: 'pk_live_05f54ff2d74878733d6d443fa8599c604856a0d0', // Replace with your public key
        email: userData.email,
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: '' + Math.floor(Math.random() * 1000000000 + 1), // Generate reference
        callback: function (response) {
            alert('Payment complete! Reference: ' + response.reference);
            // You can call your backend here to verify the payment
        },
        onClose: function () {
            alert('Transaction was not completed, window closed.');
        },
    });

    handler.openIframe();
}

function ShowSpinner(text = 'Loading...') {
    const popupContainer = document.querySelector('.popup-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    const spinnerText = loadingOverlay.querySelector('span');

    // Update spinner text
    spinnerText.textContent = text;

    // Show overlay and container
    popupContainer.style.display = 'flex';
    loadingOverlay.style.display = 'flex';
}

function HideSpinner() {
    const popupContainer = document.querySelector('.popup-container');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Hide overlay and container
    loadingOverlay.style.display = 'none';
    popupContainer.style.display = 'none';
}
async function verifyUserTransactions() {
    try {
        const response = await fetch('https://zdwallet-backend.onrender.com/api/verify-transactions', {
            method: 'GET'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Transaction updates:', data.updates);
        } else {
            console.error('❌ Verification failed:', data.message);
            alert('Failed to verify transactions. Please try again later.');
        }
    } catch (error) {
        console.error('🔥 Error contacting server:', error);
        alert('Server error while verifying transactions.');
    }
}
