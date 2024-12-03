const menuButton = document.getElementById('burger-menu-button');
const menu = document.getElementById('burger-menu');
const closeButton = document.getElementById('close-button');
const main = document.getElementById('main');


document.addEventListener('DOMContentLoaded', () => {
    const myElement = document.getElementById('burger-menu');
    myElement.style.display = 'none'; // Change display to flex when loaded
});

// Open the menu
menuButton.addEventListener('click', () => {
    menu.style.display = 'flex'; // Show the menu
    menu.style.right = 'auto';
    setTimeout(() => {
        menu.classList.add('open'); // Apply the sliding effect
        document.body.classList.add("no-scroll"); // Disable body scroll
    }, 10); // Slight delay to ensure the display change is applied
});

// Close the menu
closeButton.addEventListener('click', () => {
    main.style.display = '';
    menu.classList.remove('open'); // Remove the sliding effect
    setTimeout(() => {
        menu.style.right = 'auto';
        menu.style.display = 'none'; // Hide the menu after the animation
        document.body.classList.remove("no-scroll"); // Enable background scroll
    }, 300); // Match this duration to the CSS transition time
});

// Close the menu when clicking outside of it
window.addEventListener('click', (event) => {
    if (menu.classList.contains('open') && !menu.contains(event.target) && event.target !== menuButton) {
        menu.classList.remove('open');
        setTimeout(() => {
            menu.style.display = 'none'; // Hide the menu
        }, 300); // Match this duration to the CSS transition time
    }
});