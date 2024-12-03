const fetchRateGecko = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,koinos&vs_currencies=usd');

        // Check response headers for rate limit info
        const limit = response.headers.get('X-RateLimit-Limit');
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const reset = response.headers.get('X-RateLimit-Reset');

        console.log(`Limit: ${limit}, Remaining: ${remaining}, Resets at: ${new Date(reset * 1000)}`);

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data G:', error);
    }
};

fetchRateGecko();

async function fetchRateBinance() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const rateLimits = data.rateLimits;

        console.log('API Rate Limits:');
        rateLimits.forEach(limit => {
            console.log(`- Limit Type: ${limit.rateLimitType}`);
            console.log(`  Interval: ${limit.interval}`);
            console.log(`  Limit: ${limit.limit}`);
        });
    } catch (error) {
        console.error('Error fetching data B:', error);
    }
}

fetchRateBinance();