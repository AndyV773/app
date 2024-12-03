const fetchKoinosData = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/koinos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Get the price and market cap
        const price = data.market_data.current_price.usd; // Current price in USD
        const marketCap = data.market_data.market_cap.usd; // Market cap in USD

        // Update the innerHTML of the elements
        document.getElementById('koinos-price').innerHTML = `$${price.toLocaleString()}`; // Format with commas
        document.getElementById('koinos-market-cap').innerHTML = `$${marketCap.toLocaleString()}`; // Format with commas

        // Get the volume data
        const percentageChange = data.market_data.price_change_percentage_24h; // Percentage change
        document.getElementById('koinos-percentage').innerText = `${percentageChange.toFixed(2)}%`;

        // Update arrow and color based on percentage change
        const arrowElement = document.getElementById('koinos-arrow');
        const volume = document.getElementById('koinos-percentage');
        if (percentageChange > 0) {
            arrowElement.classList.add('up');
            arrowElement.classList.remove('down');
            volume.classList.add('up');
            volume.classList.remove('down');
            arrowElement.innerHTML = '<i class="fa-solid fa-caret-up"></i>'; // Up arrow
        } else if (percentageChange < 0) {
            arrowElement.classList.add('down');
            arrowElement.classList.remove('up');
            volume.classList.add('down');
            volume.classList.remove('up');
            arrowElement.innerHTML = '<i class="fa-solid fa-caret-down"></i>'; // Down arrow
        } else {
            arrowElement.innerHTML = '<i class="fa-solid fa-caret-right"></i>'; // Neutral arrow
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchKoinosData();
