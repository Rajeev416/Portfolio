/**
 * Rajeev Kumar Portfolio — Liquid Glass Edition
 * Section Loader + Interactive Scripts
 * 2026 Recruitment Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons for the navbar and modal
    lucide.createIcons();

    // ════════════════════════════════════════════════════════════════
    // 1. SECTION LOADER — Fetch each section HTML and inject
    // ════════════════════════════════════════════════════════════════
    const sections = [
        { id: 'section-hero', file: 'sections/hero.html' },
        { id: 'section-about', file: 'sections/about.html' },
        { id: 'section-skills', file: 'sections/skills.html' },
        { id: 'section-projects', file: 'sections/projects.html' },
        { id: 'section-experience', file: 'sections/experience.html' },
        { id: 'section-contact', file: 'sections/contact.html' },
    ];

    async function loadAllSections() {
        const results = await Promise.allSettled(
            sections.map(async ({ id, file }) => {
                const container = document.getElementById(id);
                if (!container) return;
                try {
                    const response = await fetch(file);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    container.innerHTML = await response.text();
                    container.classList.remove('section-loading');
                } catch (err) {
                    console.error(`Failed to load ${file}:`, err);
                    container.innerHTML = `<div class="text-center py-16 text-gray-500 text-sm">Section failed to load. Please use a local server.</div>`;
                    container.classList.remove('section-loading');
                }
            })
        );
        // After all sections are loaded, initialize everything
        initializeAll();
    }

    loadAllSections();

    // ════════════════════════════════════════════════════════════════
    // 2. INITIALIZE ALL — Called after sections are injected
    // ════════════════════════════════════════════════════════════════
    function initializeAll() {
        // Re-create icons for all newly loaded sections
        lucide.createIcons();

        initTypingAnimation();
        initScrollReveal();
        initActiveNavLink();
        initCertificationsScroll();
        initCertMarquee();
        initContactForm();
        initProjectModal();
        initMobileNavbar();
    }

    // ════════════════════════════════════════════════════════════════
    // 3. TYPING ANIMATION
    // ════════════════════════════════════════════════════════════════
    function initTypingAnimation() {
        const typingText = document.getElementById('typing-text');
        if (!typingText) return;

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
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // ════════════════════════════════════════════════════════════════
    // 4. SCROLL & REVEAL ANIMATIONS
    // ════════════════════════════════════════════════════════════════
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .stagger-children');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    if (entry.target.classList.contains('stagger-children')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            child.style.transitionDelay = `${index * 100}ms`;
                        });
                    }

                    // If the entry has counters, start them
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        startCounter(counter);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ════════════════════════════════════════════════════════════════
    // 5. ANIMATED COUNTERS
    // ════════════════════════════════════════════════════════════════
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

    // ════════════════════════════════════════════════════════════════
    // 6. ACTIVE NAV LINK (with new pill-style active state)
    // ════════════════════════════════════════════════════════════════
    function initActiveNavLink() {
        const pageSections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveSection = () => {
            const winScroll = window.scrollY;
            let current = '';

            pageSections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (winScroll >= sectionTop - 350) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveSection);
        updateActiveSection();
    }

    // ════════════════════════════════════════════════════════════════
    // 7. CERTIFICATIONS SCROLL TRIGGER
    // ════════════════════════════════════════════════════════════════
    function initCertificationsScroll() {
        const certTrigger = document.getElementById('certifications-trigger');
        const certSection = document.getElementById('certificates-section');

        if (certTrigger && certSection) {
            certTrigger.addEventListener('click', () => {
                certSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }

    // ════════════════════════════════════════════════════════════════
    // 8. CERTIFICATE MARQUEE — JS-driven auto-scroll + drag
    // ════════════════════════════════════════════════════════════════
    function initCertMarquee() {
        const track = document.getElementById('cert-marquee-track');
        if (!track) return;

        track.style.animation = 'none';
        track.style.transform = 'translateX(0px)';

        const SPEED = 0.5;
        let offset = 0;
        let halfWidth = 0;
        let autoScroll = true;
        let isDragging = false;
        let dragLastX = 0;
        let dragDistance = 0;

        function apply() {
            track.style.transform = `translateX(${offset}px)`;
        }

        function wrap() {
            if (halfWidth <= 0) return;
            if (offset <= -halfWidth) offset += halfWidth;
            if (offset > 0) offset -= halfWidth;
        }

        function measure() {
            halfWidth = track.scrollWidth / 2;
        }

        measure();
        window.addEventListener('load', measure);

        (function tick() {
            if (autoScroll && !isDragging) {
                offset -= SPEED;
                wrap();
                apply();
            }
            requestAnimationFrame(tick);
        })();

        const wrapper = track.closest('.cert-marquee-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => { if (!isDragging) autoScroll = false; });
            wrapper.addEventListener('mouseleave', () => { if (!isDragging) autoScroll = true; });
        }

        function startDrag(x) {
            isDragging = true;
            autoScroll = false;
            dragLastX = x;
            dragDistance = 0;
            track.style.cursor = 'grabbing';
        }

        function moveDrag(x) {
            if (!isDragging) return;
            const delta = x - dragLastX;
            dragLastX = x;
            dragDistance += Math.abs(delta);
            offset += delta;
            wrap();
            apply();
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            autoScroll = true;
            track.style.cursor = '';
        }

        track.addEventListener('click', (e) => {
            if (dragDistance > 5) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        track.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.clientX); });
        document.addEventListener('mousemove', (e) => moveDrag(e.clientX));
        document.addEventListener('mouseup', () => endDrag());

        if (wrapper) {
            wrapper.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                offset -= delta * 0.8;
                wrap();
                apply();
            }, { passive: false });
        }

        track.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend', () => endDrag());
    }

    // ════════════════════════════════════════════════════════════════
    // 9. CONTACT FORM (Netlify Forms)
    // ════════════════════════════════════════════════════════════════
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

    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-white"></i><span>Sending...</span>';
            lucide.createIcons();

            const formData = new FormData(contactForm);
            
            try {
                const hostname = window.location.hostname;
                const isLocal = hostname === "localhost" || 
                                hostname.startsWith("127.") || 
                                hostname.startsWith("192.168.") || 
                                hostname.startsWith("10.") || 
                                window.location.protocol === "file:";

                if (isLocal) {
                    console.info("Netlify Form: Local environment detected. Simulating success...");
                    await new Promise(resolve => setTimeout(resolve, 800));
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

    // ════════════════════════════════════════════════════════════════
    // 10. PROJECT MODAL
    // ════════════════════════════════════════════════════════════════
    function initProjectModal() {
        const projectCards = document.querySelectorAll('.project-card');
        const projectModal = document.getElementById('project-modal');
        const modalClose = document.getElementById('modal-close');

        if (!projectModal || !modalClose) return;

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

    // ════════════════════════════════════════════════════════════════
    // 11. MOBILE NAVBAR COLLAPSE
    // ════════════════════════════════════════════════════════════════
    function initMobileNavbar() {
        const mainNav = document.getElementById('main-nav');
        const navContainer = document.getElementById('nav-container');
        const floatingNavLinks = document.getElementById('nav-links');
        const navToggle = document.getElementById('nav-toggle');

        if (!mainNav || !navContainer || !floatingNavLinks || !navToggle) return;

        let lastScrollY = window.scrollY;
        let isCollapsed = false;

        window.addEventListener('scroll', () => {
            if (window.innerWidth < 768) {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100 && currentScrollY > lastScrollY && !isCollapsed) {
                    floatingNavLinks.classList.add('hidden');
                    navToggle.classList.remove('hidden');
                    navToggle.classList.add('block');
                    
                    mainNav.classList.remove('left-1/2', '-translate-x-1/2');
                    mainNav.classList.add('right-6', 'translate-x-0');
                    
                    isCollapsed = true;
                } 
                
                lastScrollY = currentScrollY;
            } else {
                if (isCollapsed) {
                    expandNav();
                }
            }
        });

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
