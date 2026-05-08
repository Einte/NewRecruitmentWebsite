// --- MOBILE MENU TOGGLE ---
const menu = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menu) {
    menu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menu.classList.toggle('is-active');
    });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- IMAGE SLIDER SCRIPT ---
let currentIndex = 0;

function moveSlide(direction) {
    const track = document.getElementById('hero-slider'); 
    const slides = document.querySelectorAll('.slide-link');
    
    if (!track || slides.length === 0) return; // Safety check

    const totalSlides = slides.length;
    currentIndex += direction;

    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }
    
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Auto-slide every 5 seconds
setInterval(() => {
    moveSlide(1);
}, 5000);