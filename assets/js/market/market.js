import {
    updateCreditsDisplay
} from "../credits.js";
import {
    fetchCryptoData
} from './get-data.js';
import {
    displayData,
    toggleSortDirection,
    toggleSortByVolume
} from './display-data.js';

// Get the current page's filename
const currentPage = "market.html";
// Check and save the corresponding key to local storage
localStorage.setItem('firstpage', currentPage); // Save "firstpage" key
// Log the stored values for verification
console.log('First Page:', localStorage.getItem('firstpage'));

// Update credits display on page load
window.addEventListener("DOMContentLoaded", () => {
    updateCreditsDisplay();
});

// Fetch data on page load
fetchCryptoData().then(cryptoData => {
    // Ensure cryptoData is not empty before calling displayData
    if (Object.keys(cryptoData).length > 0) {
        displayData(cryptoData); // Display the initial data
        setupEventListeners(cryptoData); // Setup event listeners
    } else {
        console.error('No crypto data available to display.');
    }
});

// Function to setup event listeners
function setupEventListeners(cryptoData) {
    document.getElementById('sort-button').addEventListener('click', () => {
        toggleSortDirection();
        displayData(cryptoData); // Re-display data after sorting
    });

    document.getElementById('sort-volume-button').addEventListener('click', () => {
        toggleSortByVolume(); // Toggle sorting by volume
        displayData(cryptoData); // Re-display data after sorting by volume
    });
}
