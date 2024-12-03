const closeButton = document.getElementById('close-button');
const firstpage = localStorage.getItem('firstpage');
console.log('First Page:', localStorage.getItem('firstpage'));

// Add an event listener to redirect to the home page
closeButton.addEventListener('click', () => {
    window.location.href = firstpage;
});

document.getElementById('signInForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // Simple validation
    if (username === 'user' && password === 'pass') {
        message.style.color = 'green';
        message.textContent = 'Sign in successful!';
    } else {
        message.style.color = 'red';
        message.textContent = 'Invalid username or password.';
    }
});
