// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Header scroll effect
const SCROLL_HEADER_THRESHOLD = 60;
const ACTIVE_LINK_OFFSET = 100;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > SCROLL_HEADER_THRESHOLD) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const setActiveLink = () => {
    const scrollY = window.pageYOffset + ACTIVE_LINK_OFFSET;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', setActiveLink, { passive: true });

// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinksEl = document.querySelector('.nav-links');

const closeMobileMenu = () => {
    navLinksEl.classList.remove('open');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-expanded', 'false');
};

mobileMenu.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
        closeMobileMenu();
    }
});

// Pricing toggle — monthly / annual
const monthlyToggle = document.getElementById('monthlyToggle');
const annualToggle = document.getElementById('annualToggle');
const priceAmounts = document.querySelectorAll('.price-amount[data-monthly]');

const setPricingPeriod = (period) => {
    priceAmounts.forEach(el => {
        el.textContent = el.dataset[period];
    });
    monthlyToggle.classList.toggle('active', period === 'monthly');
    annualToggle.classList.toggle('active', period === 'annual');
};

monthlyToggle.addEventListener('click', () => setPricingPeriod('monthly'));
annualToggle.addEventListener('click', () => setPricingPeriod('annual'));

// Contact form submission
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.reset();
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
});

// Intersection Observer for fade-up animations
const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, fadeObserverOptions);

document.querySelectorAll('.problem-card, .module, .market-card, .timeline-item, .pricing-card').forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
});

// Counter animation for stats
const animateCounter = (element, duration = 1800) => {
    const originalText = element.textContent.trim();
    const numMatch = originalText.match(/[\d,]+/);
    if (!numMatch) return;

    const numericStr = numMatch[0].replace(/,/g, '');
    const target = parseInt(numericStr, 10);
    if (isNaN(target)) return;

    const numIndex = originalText.indexOf(numMatch[0]);
    const prefix = originalText.slice(0, numIndex);
    const suffix = originalText.slice(numIndex + numMatch[0].length);
    const useCommas = numMatch[0].includes(',');

    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = prefix + (useCommas ? target.toLocaleString() : target) + suffix;
            clearInterval(timer);
        } else {
            const val = Math.floor(current);
            element.textContent = prefix + (useCommas ? val.toLocaleString() : val) + suffix;
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number, .impact-stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

