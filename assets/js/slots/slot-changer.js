document.addEventListener('DOMContentLoaded', () => {
    const monthlyButton = document.getElementById('monthly-button');
    const dailyButton = document.getElementById('daily-button');
    const slot1 = document.getElementById('slot-1');
    const slot2 = document.getElementById('slot-2');
    const masterSlot = document.getElementById("master-slot-div");

    function setActiveButton(activeButton, inactiveButton) {
        activeButton.classList.add('active-button');
        inactiveButton.classList.remove('active-button');
    }

    function switchToSlot1() {
        slot1.classList.add('active-slot', 'left');
        slot2.classList.remove('active-slot', 'left');
        masterSlot.style.height = "1000px";

        setTimeout(() => {
            slot2.classList.remove('fade-out'); // Reset fade-out class after transition
        }, 1000); // Match transition duration (0.8s)

        // Update button styles
        setActiveButton(monthlyButton, dailyButton);
    }

    function switchToSlot2() {
        slot2.classList.add('active-slot', 'right');
        slot1.classList.remove('active-slot', 'right');
        masterSlot.style.height = "550px";

        setTimeout(() => {
            slot1.classList.remove('fade-out'); // Reset fade-out class after transition
        }, 800); // Match transition duration (0.8s)

        // Update button styles
        setActiveButton(dailyButton, monthlyButton);
    }

    // Event listeners
    monthlyButton.addEventListener('click', switchToSlot1);
    dailyButton.addEventListener('click', switchToSlot2);
});
