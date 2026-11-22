/* ==========================================================================
   Asad Ullah | Web Developer - Portfolio Script (Vanilla JavaScript)

   Everything lives inside one function so no variables leak into the global
   scope. Each feature has its own small function, started by init() at the
   bottom of the file.

   Note: smooth scrolling is done in CSS (scroll-behavior: smooth), which is
   lighter than a JavaScript scroll handler and respects reduced-motion.
   ========================================================================== */

(function () {
    'use strict';

    // Email address used by the contact form's mailto: link.
    // Change it here if you want messages to go to another address.
    var CONTACT_EMAIL = 'asadokz18@gmail.com';

    /* ----------------------------------------------------------------------
       1. THEME (dark / light mode)
       The first visit follows the visitor's system setting. Once they click
       the toggle, their choice is saved in localStorage - a small key/value
       store inside the browser - so the same theme is used on the next visit.
       The theme itself is just a data-theme attribute on <html>; style.css
       swaps the color variables based on it.
       ---------------------------------------------------------------------- */
    function initTheme() {
        var root = document.documentElement;
        var toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        // Keeps the button label and the browser theme-color in sync with the theme
        function applyTheme(theme) {
            root.setAttribute('data-theme', theme);
            var isDark = theme === 'dark';
            toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', isDark ? '#0b1220' : '#1e40af');
        }

        // The inline script in <head> already set data-theme; just sync the label
        applyTheme(root.getAttribute('data-theme') || 'light');

        toggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            // localStorage can be blocked (e.g. private mode), so wrap it in try/catch
            try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
        });
    }

    /* ----------------------------------------------------------------------
       2. MOBILE MENU
       On small screens the nav is hidden. The hamburger button toggles an
       "open" class on it, and aria-expanded tells screen readers the state.
       The menu closes when a link is clicked, Escape is pressed, or the
       user clicks outside it.
       ---------------------------------------------------------------------- */
    function initMobileMenu() {
        var button = document.getElementById('menu-toggle');
        var nav = document.getElementById('site-nav');
        if (!button || !nav) return;

        function setOpen(isOpen) {
            nav.classList.toggle('open', isOpen);
            button.setAttribute('aria-expanded', String(isOpen));
            button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        }

        button.addEventListener('click', function () {
            setOpen(button.getAttribute('aria-expanded') !== 'true');
        });

        // One listener on the nav handles every link (event delegation)
        nav.addEventListener('click', function (event) {
            if (event.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && nav.classList.contains('open')) {
                setOpen(false);
                button.focus();
            }
        });

        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
        });
    }

    /* ----------------------------------------------------------------------
       3. ACTIVE NAV LINK
       IntersectionObserver tells us when a section crosses the middle of the
       screen. This is much cheaper than listening to every scroll event.
       ---------------------------------------------------------------------- */
    function initActiveNav() {
        var links = document.querySelectorAll('.site-nav a[href^="#"]');
        if (!links.length || !('IntersectionObserver' in window)) return;

        var sections = [];
        links.forEach(function (link) {
            var section = document.querySelector(link.getAttribute('href'));
            if (section) sections.push(section);
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    var isActive = link.getAttribute('href') === '#' + entry.target.id;
                    link.classList.toggle('active', isActive);
                    if (isActive) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' }); // a thin band across the middle of the viewport

        sections.forEach(function (section) { observer.observe(section); });
    }

    /* ----------------------------------------------------------------------
       4. SCROLL REVEAL ANIMATION
       Sections marked .reveal fade in the first time they scroll into view.
       After that we stop watching them (unobserve) to save work.
       ---------------------------------------------------------------------- */
    function initScrollReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (item) { item.classList.add('visible'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        items.forEach(function (item) { observer.observe(item); });
    }

    /* ----------------------------------------------------------------------
       5. BACK-TO-TOP BUTTON
       Shown once the hero section has scrolled out of view. Again an
       IntersectionObserver is used instead of a scroll listener.
       ---------------------------------------------------------------------- */
    function initBackToTop() {
        var button = document.getElementById('to-top');
        var hero = document.getElementById('home');
        if (!button || !hero) return;

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                button.hidden = entries[0].isIntersecting;
            }).observe(hero);
        } else {
            button.hidden = false;
        }

        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    /* ----------------------------------------------------------------------
       6. CONTACT FORM VALIDATION
       The site has no server, so the form cannot store or send anything.
       Steps:
         1. On submit, stop the browser's default behavior.
         2. Check each field; show an inline message under any invalid one.
         3. If everything is valid, build a mailto: link and open it, which
            launches the visitor's own email app with the message filled in.
       Fields are also re-checked as the user leaves them (blur), so errors
       appear early and disappear as soon as they are fixed.
       ---------------------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contact-form');
        var status = document.getElementById('form-status');
        if (!form) return;

        var MIN_MESSAGE_LENGTH = 20;
        var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // Each rule returns an error message, or '' when the value is fine
        var rules = {
            name: function (value) {
                return value.length < 2 ? 'Please enter your name.' : '';
            },
            email: function (value) {
                if (!value) return 'Please enter your email address.';
                return EMAIL_PATTERN.test(value) ? '' : 'Please enter a valid email address, like name@example.com.';
            },
            subject: function (value) {
                return value.length < 3 ? 'Please enter a subject.' : '';
            },
            message: function (value) {
                return value.length < MIN_MESSAGE_LENGTH
                    ? 'Your message needs at least ' + MIN_MESSAGE_LENGTH + ' characters (currently ' + value.length + ').'
                    : '';
            }
        };

        // Shows or clears the error for one field. Returns true if the field is valid.
        function validateField(field) {
            var message = rules[field.name](field.value.trim());
            document.getElementById(field.id + '-error').textContent = message;
            field.classList.toggle('invalid', Boolean(message));
            field.setAttribute('aria-invalid', String(Boolean(message)));
            return !message;
        }

        var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));

        fields.forEach(function (field) {
            field.addEventListener('blur', function () { validateField(field); });
            field.addEventListener('input', function () {
                if (field.classList.contains('invalid')) validateField(field);
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            status.textContent = '';

            // Check every field (don't stop at the first error)
            var results = fields.map(validateField);
            var firstInvalid = fields[results.indexOf(false)];

            if (firstInvalid) {
                status.textContent = 'Please fix the highlighted fields and try again.';
                firstInvalid.focus();
                return;
            }

            var body = 'Name: ' + form.name.value.trim() +
                '\nEmail: ' + form.email.value.trim() +
                '\n\n' + form.message.value.trim();

            window.location.href = 'mailto:' + CONTACT_EMAIL +
                '?subject=' + encodeURIComponent(form.subject.value.trim()) +
                '&body=' + encodeURIComponent(body);

            status.textContent = 'Thank you! Your email app should now open with your message ready to send. If it does not, email me directly at ' + CONTACT_EMAIL + '.';
            form.reset();
        });
    }

    /* ----------------------------------------------------------------------
       7. TYPING EFFECT (hero)
       Types a word one letter at a time, waits, deletes it, then moves on to
       the next word. One setTimeout call schedules the next step, so the
       speed can differ for typing, deleting, and pausing.
       People who prefer reduced motion keep the plain first word instead.
       ---------------------------------------------------------------------- */
    function initTypingEffect() {
        var typed = document.getElementById('typed');
        if (!typed) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var words = [
            'Frontend Development',
            'SEO Optimization',
            'Responsive Websites',
            'Full Stack Development',
            'Technical SEO & Core Web Vitals',
            '@asadokz18'
        ];
        var wordIndex = 0;                    // which word we are on
        var charCount = words[0].length;      // how many letters are showing
        var deleting = false;                 // true while erasing

        function tick() {
            var word = words[wordIndex];
            typed.textContent = word.slice(0, charCount);
            var delay = deleting ? 45 : 85;   // erasing is a little faster than typing

            if (!deleting && charCount === word.length) {
                deleting = true;              // word finished: pause, then start erasing
                delay = 1600;
            } else if (deleting && charCount === 0) {
                deleting = false;             // word erased: move to the next one
                wordIndex = (wordIndex + 1) % words.length;
                delay = 300;
            } else {
                charCount += deleting ? -1 : 1;
            }
            setTimeout(tick, delay);
        }

        tick();
    }

    /* ----------------------------------------------------------------------
       8. FOOTER YEAR
       Writes the current year so the copyright never goes out of date.
       ---------------------------------------------------------------------- */
    function setCopyrightYear() {
        var year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    }

    /* ----------------------------------------------------------------------
       9. PROJECTS FILTER & SHOW MORE / LESS
       Filters project cards by category (All, JavaScript, Full Stack,
       HTML & CSS) and limits the visible matching cards to 6 initially.
       Visitors can click "Show More Projects" to see all matches.
       ---------------------------------------------------------------------- */
    function initProjectsFilter() {
        var grid = document.querySelector('.project-grid');
        var filterBar = document.querySelector('.projects-filter-bar');
        var btn = document.getElementById('show-more-projects-btn');
        if (!grid) return;

        var cards = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
        var filterBtns = filterBar ? Array.prototype.slice.call(filterBar.querySelectorAll('.filter-btn')) : [];
        var INITIAL_LIMIT = 6;
        var currentFilter = 'all';
        var isExpanded = false;
        var btnText = btn ? btn.querySelector('.btn-text') : null;

        function cardMatches(card, filter) {
            if (filter === 'all') return true;
            var cat = (card.getAttribute('data-category') || '').toLowerCase();
            if (cat.indexOf(filter) !== -1) return true;
            if (filter === 'php-sql' && (cat.indexOf('php') !== -1 || cat.indexOf('sql') !== -1)) return true;
            if (filter === 'mern' && (cat.indexOf('mern') !== -1 || (cat.indexOf('react') !== -1 && cat.indexOf('native') === -1) || cat.indexOf('node') !== -1)) return true;
            if (filter === 'react-native' && (cat.indexOf('react-native') !== -1 || cat.indexOf('native') !== -1)) return true;

            // Fallback: check chips text
            var chips = card.querySelectorAll('.chips li');
            for (var i = 0; i < chips.length; i++) {
                var text = chips[i].textContent.toLowerCase();
                if (filter === 'javascript' && (text.indexOf('javascript') !== -1 || text.indexOf('js') !== -1)) return true;
                if (filter === 'html-css' && (text.indexOf('html') !== -1 || text.indexOf('css') !== -1)) return true;
                if (filter === 'php-sql' && (text.indexOf('php') !== -1 || text.indexOf('sql') !== -1 || text.indexOf('mysql') !== -1)) return true;
                if (filter === 'mern' && (text.indexOf('mern') !== -1 || (text.indexOf('react') !== -1 && text.indexOf('native') === -1) || text.indexOf('node') !== -1 || text.indexOf('express') !== -1 || text.indexOf('mongo') !== -1)) return true;
                if (filter === 'react-native' && (text.indexOf('react native') !== -1 || text.indexOf('native') !== -1)) return true;
            }
            return false;
        }

        function render() {
            var matchingCards = [];
            var nonMatchingCards = [];

            cards.forEach(function (card) {
                if (cardMatches(card, currentFilter)) {
                    matchingCards.push(card);
                } else {
                    nonMatchingCards.push(card);
                }
            });

            // Show or hide empty notice if no cards match
            var emptyNotice = document.getElementById('projects-empty');
            if (emptyNotice) {
                emptyNotice.hidden = matchingCards.length > 0;
            }

            // Hide non-matching cards completely
            nonMatchingCards.forEach(function (card) {
                card.classList.remove('project-revealed');
                card.classList.add('project-hidden');
            });

            // For matching cards, apply 6-card limit unless expanded
            matchingCards.forEach(function (card, index) {
                if (!isExpanded && index >= INITIAL_LIMIT) {
                    card.classList.remove('project-revealed');
                    card.classList.add('project-hidden');
                } else {
                    card.classList.remove('project-hidden');
                    card.classList.add('project-revealed');
                }
            });

            // Handle Show More button visibility and state
            if (btn && btn.parentElement) {
                if (matchingCards.length <= INITIAL_LIMIT) {
                    btn.parentElement.style.display = 'none';
                } else {
                    btn.parentElement.style.display = 'flex';
                    btn.setAttribute('aria-expanded', String(isExpanded));
                    if (btnText) {
                        btnText.textContent = isExpanded ? 'Show Less Projects' : 'Show More Projects';
                    }
                }
            }
        }

        // Set up filter buttons click listeners
        filterBtns.forEach(function (filterBtn) {
            filterBtn.addEventListener('click', function () {
                var selectedFilter = filterBtn.getAttribute('data-filter') || 'all';
                if (selectedFilter === currentFilter) return;

                currentFilter = selectedFilter;
                isExpanded = false; // reset expand state when switching filter

                filterBtns.forEach(function (b) {
                    var isActive = b === filterBtn;
                    b.classList.toggle('active', isActive);
                    b.setAttribute('aria-pressed', String(isActive));
                });

                render();
            });
        });

        // Set up Show More button click listener
        if (btn) {
            btn.addEventListener('click', function () {
                isExpanded = !isExpanded;
                render();

                // When collapsing, smoothly scroll back to the 6th card
                if (!isExpanded) {
                    var matchingCards = cards.filter(function (card) {
                        return cardMatches(card, currentFilter);
                    });
                    var targetCard = matchingCards[INITIAL_LIMIT - 1] || grid;
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        // Initial render
        render();
    }

    /* ----------------------------------------------------------------------
       10. HERO INTERACTIVE WEB & SEO NETWORK CANVAS
       Renders an interactive constellation/graph of interconnected web
       nodes representing hyperlinks, crawling paths, and SEO indexing.
       - Connects nearby nodes with dynamic link lines
       - Interactive cursor gravitational & connection response
       - Theme-aware colors (light & dark mode)
       - Pauses automatically when off-screen (0% CPU impact)
       - High-DPI crisp rendering on retina displays
       ---------------------------------------------------------------------- */
    function initHeroNetworkCanvas() {
        var canvas = document.getElementById('hero-canvas');
        var hero = document.getElementById('home');
        if (!canvas || !hero) return;

        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var root = document.documentElement;
        var width = 0;
        var height = 0;
        var dpr = window.devicePixelRatio || 1;
        var particles = [];
        var animId = null;
        var isVisible = true;

        var mouse = {
            x: null,
            y: null,
            radius: 140
        };

        function isDarkTheme() {
            return root.getAttribute('data-theme') === 'dark';
        }

        function resize() {
            var rect = hero.getBoundingClientRect();
            width = rect.width;
            height = rect.height;

            dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            ctx.scale(dpr, dpr);
            createParticles();
        }

        function createParticles() {
            particles = [];
            // Target density: ~1 particle per 22,000px^2, clamped between 20 and 48
            var count = Math.max(18, Math.min(48, Math.floor((width * height) / 22000)));

            for (var i = 0; i < count; i++) {
                var isSpecial = i % 4 === 0; // 25% are SEO accent nodes
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.55,
                    vy: (Math.random() - 0.5) * 0.55,
                    radius: isSpecial ? (Math.random() * 1.5 + 2.5) : (Math.random() * 1.2 + 1.6),
                    type: isSpecial ? (i % 8 === 0 ? 'accent' : 'emerald') : 'primary',
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }

        function getColors() {
            var dark = isDarkTheme();
            return {
                primaryNode: dark ? 'rgba(96, 165, 250, 0.75)' : 'rgba(30, 64, 175, 0.55)',
                accentNode: dark ? 'rgba(251, 191, 36, 0.85)' : 'rgba(180, 83, 9, 0.75)',
                emeraldNode: dark ? 'rgba(52, 211, 153, 0.85)' : 'rgba(16, 185, 129, 0.75)',
                lineBase: dark ? '96, 165, 250' : '30, 64, 175',
                mouseLine: dark ? 'rgba(96, 165, 250, 0.28)' : 'rgba(30, 64, 175, 0.22)'
            };
        }

        function step() {
            if (!isVisible) return;

            ctx.clearRect(0, 0, width, height);

            var colors = getColors();
            var maxDistance = Math.min(130, Math.max(90, width * 0.12));
            var pLen = particles.length;

            for (var i = 0; i < pLen; i++) {
                var p = particles[i];

                if (!reducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Bounce smoothly inside boundaries
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;

                    // Mouse gravitational response
                    if (mouse.x !== null && mouse.y !== null) {
                        var dx = mouse.x - p.x;
                        var dy = mouse.y - p.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < mouse.radius) {
                            var force = (1 - dist / mouse.radius) * 0.08;
                            p.x += dx * force;
                            p.y += dy * force;

                            // Draw interactive search-connection line to cursor
                            ctx.beginPath();
                            ctx.strokeStyle = colors.mouseLine;
                            ctx.lineWidth = 1;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(mouse.x, mouse.y);
                            ctx.stroke();
                        }
                    }

                    p.pulse += 0.025;
                }

                // Render node
                var nodeColor = p.type === 'accent'
                    ? colors.accentNode
                    : (p.type === 'emerald' ? colors.emeraldNode : colors.primaryNode);

                ctx.beginPath();
                var currentRadius = p.radius + (reducedMotion ? 0 : Math.sin(p.pulse) * 0.5);
                ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.fill();

                // Draw connecting network lines to nearby nodes
                for (var j = i + 1; j < pLen; j++) {
                    var p2 = particles[j];
                    var ldx = p.x - p2.x;
                    var ldy = p.y - p2.y;
                    var ldist = Math.sqrt(ldx * ldx + ldy * ldy);

                    if (ldist < maxDistance) {
                        var alpha = (1 - (ldist / maxDistance)) * 0.18;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(' + colors.lineBase + ',' + alpha.toFixed(3) + ')';
                        ctx.lineWidth = 0.85;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            if (!reducedMotion) {
                animId = requestAnimationFrame(step);
            }
        }

        // Mouse interaction listeners on Hero
        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        hero.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        // Window resize with debounce
        var resizeTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                resize();
                if (reducedMotion) step();
            }, 120);
        });

        // IntersectionObserver: stop animation when hero is off-screen
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                var entry = entries[0];
                isVisible = entry.isIntersecting;
                if (isVisible && !reducedMotion) {
                    cancelAnimationFrame(animId);
                    animId = requestAnimationFrame(step);
                }
            }, { threshold: 0.05 }).observe(hero);
        }

        // Initialize size and start loop
        resize();
        step();
    }

    /* ----------------------------------------------------------------------
       11. HERO PHOTO 3D PERSPECTIVE TILT & SPECULAR LIGHTING
       Applies buttery-smooth physics-based 3D tilt tracking with linear
       interpolation (lerp), multi-layer parallax depth, dynamic counter
       shadow, and real-time specular lighting reflecting cursor movement.
       ---------------------------------------------------------------------- */
    function initHeroPhotoTilt() {
        var photo = document.getElementById('hero-photo');
        var wrapper = document.getElementById('hero-photo-wrapper');
        var cardFrame = photo ? photo.querySelector('.photo-card-frame') : null;
        var shadow = photo ? photo.querySelector('.photo-ground-shadow') : null;
        if (!photo || !wrapper) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var isHovered = false;
        var targetRotX = 0;
        var targetRotY = 0;
        var currentRotX = 0;
        var currentRotY = 0;
        var targetShadowX = 0;
        var currentShadowX = 0;
        var rafId = null;

        function update3DPhysics() {
            var lerpFactor = 0.12;
            currentRotX += (targetRotX - currentRotX) * lerpFactor;
            currentRotY += (targetRotY - currentRotY) * lerpFactor;
            currentShadowX += (targetShadowX - currentShadowX) * lerpFactor;

            if (isHovered || Math.abs(currentRotX) > 0.05 || Math.abs(currentRotY) > 0.05) {
                wrapper.style.transform =
                    'perspective(1200px) rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(1.04, 1.04, 1.04)';

                if (shadow) {
                    shadow.style.transform = 'translateX(' + (-currentShadowX).toFixed(1) + 'px) scale(' + (1 - Math.abs(currentRotX) * 0.01).toFixed(2) + ')';
                }
                rafId = requestAnimationFrame(update3DPhysics);
            } else {
                // Smoothly settled back at rest position -> seamlessly resume continuous 3D float
                wrapper.style.transform = '';
                if (shadow) shadow.style.transform = '';
                wrapper.style.animationPlayState = 'running';
                rafId = null;
            }
        }

        photo.addEventListener('mouseenter', function () {
            isHovered = true;
            wrapper.style.animationPlayState = 'paused';
            if (!rafId) {
                rafId = requestAnimationFrame(update3DPhysics);
            }
        });

        photo.addEventListener('mousemove', function (e) {
            if (!isHovered) return;
            var rect = photo.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            // Expressive 3D tilt angles (up to +/- 13deg)
            targetRotX = ((y - centerY) / centerY) * -13;
            targetRotY = ((x - centerX) / centerX) * 13;

            // Counter shadow offset in 3D lighting
            targetShadowX = (targetRotY / 13) * 10;

            // Track dynamic specular sheen position under cursor
            if (cardFrame) {
                var pctX = Math.round((x / rect.width) * 100);
                var pctY = Math.round((y / rect.height) * 100);
                cardFrame.style.setProperty('--mouse-x', pctX + '%');
                cardFrame.style.setProperty('--mouse-y', pctY + '%');
            }
        });

        photo.addEventListener('mouseleave', function () {
            isHovered = false;
            targetRotX = 0;
            targetRotY = 0;
            targetShadowX = 0;
            if (cardFrame) {
                cardFrame.style.removeProperty('--mouse-x');
                cardFrame.style.removeProperty('--mouse-y');
            }
            if (!rafId) {
                rafId = requestAnimationFrame(update3DPhysics);
            }
        });
    }

    /* ----------------------------------------------------------------------
       START
       script.js is loaded with "defer", so the HTML is ready when this runs.
       ---------------------------------------------------------------------- */
    function init() {
        initTheme();
        initMobileMenu();
        initActiveNav();
        initScrollReveal();
        initBackToTop();
        initContactForm();
        initTypingEffect();
        initHeroNetworkCanvas();
        initHeroPhotoTilt();
        setCopyrightYear();
        initProjectsFilter();
    }

    init();
})();
