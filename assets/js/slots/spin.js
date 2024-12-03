import {
    getCredits,
    updateCreditsDisplay,
    removeCredits
} from '../credits.js';
import {
    imagesArray,
    prizeArray,
    // rewardsArray
} from './slots-data.js';

// Get the current page's filename
const currentPage = "spin.html";
// Check and save the corresponding key to local storage
localStorage.setItem('firstpage', currentPage); // Save "firstpage" key
// Log the stored values for verification
console.log('First Page:', localStorage.getItem('firstpage'));



// Clear the rewardsArray from local storage
// localStorage.removeItem('rewardsArray');

// Load from localStorage
const rewardsArray = JSON.parse(localStorage.getItem('rewardsArray')) || [];
const rewardsList = JSON.parse(localStorage.getItem('rewardsList')) || [];

const slotMachine = document.getElementById('slot-machine');
const reel = document.getElementById('reel');
const imageHeight = 200; // Height of a single image
const spinButton = document.getElementById('spin-button');
const creditsNeeded = 1;

function startPulsating() {
    spinButton.classList.add('pulsating');
    slotMachine.classList.add('pulsating'); // Add pulsating class to start the effect

    // Simulate running the slot reel (e.g., stop after a certain time)
    setTimeout(stopPulsating, 10000); // Runs for 10 seconds, adjust as needed
}

function stopPulsating() {
    spinButton.classList.remove('pulsating');
    slotMachine.classList.remove('pulsating'); // Remove pulsating class to stop the effect
}

function insertRandomPrize(prizeArray, imagesArray) {
    const randomPrize = prizeArray[Math.floor(Math.random() * prizeArray.length)];
    const insertIndex = imagesArray.length; // Always insert at the end
    imagesArray.push(randomPrize.image); // Add the prize to the end of the array
    return {
        randomPrize,
        insertIndex
    };
}

console.log("Outside start of createReel: ", imagesArray.length);

// Function to create the reel
function createReel() {
    console.log("Start of createReel: ", imagesArray.length);

    // Clear the reel to avoid duplicating images
    reel.innerHTML = '';

    imagesArray.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Slot Image';
        img.style.width = `${imageHeight}px`; // Set image width
        img.style.height = 'auto'; // Maintain aspect ratio
        reel.appendChild(img);
    });

    // Duplicate the images to create the effect of continuous spinning
    for (let i = 0; i < 3; i++) {
        imagesArray.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = 'Slot Image';
            img.style.width = `${imageHeight}px`;
            img.style.height = 'auto';
            reel.appendChild(img);
        });
    }

}

// Spin function with long spin effect
function spinReel(targetIndex) {
    const totalImages = imagesArray.length;
    // const totalImages = reel.children.length; // Includes original and duplicates
    const distance = (totalImages + targetIndex) * imageHeight; // Distance to move

    // Apply a long spin effect with a bit of randomness
    // const duration = Math.random() * 2000 + 6000; // Spin duration between 6s and 8s
    const duration = 8000;
    const easing = 'cubic-bezier(0.33, 1, 0.68, 1)'; // Easing function

    // Apply the styles for spinning
    reel.style.transition = `transform ${duration}ms ${easing}`; // duration, easing
    reel.style.transform = `translateY(-${distance}px)`; // distance

    // winning index after spin
    setTimeout(() => {
        reel.style.transition = 'none'; // Remove transition
        reel.style.transform = `translateY(-${(targetIndex * imageHeight)}px)`; // Snap to target index
    }, duration);

}

// Function to update the countdown display
function updateDisplay(secondsLeft) {
    const days = Math.floor(secondsLeft / (3600 * 24));
    const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    spinButton.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to calculate seconds until the next month
function getSecondsUntilNextMonth() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return Math.floor((nextMonth - now) / 1000);
}

// Function to start the countdown
function startCountdown() {

    console.log('in startCoutdown:', getCredits())
    spinButton.disabled = true

    removeCredits(creditsNeeded); // Removes stored credits from local storage

    // secondsLeft = getSecondsUntilNextMonth();

    let secondsLeft = 15;

    // Store the end time in local storage
    const endTime = Date.now() + secondsLeft * 1000;
    localStorage.setItem('endTime', endTime);

    // Update the display immediately
    updateDisplay(secondsLeft);

    // Countdown interval
    const countdownInterval = setInterval(() => {
        let currentSecondsLeft = Math.floor((endTime - Date.now()) / 1000);

        // Update the display
        updateDisplay(currentSecondsLeft);

        // If the countdown reaches zero, re-enable the button
        if (currentSecondsLeft <= 0) {
            console.log('in currentSecondsLeft:', getCredits());
            clearInterval(countdownInterval);
            checkCredits();
            localStorage.removeItem('endTime'); // Clear storage
        }
    }, 1000);
}

// Function to check for an existing countdown
function checkExistingCountdown() {
    const endTime = localStorage.getItem('endTime');
    console.log('in checkExistingCountdown', getCredits())

    if (!endTime) {
        console.log('in !endTime:', getCredits())
        checkCredits();
    }

    if (endTime) {
        const currentSecondsLeft = Math.floor((endTime - Date.now()) / 1000);
        if (currentSecondsLeft > 0) {
            spinButton.disabled = true; // Disable the button
            updateDisplay(currentSecondsLeft);

            // Start the interval to update the countdown
            const countdownInterval = setInterval(() => {
                const remainingSeconds = Math.floor((endTime - Date.now()) / 1000);
                updateDisplay(remainingSeconds);

                // If the countdown reaches zero, clear the interval
                if (remainingSeconds <= 0) {
                    console.log('in remainingSeconds:', getCredits())
                    clearInterval(countdownInterval);
                    checkCredits();
                    localStorage.removeItem('endTime'); // Clear storage
                }
            }, 1000);
        }
    }
}

