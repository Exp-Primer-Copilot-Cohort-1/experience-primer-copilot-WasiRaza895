// Simplified Portfolio Script - No External Dependencies
let loadingComplete = false;
let customCursor;
let clickEffects = [];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initCustomCursor();
    initLoadingScreen();
    initSimpleAnimations();
    initNavigationEffects();
    initFormEffects();
    initClickEffects();
    initProjectHovers();
    initScrollEffects();
});

// Custom Cursor
function initCustomCursor() {
    customCursor = document.createElement('div');
    customCursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #00ffff, #ff00ff);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        box-shadow: 0 0 20px #00ffff;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(customCursor);

    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(2)';
            customCursor.style.background = 'linear-gradient(135deg, #ff00ff, #ffff00)';
        });
        
        element.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            customCursor.style.background = 'linear-gradient(135deg, #00ffff, #ff00ff)';
        });
    });
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    if (!loadingScreen || !loadingProgress) {
        console.log('Loading elements not found');
        return;
    }
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    loadingComplete = true;
                    startMainAnimations();
                }, 1000);
            }, 500);
        }
        loadingProgress.style.width = progress + '%';
    }, 100);
}

function startMainAnimations() {
    console.log('Starting main animations...');
    
    // Animate hero elements with CSS transitions
    const heroElements = [
        '.hero-title .title-line',
        '.hero-title .title-name', 
        '.hero-title .title-role',
        '.hero-description',
        '.hero-buttons'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}

// Simple Animations without GSAP
function initSimpleAnimations() {
    // Add CSS for initial hidden state
    const style = document.createElement('style');
    style.textContent = `
        .hero-title .title-line,
        .hero-title .title-name,
        .hero-title .title-role,
        .hero-description,
        .hero-buttons {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.6s ease;
        }
        
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-progress {
            transition: width 2s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Add animate-on-scroll class to elements
    const elementsToAnimate = document.querySelectorAll('section:not(.hero-section), .project-card, .stat-item');
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    if (level) {
                        setTimeout(() => {
                            bar.style.width = level + '%';
                        }, 300);
                    }
                });
                
                // Animate stat numbers
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const finalValue = parseInt(stat.textContent);
                    animateNumber(stat, 0, finalValue, 2000);
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Number animation
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (difference * progress));
        
        element.textContent = current + (element.textContent.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Click Effects
function initClickEffects() {
    const clickCanvas = document.getElementById('click-canvas');
    if (!clickCanvas) return;
    
    const ctx = clickCanvas.getContext('2d');
    
    function resizeCanvas() {
        clickCanvas.width = window.innerWidth;
        clickCanvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    document.addEventListener('click', (e) => {
        createClickEffect(e.clientX, e.clientY, ctx);
    });
    
    function createClickEffect(x, y, ctx) {
        const effect = {
            x: x,
            y: y,
            radius: 0,
            maxRadius: 100,
            opacity: 1,
            particles: []
        };
        
        // Create particles
        for (let i = 0; i < 8; i++) {
            effect.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: 0.02
            });
        }
        
        clickEffects.push(effect);
        
        // Animate effect
        const startTime = performance.now();
        function animateEffect(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = elapsed / 800;
            
            if (progress >= 1) {
                const index = clickEffects.indexOf(effect);
                if (index > -1) clickEffects.splice(index, 1);
                return;
            }
            
            effect.radius = effect.maxRadius * progress;
            effect.opacity = 1 - progress;
            
            requestAnimationFrame(animateEffect);
        }
        requestAnimationFrame(animateEffect);
    }
    
    function animateClickEffects() {
        ctx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
        
        clickEffects.forEach(effect => {
            // Draw ripple
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${effect.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw particles
            effect.particles.forEach(particle => {
                if (particle.life > 0) {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 0, ${particle.life})`;
                    ctx.fill();
                    
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life -= particle.decay;
                }
            });
        });
        
        requestAnimationFrame(animateClickEffects);
    }
    
    animateClickEffects();
}

// Navigation Effects
function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Form Effects
function initFormEffects() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4)';
        });
        
        input.addEventListener('blur', (e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #ff00ff, #ffff00)';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #00ff00, #00ffff)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Send Message</span>';
                    submitBtn.style.background = 'var(--gradient-cyber)';
                    form.reset();
                }, 2000);
            }, 1500);
        }
    });
}

// Project Hover Effects
function initProjectHovers() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-20px) rotateX(5deg) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) scale(1)';
            card.style.boxShadow = 'none';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
    });
}

// Button Functions
function exploreUniverse() {
    console.log('Exploring universe...');
    
    // Create multiple click effects
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const event = new MouseEvent('click', {
                clientX: x,
                clientY: y
            });
            document.dispatchEvent(event);
        }, i * 100);
    }
    
    // Scroll to about section
    setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

function viewProjects() {
    console.log('Viewing projects...');
    
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Animate project cards
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'scale(1.1) rotateY(360deg)';
                    setTimeout(() => {
                        card.style.transform = 'scale(1) rotateY(0deg)';
                    }, 500);
                }, index * 100);
            });
        }, 800);
    }
}

// Add CSS for active nav link and button effects
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
        text-shadow: 0 0 15px var(--primary-color);
        background: rgba(0, 255, 255, 0.15) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .btn:hover {
        transform: translateY(-5px) scale(1.05);
    }
    
    .project-card {
        transition: all 0.3s ease;
    }
    
    .floating-avatar {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-30px); }
    }
`;
document.head.appendChild(additionalStyle);

console.log('Portfolio script loaded successfully!');
