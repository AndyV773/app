import {
    mainUrl,
    privateKey,
    koinId,
} from '../kointract/config.js';
import {
    // rewardsArray
} from '../slots/slots-data.js'

// Load from localStorage
const rewardsArray = JSON.parse(localStorage.getItem('rewardsArray')) || [];

const noRewards = document.getElementById("if-no-rewards");
const rewardsList = document.getElementById("rewards-list");
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const closeButton = document.getElementById('close-button');
const modalContent = document.getElementsByClassName("modal-content")[0];
const message = document.getElementById("modal-message");
const confirmAddress = document.getElementById('confirm-address');
const loader = document.getElementById("loader");
const sendButton = document.getElementById("send");

const addressObj = {
    username: "",
    recipient: "",
    amount: 0,
}

let debounceTimeout;

function fetchAddress() {

    sendButton.disabled = true;
    let userInput = document.getElementById("user-input").value.trim();

    clearTimeout(debounceTimeout);

    if (!userInput) {
        document.getElementById("error-message").innerHTML = '';
        confirmAddress.innerHTML = '';
        addressObj.username = "";
        addressObj.recipient = "";
        return;
    }

    debounceTimeout = setTimeout(() => {
        fetch("https://koinos-rest.vercel.app/api/nicknames/" + userInput + "/address")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Invalid response");
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('error-message').innerHTML = "";
                confirmAddress.innerHTML = data.address || "Address not found";
                addressObj.recipient = data.address;
                addressObj.username = userInput;
                sendButton.disabled = false;
                console.log("Data: ", data);
                console.log("recipient: ", addressObj.recipient);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('error-message').innerHTML = "Invalid address";
                confirmAddress.innerHTML = "";
                addressObj.username = "";
                addressObj.recipient = "";
            });
    }, 500);
}

// Utility Functions for Loading Bar
function showLoader() {
    loader.style.display = "block";
    span.style.display = "none";
    modalContent.style.background = "none";
    modalContent.style.border = "none";
    modalContent.style.boxShadow = "none";
}

function hideLoader() {
    loader.style.display = "none";
    span.style.display = "block";
}

// Transfer Function
const transfer = async (reward) => {
    try {

        if (!addressObj.recipient) {
            alert("Please enter a valid address.");
            return;
        }

        // Define signer, provider, and contract
        const provider = new Provider([mainUrl]);
        const signer = Signer.fromWif(privateKey);
        signer.provider = provider;
        const koinContract = new Contract({
            id: koinId,
            abi: utils.tokenAbi,
            provider,
            signer,
        });

        const koin = koinContract.functions;

        let amountInput = 1;

        if (typeof reward.value === 'number' && !isNaN(reward.value)) {
            amountInput = reward.value; // Use reward.value if it is a valid number
            console.log("in if statment", amountInput);
        }
        console.log("outside elsif", amountInput);

        const amountToSend = (parseFloat(amountInput) * 1e8).toFixed(0);

        // Start the transfer process
        showLoader();

        const { transaction } = await koin.transfer({
            from: await signer.getAddress(),
            to: addressObj.recipient,
            value: amountToSend,
        }, { rcLimit: '100000000' });

        const { blockNumber } = await transaction.wait();

        // Success feedback
        modalContent.style.backgroundColor = "#77DD77";
        modalContent.style.border = "1px solid #fafafa";
        message.innerHTML = `Transaction mined<br>
                Block number: <a href="https://koinosblocks.com/block/${blockNumber}" target="_blank">${blockNumber}</a>`;
        console.log(`Transaction mined. Block number: ${blockNumber}`);

        hideLoader();
        addressObj.username = "";
        addressObj.recipient = "";
        return true;
    } catch (error) {
        console.error("Transfer failed:", error);
        modalContent.style.background = "#FF6961";
        modalContent.style.visibility = "visible";
        modalContent.style.border = "1px solid #fafafa";
        message.innerText = `Transfer failed: ${error.message}`;
        hideLoader();
        addressObj.username = "";
        addressObj.recipient = "";
        return false;
    }
};

