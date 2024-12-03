const closeButton = document.getElementById('close-button');

// Add an event listener to redirect to the home page
closeButton.addEventListener('click', () => {
    window.location.href = 'log-in.html';
});