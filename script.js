// Global variables
let scene, camera, renderer, particles, mouse, raycaster, intersects;
let clickEffects = [];
let loadingComplete = false;
let customCursor;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initParticles();
    initThreeJS();
    initClickEffects();
    initScrollAnimations();
    initNavigationEffects();
    initFormEffects();
    initLoadingScreen();
    initSkillBars();
    initProjectHovers();
    initAudioEffects();
});

// Custom Cursor
function initCustomCursor() {
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
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
        mix-blend-mode: difference;
    `;
    document.body.appendChild(customCursor);

    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX - 10 + 'px';
        customCursor.style.top = e.clientY - 10 + 'px';
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'scale(2)';
            customCursor.style.background = 'linear-gradient(135deg, #ff00ff, #ffff00)';
        });
        
        element.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'scale(1)';
            customCursor.style.background = 'linear-gradient(135deg, #00ffff, #ff00ff)';
        });
    });
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
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
    // Animate hero elements
    gsap.from('.hero-title .title-line', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.2
    });
    
    gsap.from('.hero-title .title-name', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        delay: 0.4,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-title .title-role', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.6
    });
    
    gsap.from('.hero-description', {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 0.8
    });
    
    gsap.from('.hero-buttons .btn', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: 1,
        stagger: 0.2
    });
}

// Particles.js Configuration
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 150,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#00ffff', '#ff00ff', '#ffff00']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 4,
                    size_min: 0.3,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00ffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Three.js 3D Scene
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating geometric shapes
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.OctahedronGeometry(0.8),
        new THREE.TetrahedronGeometry(1),
        new THREE.IcosahedronGeometry(0.8)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xff00ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xffff00, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        })
    ];
    
    // Create floating objects
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        mesh.userData = {
            originalPosition: mesh.position.clone(),
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        scene.add(mesh);
    }
    
    camera.position.z = 10;
    
    // Mouse interaction
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    
    document.addEventListener('mousemove', onMouseMove);
    
    animate3D();
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children);
    
    // Animate objects
    scene.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
            
            // Floating motion
            child.position.y = child.userData.originalPosition.y + Math.sin(Date.now() * 0.002 + child.position.x) * 0.5;
        }
        
        // Mouse interaction
        if (intersects.length > 0 && intersects[0].object === child) {
            child.scale.setScalar(1.2);
            child.material.opacity = 1;
        } else {
            child.scale.setScalar(1);
            child.material.opacity = 0.6;
        }
    });
    
    // Camera movement based on mouse
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Click Effects
function initClickEffects() {
    const clickCanvas = document.getElementById('click-canvas');
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
        for (let i = 0; i < 12; i++) {
            effect.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
        
        clickEffects.push(effect);
        
        // Ripple effect
        gsap.to(effect, {
            duration: 0.8,
            radius: effect.maxRadius,
            opacity: 0,
            ease: 'power2.out'
        });
    }
    
    function animateClickEffects() {
        ctx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
        
        clickEffects.forEach((effect, index) => {
            // Draw ripple
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${effect.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw inner ripple
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.radius * 0.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 0, 255, ${effect.opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw particles
            effect.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 0, ${particle.life})`;
                ctx.fill();
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= particle.decay;
            });
            
            // Remove finished effects
            if (effect.opacity <= 0) {
                clickEffects.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animateClickEffects);
    }
    
    animateClickEffects();
}

// Scroll Animations
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach((section, index) => {
        if (index === 0) return; // Skip hero section
        
        gsap.fromTo(section, {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Parallax effect for hero section
    gsap.to('.hero-visual', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.fromTo(card, {
            y: 60,
            rotationX: -15,
            opacity: 0
        }, {
            y: 0,
            rotationX: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Animate stats
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const value = parseInt(stat.textContent);
        gsap.fromTo(stat, {
            textContent: 0
        }, {
            textContent: value,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%'
            }
        });
    });
}

// Navigation Effects
function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
    const navItems = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
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
        
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                e.target.style.borderColor = '#00ffff';
            } else {
                e.target.style.borderColor = 'rgba(0, 255, 255, 0.3)';
            }
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Create submission effect
        const submitBtn = form.querySelector('button[type="submit"]');
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
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            gsap.to(bar, {
                width: level + '%',
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 85%',
                    once: true
                }
            });
        });
    };
    
    animateSkillBars();
}

// Project Hover Effects
function initProjectHovers() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                rotationY: 5,
                rotationX: 5,
                z: 50,
                boxShadow: '0 30px 60px rgba(0, 255, 255, 0.4)',
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                rotationY: 0,
                rotationX: 0,
                z: 0,
                boxShadow: 'none',
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                duration: 0.1,
                rotationX: rotateX,
                rotationY: rotateY,
                ease: 'power2.out'
            });
        });
    });
}

// Audio Effects (Optional - requires user interaction)
function initAudioEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    function playHoverSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }
    
    // Add sound effects to buttons and links
    document.querySelectorAll('button, .nav-link, .project-btn').forEach(element => {
        element.addEventListener('click', () => {
            if (audioContext.state === 'running') {
                playClickSound();
            }
        });
        
        element.addEventListener('mouseenter', () => {
            if (audioContext.state === 'running') {
                playHoverSound();
            }
        });
    });
    
    // Resume audio context on first user interaction
    document.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, { once: true });
}

// Button Functions
function exploreUniverse() {
    // Create explosion effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            document.dispatchEvent(new MouseEvent('click', {
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            }));
        }, i * 50);
    }
    
    // Scroll to about section
    setTimeout(() => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

function viewProjects() {
    // Animate to projects section with special effect
    const projectCards = document.querySelectorAll('.project-card');
    
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
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

// Window resize handler
window.addEventListener('resize', () => {
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Performance optimization
function optimizePerformance() {
    // Reduce particle count on mobile
    if (window.innerWidth < 768) {
        const particlesConfig = document.getElementById('particles-js');
        if (particlesConfig && pJSDom && pJSDom[0]) {
            pJSDom[0].pJS.particles.number.value = 50;
            pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
    
    // Reduce animation complexity on slower devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
    }
}

// Initialize performance optimizations
optimizePerformance();

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
        text-shadow: 0 0 15px var(--primary-color);
        background: rgba(0, 255, 255, 0.15) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);
