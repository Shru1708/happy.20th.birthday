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
    './love/Shru/1.jpg', './love/Shru/2.jpg', './love/Shru/3.JPG', './love/Shru/4.PNG', './love/Shru/5.PNG', './love/Shru/6.jpg',
    './love/Shru/7.JPG', './love/Shru/8.JPG', './love/Shru/9.PNG', './love/Shru/10.jpg', './love/Shru/11.jpg', './love/Shru/12.JPG',
    './love/Shru/13.jpg', './love/Shru/14.PNG', './love/Shru/15.jpg', './love/Shru/16.JPG', './love/Shru/17.JPG', './love/Shru/18.jpg',
    './love/Shru/19.jpg', './love/Shru/20.JPG', './love/Shru/21.PNG', './love/Shru/22.JPG', './love/Shru/23.PNG', './love/Shru/24.JPG',
    './love/Shru/25.JPG', './love/Shru/26.jpg', './love/Shru/27.PNG', './love/Shru/main.JPG'
].sort((a, b) => {
    // Handle 'main.JPG' by placing it at the end
    if (a.includes('main.JPG') && !b.includes('main.JPG')) return 1;
    if (b.includes('main.JPG') && !a.includes('main.JPG')) return -1;
    if (a.includes('main.JPG') && b.includes('main.JPG')) return 0; // Both are main.JPG, keep original order

    // Extract numbers from filenames for sorting for other images
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
});

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
    console.log('revealLetterBtn clicked');
    revealSection(letterSection, revealLetterBtn);
});

revealGalleryBtn.addEventListener('click', () => {
    console.log('revealGalleryBtn clicked');
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
let currentBatchIndex = 0;
const batchSize = 6;
const displayDuration = 5000; // 5 seconds
const animationDuration = 1500; // 2 seconds

function displayBatch() {
    const galleryImages = document.querySelectorAll('.gallery-box .gallery-image');
    const totalImagesInShru = shruImages.length;

    // Remove fade-in class from all images to start fade-out
    galleryImages.forEach(img => {
        img.classList.remove('fade-in');
    });

    // Wait for fade-out to complete before changing images and fading in new ones
    setTimeout(() => {
        const startIndex = currentBatchIndex * batchSize;

        galleryImages.forEach((imgElement, i) => {
            const imageIndex = startIndex + i;
            if (imageIndex < totalImagesInShru) {
                imgElement.src = shruImages[imageIndex];
                imgElement.classList.add('fade-in');
            } else {
                // If there are fewer than 6 images in the last batch, clear the remaining boxes
                imgElement.src = ''; // Clear image source
                imgElement.classList.remove('fade-in'); // Ensure it's not visible
            }
        });

        currentBatchIndex++;
        // Loop back to the first batch if all images have been displayed
        if (startIndex + batchSize >= totalImagesInShru) {
            currentBatchIndex = 0;
        }
    }, animationDuration);
}

function startGalleryCycling() {
    displayBatch(); // Display the first batch immediately
    setInterval(displayBatch, displayDuration); // Then cycle batches every 5 seconds
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