const addReward = (reward, index, rewardsArray) => {
    const list = document.createElement("li");
    list.classList.add("reward-list-item");
    list.id = `list-item-${index}`;

    let img = document.createElement("img");
    img.src = reward.image;
    img.alt = 'Rewards Image';
    img.style.width = '75px';
    img.style.height = 'auto';
    list.appendChild(img);

    let itemDiv = document.createElement("div");
    itemDiv.className = "item-div";
    itemDiv.innerHTML = `
            <span>
                <strong>${reward.value} ${reward.item}</strong>
            </span>`;
    list.appendChild(itemDiv);

    let claimButton = document.createElement("button");
    claimButton.className = "btn--claim";
    claimButton.id = `claim-button-${index}`;
    claimButton.innerText = "Claim";

    claimButton.addEventListener('click', () => {
        showModal(reward, index, rewardsArray);
    });

    list.appendChild(claimButton);
    rewardsList.appendChild(list);

}

const showModal = (reward, index, rewardsArray) => {

    sendButton.disabled = true;
    const naickname = document.getElementById("nickname");
    const confirmButton = document.getElementById("confirm");
    const cancelButton = document.getElementById("cancel");
    cancelButton.style.display = "none";

    // Reset modal UI
    addressObj.username = "";
    addressObj.recipient = "";
    confirmAddress.innerHTML = "";
    naickname.innerHTML = "";
    modalContent.style.backgroundColor = "#fafafa";
    message.innerText = "Enter your address to claim";
    document.getElementById("user-input").style.display = "block";
    document.getElementById("user-input").value = "";
    sendButton.style.display = "block";
    confirmButton.style.display = "none";
    naickname.innerHTML = `
        <img src="${reward.image}" width="50" height="50" alt="reward:">
            <span><strong>${reward.value} ${reward.item}</strong></span>`;
    modal.style.display = "block";

    sendButton.onclick = () => {
        const errorMessage = document.getElementById("error-message");
        if (!addressObj.recipient) {
            errorMessage.innerText = "Please enter a valid address";
            errorMessage.style.display = "block";
            return;
        }
        errorMessage.style.display = "none";

        sendButton.style.display = "none";
        cancelButton.style.display = "block";
        cancelButton.addEventListener("click", () => {
            showModal(reward, index, rewardsArray);
        })

        naickname.innerHTML = "";
        // Show confirm UI
        if (addressObj.username != addressObj.recipient) {
            naickname.innerHTML = addressObj.username;
        }
        message.innerText = "Confirm Address";
        document.getElementById("user-input").style.display = "none";
        confirmButton.style.display = "flex";

        confirmButton.onclick = async () => {
            confirmButton.style.display = "none";
            cancelButton.style.display = "none";
            document.getElementById("nickname").innerHTML = "";
            confirmAddress.innerHTML = "";
            message.innerText = "";

            try {
                if (await transfer(reward)) {
                    rewardsArray.splice(index, 1);
                    localStorage.setItem('rewardsArray', JSON.stringify(rewardsArray));
                    // Remove the list item from the DOM after a successful transfer
                    const listItem = document.getElementById(`list-item-${index}`);
                    if (listItem) listItem.remove();
                    // Check rewards to update the display
                    checkRewards(rewardsArray);
                    if (rewardsArray.length === 0) {
                        noRewards.innerText = "No Rewards Currently";
                        noRewards.style.display = "block";
                    }
                }
            } catch (error) {
                console.error("Error during transfer, list item not removed:", error);
                // Keep the list item intact on failure
                modalContent.style.backgroundColor = "#FF6961";
                modalContent.style.border = "1px solid #fafafa";
                message.innerText = `Transfer failed: ${error.message}`;
            }
        };
    };
};

const checkRewards = (rewardsArray) => {

    if (rewardsArray.length > 0) {
        noRewards.style.display = "none";
        rewardsList.innerHTML = "";
        rewardsArray.forEach((reward, index) => {
            addReward(reward, index, rewardsArray);
        });
    } else {
        noRewards.style.display = "block";
    }
}


document.addEventListener('DOMContentLoaded', () => {
    checkRewards(rewardsArray);
    console.log(rewardsArray);
    fetchAddress();
});

document.getElementById("user-input").addEventListener("input", fetchAddress);

window.addEventListener('click', handleCloseModal);
// window.addEventListener('touchstart', handleCloseModal);

function handleCloseModal(event) {
    if (event.target === modal && span.style.display === "block") {
        modal.style.display = "none";
    }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

const firstpage = localStorage.getItem('firstpage');
console.log('First Page:', localStorage.getItem('firstpage'));

// Add an event listener to redirect to the home page
closeButton.addEventListener('click', () => {
    window.location.href = firstpage;
});