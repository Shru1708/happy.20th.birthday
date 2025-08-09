// DOM Elements
const musicBtn = document.getElementById('musicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const revealTimelineBtn = document.getElementById('revealTimelineBtn');
const revealLetterBtn = document.getElementById('revealLetterBtn');
const revealGalleryBtn = document.getElementById('revealGalleryBtn');
const revealFinalBtn = document.getElementById('revealFinalBtn');
const timelineSection = document.getElementById('timelineSection');
const letterSection = document.getElementById('letterSection');
const gallerySection = document.getElementById('gallerySection');
const finalSection = document.getElementById('finalSection');
const confettiContainer = document.getElementById('confettiContainer');
const timelineTrack = document.getElementById('timelineTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');

// State
let currentSlide = 0;
let isPlaying = false;
const totalSlides = 5;

// Array of images for the new gallery
const shruImages = [
    './love/Shru/1.jpg',
    './love/Shru/10.jpg',
    './love/Shru/11.jpg',
    './love/Shru/12.JPG',
    './love/Shru/13.jpg',
    './love/Shru/14.PNG',
    './love/Shru/15.jpg',
    './love/Shru/16.JPG',
    './love/Shru/17.JPG',
    './love/Shru/18.jpg',
    './love/Shru/19.jpg',
    './love/Shru/2.jpg',
    './love/Shru/20.JPG',
    './love/Shru/21.PNG',
    './love/Shru/22.JPG',
    './love/Shru/23.PNG',
    './love/Shru/24.JPG',
    './love/Shru/25.JPG',
    './love/Shru/26.jpg',
    './love/Shru/27.PNG',
    './love/Shru/3.JPG',
    './love/Shru/4.PNG',
    './love/Shru/5.PNG',
    './love/Shru/6.jpg',
    './love/Shru/7.JPG',
    './love/Shru/8.JPG',
    './love/Shru/9.PNG',
    './love/Shru/main.JPG'
];

// Music Control
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i><span>Play Our Song</span>';
        musicBtn.classList.remove('playing');
    } else {
        backgroundMusic.play().catch(e => {
            console.log('Audio playback failed:', e);
        });
        musicBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause Music</span>';
        musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// Progressive Section Reveal
function revealSection(section, button) {
    // Hide the button with animation
    button.style.transform = 'translateY(-20px)';
    button.style.opacity = '0';
    
    setTimeout(() => {
        button.style.display = 'none';
        section.classList.remove('hidden');
        section.classList.add('section-reveal');
        
        // Smooth scroll to the new section
        setTimeout(() => {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 300);
    }, 300);
}

// Section Reveal Event Listeners
revealTimelineBtn.addEventListener('click', () => {
    revealSection(timelineSection, revealTimelineBtn);
});

revealLetterBtn.addEventListener('click', () => {
    revealSection(letterSection, revealLetterBtn);
});

revealGalleryBtn.addEventListener('click', () => {
    revealSection(gallerySection, revealGalleryBtn);
    startGalleryCycling(); // Start gallery cycling when revealed
});

revealFinalBtn.addEventListener('click', () => {
    revealSection(finalSection, revealFinalBtn);
    // Trigger confetti animation
    setTimeout(createConfetti, 500);
});

// Confetti Animation
function createConfetti() {
    const colors = ['#ffc1cc', '#ffb3ba', '#e6e6fa', '#ffd1dc', '#d4af37'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 100);
    }
}

// Timeline Carousel
function updateTimeline() {
    const translateX = -currentSlide * 100;
    timelineTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateTimeline();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateTimeline();
}

function goToSlide(index) {
    currentSlide = index;
    updateTimeline();
}

// Timeline Event Listeners
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

// Auto-play timeline (only when timeline is visible)
let timelineInterval;
function startTimelineAutoplay() {
    timelineInterval = setInterval(() => {
        if (!timelineSection.classList.contains('hidden')) {
            nextSlide();
        }
    }, 5000);
}

function stopTimelineAutoplay() {
    if (timelineInterval) {
        clearInterval(timelineInterval);
    }
}

// Start autoplay when timeline is revealed
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startTimelineAutoplay();
        } else {
            stopTimelineAutoplay();
        }
    });
});

timelineObserver.observe(timelineSection);

// New Gallery Cycling Logic
function startGalleryCycling() {
    const galleryBoxes = document.querySelectorAll('.gallery-box');
    galleryBoxes.forEach((box, index) => {
        // Initial sequential image
        let currentImageIndex = index % shruImages.length; // Start with an image based on box index
        const imgElement = box.querySelector('.gallery-image');
        imgElement.src = shruImages[currentImageIndex];
        imgElement.classList.add('fade-in'); // Show initial image

        // Cycle images with a staggered start
        setTimeout(() => {
            setInterval(() => {
                imgElement.classList.remove('fade-in'); // Start fade-out (by removing class)
                setTimeout(() => {
                    currentImageIndex = (currentImageIndex + 1) % shruImages.length;
                    imgElement.src = shruImages[currentImageIndex];
                    imgElement.classList.add('fade-in'); // Fade-in new image
                }, 2000); // Wait for fade-out (2s) before changing src and fading in
            }, 4000); // Change image every 4 seconds
        }, index * 500); // Stagger start times by 0.5 seconds per box
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.timeline-section, .love-letter-section, .gallery-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preload images for better performance
function preloadImages() {
    shruImages.forEach(src => { // Use shruImages for preloading
        const img = new Image();
        img.src = src;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    if (!timelineSection.classList.contains('hidden')) {
        updateTimeline();
    }
    
    // Add entrance animation to header
    setTimeout(() => {
        const header = document.querySelector('.header');
        if (header) {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }
    }, 300);
    
    // Add button hover effects
    document.querySelectorAll('.reveal-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
    }
}

timelineTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

timelineTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

// Prevent default touch behavior on timeline
timelineTrack.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });