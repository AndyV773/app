// credits

// localStorage.removeItem('credits-input');

// Function to get credits from local storage
function getCredits() {
    let storedCredits = localStorage.getItem('credits-input');
    return (storedCredits !== null && !isNaN(parseInt(storedCredits))) 
           ? parseInt(storedCredits) 
           : 1000;
}

// Function to set credits in local storage
function setCredits(value) {
    localStorage.setItem('credits-input', value);
}

// Function to update the display of credits
function updateCreditsDisplay() {
    let credits = getCredits();
    document.getElementById('credits-input').innerText = `${credits}`;
}

// Function to add credits
function addCredit() {
    let credits = getCredits();
    // credits++;
    credits += 10;
    setCredits(credits);
    updateCreditsDisplay(); // Update the display after adding credits
}

// Function to remove credits
function removeCredits(amount) {
    let credits = getCredits();
    credits -= amount; // Deduct the specified amount
    if (credits < 0) credits = 0; // Prevent negative credits
    setCredits(credits);
    updateCreditsDisplay();
}

// Export functions for use in other files
export {getCredits, setCredits, updateCreditsDisplay, addCredit, removeCredits};
