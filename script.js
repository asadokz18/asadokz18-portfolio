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
       6. NOTE VIEWER MODAL
       Buttons with data-note-src open the PDF inside a native <dialog>:
         - showModal() makes the page behind inert, traps keyboard focus,
           and closes on Escape automatically.
         - Clicking the dark backdrop closes it (we check that the click
           landed on the <dialog> itself, not on its content).
         - A "no-scroll" class on <body> stops the page scrolling behind it.
         - The PDF is shown with the browser's built-in viewer in an <iframe>.
           Some mobile browsers cannot show PDFs inline, so there is always an
           "Open it in a new tab" link as a fallback.
       ---------------------------------------------------------------------- */
    function initNoteModal() {
        var modal = document.getElementById('note-modal');
        if (!modal || typeof modal.showModal !== 'function') return;

        var title = document.getElementById('note-modal-title');
        var frame = document.getElementById('note-frame');
        var fallback = document.getElementById('note-fallback');
        var closeButton = document.getElementById('note-close');

        function openNote(src, noteTitle) {
            title.textContent = noteTitle;
            frame.title = noteTitle + ' (PDF viewer)';
            frame.src = src;           // the PDF only loads when the modal is opened
            fallback.href = src;
            document.body.classList.add('no-scroll');
            modal.showModal();
            closeButton.focus();
        }

        // Fires however the dialog closes (button, Escape, or backdrop click)
        modal.addEventListener('close', function () {
            frame.removeAttribute('src');   // stop loading the PDF
            document.body.classList.remove('no-scroll');
        });

        document.querySelectorAll('[data-note-src]').forEach(function (button) {
            button.addEventListener('click', function () {
                openNote(button.dataset.noteSrc, button.dataset.noteTitle);
            });
        });

        closeButton.addEventListener('click', function () { modal.close(); });

        modal.addEventListener('click', function (event) {
            if (event.target === modal) modal.close();   // click on the backdrop
        });
    }

    /* ----------------------------------------------------------------------
       7. CONTACT FORM VALIDATION
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
       8. TYPING EFFECT (hero)
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
            'Responsive Websites',
            'Full Stack Development',
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
       9. FOOTER YEAR
       Writes the current year so the copyright never goes out of date.
       ---------------------------------------------------------------------- */
    function setCopyrightYear() {
        var year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
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
        initNoteModal();
        initContactForm();
        initTypingEffect();
        setCopyrightYear();
    }

    init();
})();
