import {
    updateCreditsDisplay
} from "./credits.js";
import {
    loadRandomShorts,
    checkScroll
} from "./index/shorts.js"

// Get the current page's filename
const currentPage = "index.html";
// Check and save the corresponding key to local storage
localStorage.setItem('firstpage', currentPage); // Save "firstpage" key
// Log the stored values for verification
console.log('First Page:', localStorage.getItem('firstpage'));

let slideIndex = 0;

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 3000); // Change image every 2 seconds
}

window.addEventListener("DOMContentLoaded", () => {
    updateCreditsDisplay(); // Update credits display on load

    showSlides()
    loadRandomShorts();
    setInterval(loadRandomShorts, 500000);

    document.getElementById('video-scroll-container').addEventListener('scroll', checkScroll);

})