// Checks crdits are greater then or equal too creditsNeeded
function checkCredits() {
    console.log('in checkCredits:', getCredits())
    getCredits() >= creditsNeeded ? spinButton.disabled = false : spinButton.disabled = true;
    getCredits() >= creditsNeeded ? spinButton.textContent = 'Spin!' : spinButton.textContent = 'You Need More Credits'; // Set button text
}

function displaySlotMachine(targetIndex, randomPrize) {

    // Allow the browser to apply styles before changing opacity
    setTimeout(() => {
        slotMachine.style.visibility = 'visible'; // Show the element
        slotMachine.style.opacity = '1'; // Fade in

        startPulsating();
        startCountdown(); // Calls to start reel

        setTimeout(() => {
            showPrize(targetIndex, randomPrize);
        }, 9000);

        // After 10 seconds, transition back to hidden
        setTimeout(() => {
            slotMachine.style.opacity = '0'; // Fade out
            slotMachine.addEventListener('transitionend', () => {
                slotMachine.style.visibility = 'hidden'; // Hide the element after fading out
            }, {
                once: true
            });
        }, 10000); // Amount of seconds visable
    }, 20); // slight delay to load
}

const showList = (rewardsList) => {
    const rewardList = document.getElementById("rewards-board-list");
    rewardList.innerHTML = "";

    // Loop through the rewardsList array
    rewardsList.forEach((reward, index) => {
        // Create a new list item for each reward
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="reward-list">
                <span>username</span>
                <span>${reward.value}</span>
                <span>${reward.item}</span>
            </div>`;

        rewardList.appendChild(listItem);

        // Add an <hr> after the list item, except for the last one
        if (index !== rewardsList.length - 1) {
            const hr = document.createElement("hr");
            rewardList.appendChild(hr);
        }
    });
};

// Get the modal
const modal = document.getElementById("myModal");

// When the user clicks on the button, open the modal
function showPrize(targetIndex, randomPrize) {
    let content = document.getElementById("modal-info");
    content.innerHTML = "";

    let modalHeading = document.createElement("h4");
    modalHeading.id = 'modal-heading';

    if (randomPrize.value != 0) {
        modalHeading.innerText = "Congratulations you Won!";
        let spanDiv = document.createElement("div");
        spanDiv.id = "span-div";
        let winningPrizeDiv = document.createElement("div");
        winningPrizeDiv.id = 'winning-prize';
        let prize = imagesArray[targetIndex];

        spanDiv.innerHTML = `
            <span><strong>${randomPrize.value} ${randomPrize.item}</strong></span>        
        `;

        let img = document.createElement("img");
        img.src = prize;
        img.alt = 'Slot Image';
        img.style.width = '-webkit-fill-available'; // Set image width
        img.style.height = 'auto'; // Maintain aspect ratio
        winningPrizeDiv.appendChild(img);

        let modalButton = document.createElement("button");
        modalButton.className = "btn--purple";
        modalButton.id = "modal-button";
        modalButton.innerText = "Collect";

        content.appendChild(modalHeading);
        content.appendChild(spanDiv);
        content.appendChild(winningPrizeDiv);
        content.appendChild(modalButton);
        showList(rewardsList);
    } else {
        modalHeading.innerText = "Sorry better luck next time";
        let losingDiv = document.createElement("div");
        losingDiv.id = 'losing-prize';
        let prize = imagesArray[targetIndex];

        let img = document.createElement("img");
        img.src = prize;
        img.alt = 'Slot Image';
        img.style.width = '-webkit-fill-available'; // Set image width
        img.style.height = 'auto'; // Maintain aspect ratio
        losingDiv.appendChild(img);

        let modalButton = document.createElement("button");
        modalButton.className = "btn--purple";
        modalButton.id = "modal-button";
        modalButton.innerText = "Close";

        content.appendChild(modalHeading);
        content.appendChild(losingDiv);
        content.appendChild(modalButton);
    }

    modal.style.display = "block";
    imagesArray.pop();

    document.getElementById("modal-button").onclick = function () {
        modal.style.display = "none";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // localStorage.removeItem('endTime');
    updateCreditsDisplay(); // Update credits display on load
    // createReel(); // Calls function to create reel
    checkExistingCountdown(); // Check for existing countdown when the page loads
    showList(rewardsList);

    // Event listener for the spin button
    spinButton.addEventListener('click', () => {
        const {
            randomPrize,
            insertIndex
        } = insertRandomPrize(prizeArray, imagesArray);

        createReel(); // Calls function to create reel
        if (randomPrize.value != 0) {
            rewardsArray.push(randomPrize);
            rewardsList.push(randomPrize);
        }
        console.log("LIST", rewardsList);
        console.log("rewardsArray:", rewardsArray);
        console.log("randomPrize:", randomPrize.value);
        // Save to localStorage
        localStorage.setItem('rewardsArray', JSON.stringify(rewardsArray));
        localStorage.setItem('rewardsList', JSON.stringify(rewardsList));

        // Dispatch a custom event to notify rewards.js
        document.dispatchEvent(new CustomEvent('arrayUpdated', { detail: rewardsArray }));

        console.log("current randomPrize reward:", randomPrize);

        // const targetIndex = Math.floor(Math.random() * imagesArray.length); // Random target index
        const targetIndex = insertIndex;
        console.log(targetIndex.value)
        displaySlotMachine(targetIndex, randomPrize);
        spinReel(targetIndex);
        console.log('winning index:', targetIndex, '|', 'value:', imagesArray[targetIndex]);
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});