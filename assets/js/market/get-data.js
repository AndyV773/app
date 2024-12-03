import {
    currencyData
} from './currency-data.js';

const apiUrlBinance = 'https://api.binance.com/api/v3/ticker/24hr';
let cryptoData = {};

export async function fetchCryptoData() {
    try {
        const response = await fetch(apiUrlBinance);
        const data = await response.json();
        const currencies = Object.keys(currencyData).map(symbol => `${symbol}USDT`);
        const filteredData = data.filter(item => currencies.includes(item.symbol));

        filteredData.forEach(item => {
            const symbol = item.symbol.replace('USDT', '');
            const price = parseFloat(item.lastPrice);
            const circulatingSupply = currencyData[symbol].circulatingSupply;

            // Store the volume for sorting, and the priceChangePercent for display
            const priceChangePercent = parseFloat(item.priceChangePercent);
            const volume = parseFloat(item.volume);

            cryptoData[symbol] = {
                price,
                priceChangePercent, // Dispalys 24hr price change
                marketCap: price * circulatingSupply, // Works out marketcap based on price and supply
                circulatingSupply,
                volume // Store volume for sorting
            };
        });

        return cryptoData; // Return the fetched crypto data
    } catch (error) {
        console.error('Error fetching data:', error);
        return {}; // Return an empty object on error
    }
}