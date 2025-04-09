// Get all elements we need
const popupContainer = document.querySelector('.popup-container');
const paymentPopup = document.getElementById('payment-popup');
const withdrawOptions = document.getElementById('withdraw-options');

// Optional: Fund and Withdraw buttons outside the popup
const fundButton = document.getElementById('deposit-button');     // Add this ID to your fund button
const withdrawButton = document.getElementById('withdraw-button'); // Add this ID to your withdraw button

// Show Payment Popup
if (fundButton) {
  fundButton.addEventListener('click', () => {
    popupContainer.style.display = 'flex';
    paymentPopup.style.display = 'flex';
    withdrawOptions.style.display = 'none';
  });
}

// Show Withdraw Popup
if (withdrawButton) {
  withdrawButton.addEventListener('click', () => {
    popupContainer.style.display = 'flex';
    withdrawOptions.style.display = 'flex';
    paymentPopup.style.display = 'none';
  });
}

// Handle Close Buttons
document.querySelectorAll('.material-icons').forEach(btn => {
  btn.addEventListener('click', () => {
    // Find the nearest popup-element container
    const popupElement = btn.closest('.popup-element');
    if (popupElement) popupElement.style.display = 'none';

    // Hide the container too
    popupContainer.style.display = 'none';
  });
});