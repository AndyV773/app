import {
    shortsIds
} from "./short-ids.js"

export function loadRandomShorts() {
    const container = document.getElementById('video-content');
    container.innerHTML = '';

    for (let i = 0; i < 5; i++) {

        const randomIndex = Math.floor(Math.random() * shortsIds.length);
        const videoId = shortsIds[randomIndex];

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.className = 'shorts-iframe';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        container.appendChild(iframe);
    }

}

// Function to load more content when scrolling
export function loadMoreContent() {
    const content = document.getElementById('video-content');

    const randomIndex = Math.floor(Math.random() * shortsIds.length);
    const videoId = shortsIds[randomIndex];

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.className = 'shorts-iframe';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    content.appendChild(iframe);
}

// Detect when the user scrolls to the end of the container
export function checkScroll() {
    const container = document.getElementById('video-scroll-container');
    const content = document.getElementById('video-content');

    // When user scrolls to the right end, load more content
    if (container.scrollLeft + container.clientWidth >= content.scrollWidth - 50) {
        loadMoreContent();
    }
}

// Initial load of content
loadMoreContent(); // Start by adding one item at the end
