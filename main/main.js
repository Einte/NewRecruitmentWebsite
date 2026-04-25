//image slider script
let currentIndex = 0;

function moveSlide(direction) {
    // FIX 1: Target the TRACK (the ribbon), not the individual link
    const track = document.getElementById('hero-slider'); 
    
    // FIX 2: Count the slide containers (.slide-link) instead of just the images
    const slides = document.querySelectorAll('.slide-link');
    const totalSlides = slides.length;

    currentIndex += direction;

    // Loop logic (This part you wrote was perfect!)
    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }
    
    // Move the track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}


// image auto-slide. this happens every 5 seconds.
setInterval(() => {
    moveSlide(1);
}, 5000);

