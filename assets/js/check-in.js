import {
    updateCreditsDisplay,
    addCredit
} from './credits.js'; // Import functions from credits.js

// Get the current page's filename
const currentPage = "check-in.html";
// Check and save the corresponding key to local storage
localStorage.setItem('firstpage', currentPage); // Save "firstpage" key
// Log the stored values for verification
console.log('First Page:', localStorage.getItem('firstpage'));


// Get the current date information
const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Retrieve check-in data from localStorage or initialize
const checkInData = JSON.parse(localStorage.getItem("checkInData")) || {};

// Function to create the calendar grid
function createCalendar() {
    const calendar = document.getElementById("calendar");
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.innerHTML = `${day}<i class="fa-solid fa-apple-whole"></i><span>+ 1</span>`;

        if (day === currentDay) {
            dayElement.classList.add("today");

            // Check if today's date is already checked in
            if (isCheckedIn(day)) {
                dayElement.classList.add("checked-in");
                dayElement.innerHTML = `${day}<i class="fa-solid fa-circle-check"></i>`;
                disableCheckInButton();

                // Start countdown only if today's check-in is completed
                startCountdown();
            } else {
                // Add click event for checking in today if not yet checked in
                dayElement.addEventListener("click", () => checkIn(day, dayElement));
            }
        } else if (isCheckedIn(day)) {
            dayElement.classList.add("checked-in");
            dayElement.innerHTML = `${day}<i class="fa-solid fa-circle-check"></i>`;
        }

        calendar.appendChild(dayElement);
    }
}


// Helper function to check if a day is already checked in
function isCheckedIn(day) {
    return checkInData[currentYear] && checkInData[currentYear][currentMonth] && checkInData[currentYear][currentMonth][day];
}

// Check-in function
function checkIn(day, element) {
    element.classList.add("checked-in");

    // Save the check-in data in localStorage
    if (!checkInData[currentYear]) checkInData[currentYear] = {};
    if (!checkInData[currentYear][currentMonth]) checkInData[currentYear][currentMonth] = {};
    checkInData[currentYear][currentMonth][day] = true;

    element.innerHTML = `${day}<i class="fa-solid fa-circle-check"></i>`;

    addCredit()

    localStorage.setItem("checkInData", JSON.stringify(checkInData));
    disableCheckInButton();
    startCountdown();
}

// function checkIn(day, element) {
//     element.classList.add("checked-in");

//     // Save the check-in data in localStorage
//     if (!checkInData[currentYear]) checkInData[currentYear] = {};
//     if (!checkInData[currentYear][currentMonth]) checkInData[currentYear][currentMonth] = {};
//     checkInData[currentYear][currentMonth][day] = true;

//     element.innerHTML = `${day}<i class="fa-solid fa-circle-check"></i>`;

//     addCredit();

//     localStorage.setItem("checkInData", JSON.stringify(checkInData));
//     disableCheckInButton();

//     // Start countdown only after a successful check-in
//     startCountdown();
// }


// Disable the check-in button
function disableCheckInButton() {
    const button = document.getElementById("checkInButton");
    button.classList.add("disabled");
    button.removeEventListener("click", handleCheckInClick);
    button.textContent = "Check In Complete!"; // Set initial button text after check-in
}

// Enable the check-in button
function enableCheckInButton() {
    const button = document.getElementById("checkInButton");
    button.classList.remove("disabled");
    button.textContent = "Check In";
    button.addEventListener("click", handleCheckInClick);
}

function startCountdown() {
    const button = document.getElementById("checkInButton");
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let timeUntilMidnight = tomorrow - now;

    const countdownInterval = setInterval(() => {
        const hours = Math.floor((timeUntilMidnight / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeUntilMidnight / (1000 * 60)) % 60);
        const seconds = Math.floor((timeUntilMidnight / 1000) % 60);

        // Display remaining time on the button
        button.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        timeUntilMidnight -= 1000;

        if (timeUntilMidnight <= 0) {
            clearInterval(countdownInterval);
            button.textContent = "Check In"; // Reset button text at midnight
            enableCheckInButton(); // Enable check-in button for the new day

            // Clear and recreate the calendar for the new day
            document.getElementById("calendar").innerHTML = ""; // Clear the existing calendar
            createCalendar(); // Recreate the calendar to show the new day
        }
    }, 1000);
}

// // tester function 10 seconds
// function startCountdown() {
//     const button = document.getElementById("checkInButton");

//     // Set the countdown to 10 seconds for testing purposes
//     let timeUntilReset = 10000; // 10 seconds in milliseconds

//     const countdownInterval = setInterval(() => {
//         const seconds = Math.floor(timeUntilReset / 1000); // Calculate remaining seconds

//         // Display remaining time on the button in seconds for testing
//         button.textContent = `Next check-in in: ${seconds}s`;

//         timeUntilReset -= 1000;

//         if (timeUntilReset <= 0) {
//             clearInterval(countdownInterval);
//             button.textContent = "Check In"; // Reset button text
//             enableCheckInButton(); // Enable check-in button for testing

//             // Clear and recreate the calendar for the new check-in period
//             document.getElementById("calendar").innerHTML = ""; // Clear the existing calendar
//             createCalendar(); // Recreate the calendar to show reset state
//         }
//     }, 1000); // Run the countdown every second
// }

function displayCurrentMonth(elementId) {
    // Get the current date
    const today = new Date();

    // Get the current month name using toLocaleString
    const currentMonthName = today.toLocaleString('default', {
        month: 'long'
    });

    // Display the month name in the specified element
    document.getElementById(elementId).textContent = currentMonthName;
}

// Handle the check-in button click event
function handleCheckInClick() {
    checkIn(currentDay, document.querySelector(".today"));
}

// Call the function and pass the ID of the element to display the month name
displayCurrentMonth("headMonth");

// localStorage.clear()

// Initialize calendar and add event listener for the check-in button
createCalendar();
document.getElementById("checkInButton").addEventListener("click", handleCheckInClick);

window.addEventListener("DOMContentLoaded", () => {
    updateCreditsDisplay(); // Update credits display on load
});