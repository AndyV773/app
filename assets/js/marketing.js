const form = document.getElementById('marketingForm');
const campaignsList = document.getElementById('campaigns');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const campaignName = document.getElementById('campaignName').value;
    const email = document.getElementById('email').value;
    const budget = document.getElementById('budget').value;
    const description = document.getElementById('description').value;

    document.getElementsByTagName('h4')[0].textContent = "Thank you,";
    document.getElementsByTagName('h5')[0].textContent = "We will get back to you as soon as possible";

    // Array of items to be displayed in separate list items
    const listContents = [
        `Campaign Name: ${campaignName}`,
        `Email: ${email}`,
        `Budget: $${budget}`,
        `Description: ${description}`
    ];

    for (let i = 0; i < listContents.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = listContents[i]; 
        campaignsList.appendChild(listItem);
    }

    // Clear the form fields
    form.reset();
});