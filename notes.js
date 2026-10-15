/* ==========================================================================
   Asad Ullah | Web Developer - Notes Page Script
   Separated JavaScript specifically for notes.html (Vanilla JS)

   Features:
   1. Theme toggle (dark / light mode synced via localStorage)
   2. Mobile hamburger navigation
   3. Note viewer modal (<dialog> with iframe & fallback)
   4. Live search & category filtering with counter & empty state
   5. Scroll reveal animations
   6. Back-to-top button
   7. Dynamic copyright year
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       1. THEME (Dark / Light Mode)
       Syncs with localStorage so the user's preference persists across
       index.html and notes.html seamlessly.
       ---------------------------------------------------------------------- */
    function initTheme() {
        var root = document.documentElement;
        var toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        function applyTheme(theme) {
            root.setAttribute('data-theme', theme);
            var isDark = theme === 'dark';
            toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', isDark ? '#0b1220' : '#1e40af');
        }

        applyTheme(root.getAttribute('data-theme') || 'light');

        toggle.addEventListener('click', function () {
            var current = root.getAttribute('data-theme') || 'light';
            var next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try {
                localStorage.setItem('theme', next);
            } catch (e) {
                /* private browsing storage exception fallback */
            }
        });
    }

    /* ----------------------------------------------------------------------
       2. MOBILE NAVIGATION MENU
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
            if (!nav.contains(event.target) && !button.contains(event.target)) {
                setOpen(false);
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. NOTE VIEWER MODAL (<dialog>)
       Accessible native <dialog> implementation with PDF viewer iframe
       ---------------------------------------------------------------------- */
    function initNoteModal() {
        var modal = document.getElementById('note-modal');
        if (!modal || typeof modal.showModal !== 'function') return;

        var titleEl = document.getElementById('note-modal-title');
        var frame = document.getElementById('note-frame');
        var fallback = document.getElementById('note-fallback');
        var closeButton = document.getElementById('note-close');

        function openNote(src, noteTitle) {
            if (titleEl) {
                titleEl.innerHTML = '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i> ' + (noteTitle || 'Note Viewer');
            }
            if (frame) {
                frame.title = (noteTitle || 'Note') + ' (PDF viewer)';
                frame.src = src; // Loads PDF on-demand
            }
            if (fallback) {
                fallback.href = src;
            }
            document.body.classList.add('no-scroll');
            modal.showModal();
            if (closeButton) closeButton.focus();
        }

        modal.addEventListener('close', function () {
            if (frame) frame.removeAttribute('src'); // Stop PDF process & free memory
            document.body.classList.remove('no-scroll');
        });

        // Delegate listener for all preview triggers
        document.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-note-src]');
            if (btn) {
                event.preventDefault();
                openNote(btn.dataset.noteSrc, btn.dataset.noteTitle);
            }
        });

        if (closeButton) {
            closeButton.addEventListener('click', function () {
                modal.close();
            });
        }

        // Click outside the dialog content (on backdrop) closes it
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.close();
            }
        });
    }

    /* ----------------------------------------------------------------------
       4. LIVE SEARCH & CATEGORY FILTERING
       ---------------------------------------------------------------------- */
    function initNotesSearchAndFilter() {
        var searchInput = document.getElementById('notes-search');
        var clearBtn = document.getElementById('clear-search');
        var filterBtns = document.querySelectorAll('.filter-btn');
        var noteCards = document.querySelectorAll('.note-card');
        var countEl = document.getElementById('notes-count-num');
        var emptyState = document.getElementById('notes-empty-state');
        var resetFilterBtn = document.getElementById('reset-filter-btn');

        var activeCategory = 'all';
        var searchQuery = '';

        function applyFilter() {
            var visibleCount = 0;

            noteCards.forEach(function (card) {
                var category = (card.getAttribute('data-category') || '').toLowerCase();
                var cardText = (card.textContent || '').toLowerCase();

                var matchesCategory = (activeCategory === 'all') || (category === activeCategory);
                var matchesSearch = !searchQuery || cardText.indexOf(searchQuery) !== -1;

                if (matchesCategory && matchesSearch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (countEl) {
                countEl.textContent = visibleCount;
            }

            if (emptyState) {
                if (visibleCount === 0) {
                    emptyState.classList.add('visible');
                } else {
                    emptyState.classList.remove('visible');
                }
            }
        }

        // Search input event
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = searchInput.value.trim().toLowerCase();
                if (clearBtn) {
                    clearBtn.classList.toggle('visible', searchQuery.length > 0);
                }
                applyFilter();
            });
        }

        // Clear search button
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                searchQuery = '';
                clearBtn.classList.remove('visible');
                applyFilter();
            });
        }

        // Category filter buttons
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                activeCategory = (btn.getAttribute('data-category') || 'all').toLowerCase();
                applyFilter();
            });
        });

        // Reset button in empty state
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', function () {
                activeCategory = 'all';
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                if (clearBtn) clearBtn.classList.remove('visible');
                filterBtns.forEach(function (b) {
                    b.classList.toggle('active', b.getAttribute('data-category') === 'all');
                });
                applyFilter();
            });
        }

        // Initial count
        applyFilter();
    }

    /* ----------------------------------------------------------------------
       5. SCROLL REVEAL ANIMATIONS
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
       6. BACK-TO-TOP BUTTON
       ---------------------------------------------------------------------- */
    function initBackToTop() {
        var button = document.getElementById('to-top');
        var hero = document.getElementById('notes-hero');
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
       7. COPYRIGHT YEAR
       ---------------------------------------------------------------------- */
    function setCopyrightYear() {
        var yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    /* ----------------------------------------------------------------------
       INITIALIZATION
       ---------------------------------------------------------------------- */
    function init() {
        initTheme();
        initMobileMenu();
        initNoteModal();
        initNotesSearchAndFilter();
        initScrollReveal();
        initBackToTop();
        setCopyrightYear();
    }

    init();
})();
