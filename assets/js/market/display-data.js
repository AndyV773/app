let cryptoData = {};
let sortDirection = 'desc'; // Default sort direction
let sortByVolume = false; // Track sorting by volume


export function formatVolumePercentage(priceChangePercent) {
    return `${priceChangePercent.toFixed(2)}%`; // Format as percentage
}

export function formatMarketCap(marketCap) {
    if (marketCap >= 1e12) {
        return (marketCap / 1e12).toFixed(2) + 'T'; // Trillions
    } else if (marketCap >= 1e9) {
        return (marketCap / 1e9).toFixed(2) + 'B'; // Billions
    } else if (marketCap >= 1e6) {
        return (marketCap / 1e6).toFixed(2) + 'M'; // Millions
    } else {
        return marketCap.toFixed(2); // Otherwise, just format as is
    }
}

export function displayData(data) {
    cryptoData = data; // Update the global cryptoData variable
    const dataWithRanking = Object.entries(cryptoData)
        .map(([symbol, data]) => ({
            symbol,
            ...data
        }));

    // Create a ranking based on market cap
    const rankingMap = dataWithRanking
        .slice()
        .sort((a, b) => b.marketCap - a.marketCap)
        .map((data, index) => ({
            symbol: data.symbol,
            rank: index + 1
        }))
        .reduce((acc, curr) => {
            acc[curr.symbol] = curr.rank;
            return acc;
        }, {});

    const sortedData = dataWithRanking.sort((a, b) => {
        if (sortByVolume) {
            return sortDirection === 'desc' ? b.priceChangePercent - a.priceChangePercent : a.priceChangePercent - b.priceChangePercent;
        }
        return sortDirection === 'desc' ? b.marketCap - a.marketCap : a.marketCap - b.marketCap;
    });

    const table = document.getElementById('crypto-data-table');
    table.innerHTML = '';

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>#</th>
        <th>Coin</th>
        <th>Price</th>
        <th>24HR</th>
        <th>Market Cap</th>
    `;
    table.appendChild(headerRow);

    // Add ranking and display data
    sortedData.forEach(data => {
        const {
            symbol,
            price,
            priceChangePercent,
            marketCap,
        } = data;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rankingMap[symbol]}</td> <!-- Use market cap ranking -->
            <td>${symbol}</td>
            <td>$${price.toFixed(2)}</td>
            <td>
                <span id="${symbol}-arrow"></span>
                <span id="${symbol}-percentage">${formatVolumePercentage(priceChangePercent)}</span>           
            </td>
            <td>$${formatMarketCap(marketCap)}</td>
        `;
        table.appendChild(row);

        // Update arrow and color based on priceChangePercent
        const arrowElement = document.getElementById(`${symbol}-arrow`);
        const volElement = document.getElementById(`${symbol}-percentage`);

        if (priceChangePercent > 0) {
            arrowElement.classList.add('up');
            arrowElement.classList.remove('down');
            volElement.classList.add('up');
            volElement.classList.remove('down');
            arrowElement.innerHTML = '<i class="fa-solid fa-caret-up"></i>'; // Up arrow
        } else if (priceChangePercent < 0) {
            arrowElement.classList.add('down');
            arrowElement.classList.remove('up');
            volElement.classList.add('down');
            volElement.classList.remove('up');
            arrowElement.innerHTML = '<i class="fa-solid fa-caret-down"></i>'; // Down arrow
        } else {
            arrowElement.classList.add('neutral');
            arrowElement.classList.remove('up');
            arrowElement.classList.remove('down');
            volElement.classList.add('neutral');
            volElement.classList.remove('up');
            volElement.classList.remove('down');
            arrowElement.innerHTML = '<i class="fa-solid fa-caret-right"></i>'; // Neutral arrow
        }
    });
}

export function toggleSortDirection() {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
}

export function toggleSortByVolume() {
    sortByVolume = !sortByVolume; // Toggle the sort by volume
    displayData(cryptoData);
}