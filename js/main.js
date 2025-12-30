/* ========================================
   Atlas Utvikling AS - Main JavaScript
   Premium, refined interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
});

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const body = document.body;

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', function() {
        const isActive = menuToggle.classList.contains('menu-toggle--active');

        menuToggle.classList.toggle('menu-toggle--active');
        mobileMenu.classList.toggle('mobile-menu--active');

        // Prevent body scroll when menu is open
        if (!isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('menu-toggle--active');
            mobileMenu.classList.remove('mobile-menu--active');
            body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--active')) {
            menuToggle.classList.remove('menu-toggle--active');
            mobileMenu.classList.remove('mobile-menu--active');
            body.style.overflow = '';
        }
    });
}

/* ========================================
   Sticky Header
   ======================================== */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    }

    // Throttle scroll handler for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ========================================
   Contact Form Validation
   ======================================== */
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    const validators = {
        navn: {
            validate: function(value) {
                return value.trim().length >= 2;
            },
            message: 'Vennligst oppgi navnet ditt'
        },
        telefon: {
            validate: function(value) {
                const cleaned = value.replace(/\s/g, '');
                return /^(\+47)?[2-9]\d{7}$/.test(cleaned);
            },
            message: 'Vennligst oppgi et gyldig telefonnummer'
        },
        epost: {
            validate: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Vennligst oppgi en gyldig e-postadresse'
        },
        beskrivelse: {
            validate: function(value) {
                return value.trim().length >= 10;
            },
            message: 'Vennligst beskriv prosjektet ditt (minimum 10 tegn)'
        }
    };

    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remove error state on input
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        inputs.forEach(function(input) {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Show success state
            showFormSuccess(form);
        } else {
            // Focus first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    function validateField(field) {
        const name = field.name;
        const value = field.value;
        const validator = validators[name];

        // Skip optional fields without validators
        if (!validator && !field.required) {
            return true;
        }

        // Check required fields
        if (field.required && !value.trim()) {
            showFieldError(field, 'Dette feltet er påkrevd');
            return false;
        }

        // Check specific validation
        if (validator && value.trim() && !validator.validate(value)) {
            showFieldError(field, validator.message);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function showFormSuccess(form) {
        const formContainer = form.parentNode;

        // Create success message
        const successHTML = `
            <div class="form-success" style="text-align: center; padding: 3rem;">
                <div style="width: 72px; height: 72px; border: 2px solid #C9A227; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                </div>
                <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 0.5rem; color: #1C1C1C;">Takk for din henvendelse</h3>
                <p style="color: #666666; margin-bottom: 1.5rem;">Vi tar kontakt med deg så snart som mulig for en uforpliktende samtale.</p>
                <button type="button" class="btn btn--secondary" onclick="location.reload()">Send ny henvendelse</button>
            </div>
        `;

        form.style.display = 'none';
        formContainer.insertAdjacentHTML('beforeend', successHTML);
    }
}

/* ========================================
   Utility Functions
   ======================================== */

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}
