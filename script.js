// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1.8, // More responsive on Mac trackpads
    infinite: false,
})

// Sync Lenis with GSAP ScrollTrigger
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Release Lenis when user swipes inside the work slider (critical for iOS)
const workSliderEl = document.querySelector('.work-slider');
if (workSliderEl) {
    workSliderEl.addEventListener('touchstart', () => lenis.stop(), { passive: true });
    workSliderEl.addEventListener('touchend', () => lenis.start(), { passive: true });
    workSliderEl.addEventListener('touchcancel', () => lenis.start(), { passive: true });
}

// Smooth Scroll for Navbar Links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        lenis.scrollTo(targetId, {
            offset: -50, // Slight offset so the section heading breathes
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });
});

gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const interactiveElements = document.querySelectorAll('[data-cursor="hover"]');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// Avoid hover on touch devices
if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = 'none';
}

// Loader Animation
const tlLoader = gsap.timeline();

tlLoader.to(".loader-text", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    duration: 1.5,
    ease: "power4.inOut"
})
.to(".loader-text", {
    opacity: 0,
    duration: 0.5,
    delay: 0.5
})
.to(".loader", {
    autoAlpha: 0, // Fades out smoothly instead of swiping up
    duration: 1.2,
    ease: "power2.inOut"
}, "-=0.2")

// Hero Animation (Starts after loader)
.to(".hero-subtitle", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    duration: 1,
    ease: "power4.out"
}, "-=0.5")
.to(".hero-title .line", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out"
}, "-=0.8")
.to(".hero-image-container", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    duration: 1.5,
    ease: "power4.out"
}, "-=1");

// Scroll Animations

// Expertise Section Fade Up
gsap.from(".expertise-item", {
    scrollTrigger: {
        trigger: ".expertise",
        start: "top 70%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// Horizontal Scroll for Works (Desktop Only)
const workTrack = document.querySelector('.work-track');

let mm = gsap.matchMedia();

mm.add("(min-width: 1025px)", () => {
    // Use 60% of scroll width so Mac users don't need excessive swipes
    const pinDistance = () => workTrack.scrollWidth * 0.75;
    gsap.to(workTrack, {
        x: () => -(workTrack.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".work-section",
            start: "top top",
            end: pinDistance,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true
        }
    });
});

// Parallax Image inside Work Cards
gsap.utils.toArray('.work-img').forEach(img => {
    gsap.to(img, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Footer Reveal
gsap.from(".huge-text", {
    scrollTrigger: {
        trigger: ".footer",
        start: "top 90%",
        toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
});

// Footer Logo Stamp Animation
gsap.fromTo(".footer-logo", 
    {
        opacity: 0,
        scale: 1.5,
        rotation: 5
    },
    {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%", // Ensures it triggers even on tall monitors
            toggleActions: "play none none reverse" // Replays if scrolled back up
        },
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        delay: 0.1,
        ease: "power3.out" // Subtle and smooth drop-in
    }
);

// YouTube Video Modal Logic
const videoModal = document.getElementById('videoModal');
const youtubeViewer = document.getElementById('youtube-viewer');

window.openYouTube = function(videoId) {
    if (youtubeViewer) {
        youtubeViewer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&loop=1&playlist=${videoId}`;
    }
    videoModal.classList.add('active');
    cursor.classList.remove('hover');
    lenis.stop();
};

window.closeVideoModal = function() {
    videoModal.classList.remove('active');
    if (youtubeViewer) {
        youtubeViewer.src = ""; // Stops the video from playing in background
    }
    lenis.start();
};

// PDF Modal Logic
const pdfModal = document.getElementById('pdfModal');

window.openPdfModal = function(src) {
    const iframe = document.getElementById('pdf-viewer');
    if (src) iframe.src = src;
    pdfModal.classList.add('active');
    lenis.stop();
};

window.closePdfModal = function() {
    pdfModal.classList.remove('active');
    lenis.start();
};

// Contact Modal Logic
const contactModal = document.getElementById('contactModal');

window.openContactModal = function() {
    contactModal.classList.add('active');
    lenis.stop();
};

window.closeContactModal = function() {
    contactModal.classList.remove('active');
    lenis.start();
};

window.sendEmail = function(e) {
    e.preventDefault(); // Prevent page reload
    
    const name = document.getElementById('senderName').value;
    const body = document.getElementById('senderMessage').value;
    
    // Format the email subject and body
    const subject = encodeURIComponent(`New Project Inquiry from ${name}`);
    const message = encodeURIComponent(`${body}\n\n---\nSent via OyeBharatey Portfolio`);
    
    // Trigger the native mail client
    window.location.href = `mailto:sharmabharatcan@gmail.com?subject=${subject}&body=${message}`;
    
    // Close and reset the form
    closeContactModal();
    document.getElementById('contactForm').reset();
};

// ── Work Slider: Mobile Arrows + iOS Touch Fix ──────────────────────
const slider = document.querySelector('.work-slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function getCardScrollWidth() {
    const card = slider && slider.querySelector('.work-card');
    return card ? card.offsetWidth + parseInt(getComputedStyle(card).marginRight || 0) : window.innerWidth * 0.85;
}

if (slider) {
    // Arrow buttons: scroll by exactly one card width
    if (nextBtn) nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: getCardScrollWidth(), behavior: 'smooth' });
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -getCardScrollWidth(), behavior: 'smooth' });
    });

    // iOS custom swipe: detect horizontal intent, hand off to slider
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
        lenis.stop(); // Pause Lenis so it doesn't intercept
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (!isSwiping && dx > dy && dx > 8) {
            isSwiping = true; // Confirmed horizontal — handle natively
        }
        if (isSwiping) {
            e.stopPropagation(); // Don't let Lenis or anything else interfere
        }
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        isSwiping = false;
        lenis.start(); // Resume vertical page scroll
    }, { passive: true });

    slider.addEventListener('touchcancel', () => {
        isSwiping = false;
        lenis.start();
    }, { passive: true });
}
