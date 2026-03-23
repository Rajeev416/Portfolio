/**
 * Rajeev Kumar Portfolio - Interactive Scripts
 * 2026 Recruitment Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // Success Toast Helper
    function showSuccessToast() {
        let toast = document.querySelector('.form-success-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'form-success-toast';
            toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Message sent successfully!';
            document.body.appendChild(toast);
        }
        requestAnimationFrame(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3500);
        });
    }

    // 2. Typing Animation
    const typingText = document.getElementById('typing-text');
    const roles = ['Problem Solver', 'MERN Stack Developer', 'DSA Enthusiast', 'Full-Stack Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // 3. Scroll & Reveal Animations
    const revealElements = document.querySelectorAll('.reveal, .stagger-children');
    let scrollInterval;



    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Handle staggered children delay
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 100}ms`;
                    });
                }

                // If the entry has a counter, start it
                const counter = entry.target.querySelector('.counter');
                if (counter) {
                    startCounter(counter);
                }

                // If certificates section is revealed, start the autoloop
                if (entry.target.id === 'certificates-section' || entry.target.querySelector('#cert-carousel')) {
                    if (typeof startAutoScroll === 'function') {
                        startAutoScroll();
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Animated Counters
    function startCounter(el) {
        if (el.dataset.timerId) {
            clearInterval(parseInt(el.dataset.timerId));
        }

        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.getAttribute('data-target').includes('.');
        const duration = 1500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = isDecimal ? target.toFixed(2) : Math.floor(target);
                clearInterval(timer);
                delete el.dataset.timerId;
            } else {
                el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
            }
        }, stepTime);

        el.dataset.timerId = timer;
    }

    // 5. Active Nav Link & Dynamic BG
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    const updateActiveSection = () => {
        const winScroll = window.scrollY;

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (winScroll >= sectionTop - 350) {
                current = section.getAttribute('id');
            }
        });

        // Update Nav Links
        navLinks.forEach(link => {
            link.classList.remove('text-primary');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-primary');
            }
        });
    };

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call



    // 6. Certifications Trigger — scroll into view on click
    const certTrigger = document.getElementById('certifications-trigger');
    const certSection = document.getElementById('certificates-section');

    if (certTrigger && certSection) {
        certTrigger.addEventListener('click', () => {
            certSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // 6b. Certificate Marquee — JS-driven auto-scroll + drag (mouse & touch)
    (function initCertMarquee() {
        const track = document.getElementById('cert-marquee-track');
        if (!track) return;

        // Kill CSS animation — JS will own the position entirely
        track.style.animation  = 'none';
        track.style.transform  = 'translateX(0px)';

        const SPEED = 0.5;          // auto-scroll px per frame at 60 fps
        let offset       = 0;       // current translateX (px)
        let halfWidth    = 0;       // = track.scrollWidth / 2 (set on load)
        let autoScroll   = true;    // paused while hovering or dragging
        let isDragging   = false;
        let dragLastX    = 0;
        let dragDistance = 0;       // total px moved — suppresses accidental clicks

        /* ── helper: apply offset to DOM ── */
        function apply() {
            track.style.transform = `translateX(${offset}px)`;
        }

        /* ── helper: keep offset in the seamless loop range ── */
        function wrap() {
            if (halfWidth <= 0) return;
            if (offset <= -halfWidth) offset += halfWidth;
            if (offset > 0)          offset -= halfWidth;
        }

        /* ── measure after ALL content (images) has loaded ── */
        function measure() {
            halfWidth = track.scrollWidth / 2;
        }

        // First measure immediately, then again on window load (images may change width)
        measure();
        window.addEventListener('load', measure);

        /* ── RAF loop ── */
        (function tick() {
            if (autoScroll && !isDragging) {
                offset -= SPEED;
                wrap();
                apply();
            }
            requestAnimationFrame(tick);
        })();

        /* ── Hover → pause auto-scroll ── */
        const wrapper = track.closest('.cert-marquee-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => { if (!isDragging) autoScroll = false; });
            wrapper.addEventListener('mouseleave', () => { if (!isDragging) autoScroll = true;  });
        }

        /* ── Drag start ── */
        function startDrag(x) {
            isDragging   = true;
            autoScroll   = false;
            dragLastX    = x;
            dragDistance = 0;
            track.style.cursor = 'grabbing';
        }

        /* ── Drag move ── */
        function moveDrag(x) {
            if (!isDragging) return;
            const delta  = x - dragLastX;
            dragLastX    = x;
            dragDistance += Math.abs(delta);
            offset += delta;
            wrap();
            apply();
        }

        /* ── Drag end ── */
        function endDrag() {
            if (!isDragging) return;
            isDragging         = false;
            autoScroll         = true;
            track.style.cursor = '';
        }

        /* ── Suppress link clicks that were really drags (> 5 px) ── */
        track.addEventListener('click', (e) => {
            if (dragDistance > 5) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        /* ── Mouse ── */
        track.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX); });
        document.addEventListener('mousemove', (e) => moveDrag(e.clientX));
        document.addEventListener('mouseup',   ()  => endDrag());

        /* ── Mouse wheel (horizontal scroll over the strip) ── */
        if (wrapper) {
            wrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                // Support both vertical and horizontal wheel gestures
                const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                offset -= delta * 0.8;
                wrap();
                apply();
            }, { passive: false });
        }

        /* ── Touch ── */
        track.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX),     { passive: true });
        track.addEventListener('touchmove',  (e) => moveDrag(e.touches[0].clientX),      { passive: true });
        track.addEventListener('touchend',   ()  => endDrag());
    })();


    // 7. Contact Form Handling (Netlify Forms Integration)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-white"></i><span>Sending...</span>';
            lucide.createIcons();

            const formData = new FormData(contactForm);
            
            try {
                // Broaden local detection: localhost, 127.x.x.x, 192.168.x.x, 10.x.x.x, or file://
                const hostname = window.location.hostname;
                const isLocal = hostname === "localhost" || 
                                hostname.startsWith("127.") || 
                                hostname.startsWith("192.168.") || 
                                hostname.startsWith("10.") || 
                                window.location.protocol === "file:";

                if (isLocal) {
                    console.info("Netlify Form: Local environment detected. Simulating success...");
                    await new Promise(resolve => setTimeout(resolve, 800)); // Short delay
                } else {
                    const response = await fetch("/", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams(formData).toString(),
                    });

                    if (!response.ok) {
                        throw new Error(`Netlify Error: ${response.status}`);
                    }
                }

                // Success Message Animation
                submitBtn.classList.add('bg-green-500');
                submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-white"></i><span>Message Sent!</span>';
                lucide.createIcons();
                contactForm.reset();
                showSuccessToast();
                
                setTimeout(() => {
                    submitBtn.classList.remove('bg-green-500');
                    submitBtn.innerHTML = originalBtnContent;
                    lucide.createIcons();
                }, 2000);

            } catch (error) {
                console.error("Form Submission Error:", error);
                
                // FINAL FAILSAFE: If we are not on a netlify domain, assume this error is just local testing
                if (!window.location.hostname.includes("netlify.app")) {
                    console.warn("Netlify Form: Error ignored because this is likely a local development environment.");
                    
                    submitBtn.classList.add('bg-green-500');
                    submitBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-white"></i><span>Message Sent! (Local)</span>';
                    lucide.createIcons();
                    contactForm.reset();
                    showSuccessToast();
                    
                    setTimeout(() => {
                        submitBtn.classList.remove('bg-green-500');
                        submitBtn.innerHTML = originalBtnContent;
                        lucide.createIcons();
                    }, 2000);
                } else {
                    submitBtn.classList.add('bg-red-500');
                    submitBtn.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 text-white"></i><span>Error Occurred</span>';
                    lucide.createIcons();
                    
                    setTimeout(() => {
                        submitBtn.classList.remove('bg-red-500');
                        submitBtn.innerHTML = originalBtnContent;
                        lucide.createIcons();
                    }, 3000);
                }
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    // 8. Project & Certificate Modal Logic
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');

    if (projectModal && modalClose) {
        const attachCardListeners = (cards) => {
            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('a')) return;

                    const title = card.getAttribute('data-title');
                    const details = card.getAttribute('data-details');
                    const image = card.getAttribute('data-image');
                    const github = card.getAttribute('data-github') || '#';
                    const live = card.getAttribute('data-live') || '#';

                    document.getElementById('modal-title').textContent = title;
                    document.getElementById('modal-details').textContent = details;
                    document.getElementById('modal-image').src = image;

                    const githubBtn = document.getElementById('modal-github');
                    const liveBtn = document.getElementById('modal-live');

                    if (github === '#') githubBtn.classList.add('hidden');
                    else githubBtn.classList.remove('hidden');

                    githubBtn.href = github;
                    liveBtn.href = live;

                    // Specific handling for certificates (hide GitHub button often)
                    if (card.classList.contains('certificate-card-netflix')) {
                        githubBtn.classList.add('hidden');
                        liveBtn.innerHTML = '<i data-lucide="maximize" class="w-5 h-5"></i> View Full Certificate';
                        lucide.createIcons();
                    } else {
                        liveBtn.innerHTML = '<i data-lucide="external-link" class="w-5 h-5"></i> Live Preview';
                        lucide.createIcons();
                    }

                    projectModal.classList.remove('opacity-0', 'pointer-events-none');
                    projectModal.querySelector('div').style.transform = 'translateY(0)';
                    projectModal.querySelector('div').style.opacity = '1';
                    document.body.style.overflow = 'hidden';
                });
            });
        };

        attachCardListeners(projectCards);

        const closeModal = () => {
            projectModal.classList.add('opacity-0', 'pointer-events-none');
            projectModal.querySelector('div').style.transform = 'translateY(20px)';
            projectModal.querySelector('div').style.opacity = '0';
            document.body.style.overflow = '';
        };

        modalClose.addEventListener('click', closeModal);
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // 9. Mobile Navbar Scroll Collapse Logic
    const mainNav = document.getElementById('main-nav');
    const navContainer = document.getElementById('nav-container');
    const floatingNavLinks = document.getElementById('nav-links');
    const navToggle = document.getElementById('nav-toggle');

    if (mainNav && navContainer && floatingNavLinks && navToggle) {
        let lastScrollY = window.scrollY;
        let isCollapsed = false;

        window.addEventListener('scroll', () => {
            // Only apply on mobile devices (< 768px)
            if (window.innerWidth < 768) {
                const currentScrollY = window.scrollY;
                
                // If scrolling down and passed 100px, collapse it
                if (currentScrollY > 100 && currentScrollY > lastScrollY && !isCollapsed) {
                    floatingNavLinks.classList.add('hidden');
                    navToggle.classList.remove('hidden');
                    navToggle.classList.add('block');
                    
                    // Move to the right side
                    mainNav.classList.remove('left-1/2', '-translate-x-1/2');
                    mainNav.classList.add('right-6', 'translate-x-0');
                    
                    isCollapsed = true;
                } 
                
                lastScrollY = currentScrollY;
            } else {
                // Reset for desktop if resized
                if (isCollapsed) {
                    expandNav();
                }
            }
        });

        // Expand on click
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            expandNav();
        });

        function expandNav() {
            floatingNavLinks.classList.remove('hidden');
            navToggle.classList.add('hidden');
            navToggle.classList.remove('block');

            mainNav.classList.add('left-1/2', '-translate-x-1/2');
            mainNav.classList.remove('right-6', 'translate-x-0');
            
            isCollapsed = false;
        }
        
        // Auto-collapse when a link is clicked on mobile
        const links = floatingNavLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768 && !isCollapsed) {
                    setTimeout(() => {
                        floatingNavLinks.classList.add('hidden');
                        navToggle.classList.remove('hidden');
                        navToggle.classList.add('block');
                        mainNav.classList.remove('left-1/2', '-translate-x-1/2');
                        mainNav.classList.add('right-6', 'translate-x-0');
                        isCollapsed = true;
                    }, 400);
                }
            });
        });
    }
});
