// --- Scroll Reset ---
window.onbeforeunload = function () { window.scrollTo(0, 0); }

// --- Platform Detection ---
let isMobileDevice = false;
function detectPlatform() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    isMobileDevice = isMobile;
    if (isMobile) {
        document.body.classList.add('mobile-platform');
        document.body.classList.remove('desktop-platform');
    } else {
        document.body.classList.add('desktop-platform');
        document.body.classList.remove('mobile-platform');
    }
}

// --- 1. Interactive Ambient Particles Background ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 25; // Greatly reduced for lightweight loading
let mouse = { x: null, y: null, radius: 160 };

window.addEventListener('mousemove', (e) => {
    if (isMobileDevice) return; // Save mouse move processing on mobile
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    if (isMobileDevice) return; // Do not initialize particles on mobile to save performance
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    if (isMobileDevice) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return; // Stop animation loop on mobile entirely
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

function connectParticles() {
    let maxDistance = 110;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.12})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
        
        // Connect to Mouse Coordinate
        if (mouse.x !== null && mouse.y !== null) {
            let dx = particles[a].x - mouse.x;
            let dy = particles[a].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let opacity = 1 - (distance / mouse.radius);
                ctx.strokeStyle = `rgba(20, 184, 166, ${opacity * 0.22})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', () => {
    detectPlatform();
    initParticles();
});

// --- 2. Scroll Reveal Animations (Intersection Observer) ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// --- 3. Modal Interactions ---
const modal = document.getElementById("cert-modal");
const modalImg = document.getElementById("full-cert-img");
const captionText = document.getElementById("caption");

function openModal(element) {
    const img = element.querySelector('img');
    const title = element.querySelector('h4');
    
    modalImg.src = img.src;
    captionText.innerHTML = title.innerText;
    modal.classList.add("open");
}

function closeModal() {
    modal.classList.remove("open");
}

// Modal event listeners
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('close-modal')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
    }
});

// --- 4. Mobile Scroll Header Hiding ---
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    if (!isMobileDevice) return; // Keep sticky on desktop
    const header = document.querySelector('header');
    if (window.scrollY > lastScrollY && window.scrollY > 50) {
        // Scrolling down
        header.classList.add('nav-hidden');
    } else {
        // Scrolling up
        header.classList.remove('nav-hidden');
    }
    lastScrollY = window.scrollY;
});

// --- Initialization ---
window.onload = () => {
    detectPlatform();
    initParticles();
    animateParticles();
    initScrollReveal();
};
