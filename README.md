# Asad Ullah — Web Developer Portfolio

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome_6-528DD7?style=flat&logo=fontawesome&logoColor=white)](https://fontawesome.com)

A **fully responsive personal portfolio website** for **Asad Ullah**, a Computer Science graduate (BS Computer Science 2022–2026) and Web Developer. It showcases his skills, learning journey, projects, study notes, resume, and contact details.

Built **entirely with HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no CSS libraries, no build tools. The only external dependency is **Font Awesome 6**, loaded from a CDN.

---

## 🛠️ Technologies Used

| Layer | Technology |
| --- | --- |
| Structure | HTML5 (semantic elements) |
| Styling | CSS3 — Flexbox, Grid, media queries, CSS custom properties |
| Logic | Vanilla JavaScript (single IIFE, no globals) |
| Icons | Font Awesome 6 (CDN) |

---

## ✨ Features

### Navigation & Layout
- Sticky header with active-section highlighting via `IntersectionObserver`
- Smooth scrolling (CSS `scroll-behavior: smooth`)
- Mobile hamburger menu with animated bars
- Back-to-top button (appears after scrolling past the hero)
- Skip-to-content link for keyboard users

### Theme
- Dark / Light mode toggle
- Follows the visitor's OS preference (`prefers-color-scheme`) on first visit
- Choice persisted in `localStorage` — remembered on return visits
- Applied before first paint via an inline script to prevent a flash of the wrong theme

### Hero Section
- Profile photo, tagline, and intro paragraph
- Typing / deleting effect cycling through role keywords (`initTypingEffect()` in `script.js`)
- Call-to-action buttons: **View My Work**, **Download CV**, **Contact Me**
- Social links (LinkedIn, GitHub, Facebook, Instagram)

### Sections
- **About** — short biography and four quick-fact info cards
- **Skills** — split into *Current Skills* and *Currently Learning* (no fake progress bars or percentages)
- **Development Journey** — vertical 5-module timeline
- **Projects** — responsive grid with lazy-loaded images and category filtering
- **Resume** — one-click Download CV and View CV (PDF)
- **Contact** — client-side validated form that opens the visitor's email app via `mailto:`

### Projects Grid
- 3 columns on desktop · 2 on tablet · 1 on mobile
- **Show More Projects** button appears automatically when more than 6 cards are present
- Category filter bar: **All · JavaScript · MERN Stack · React Native · PHP, SQL · HTML & CSS**
- Empty-state message when a filter has no matching projects

### Notes Page (`notes.html`)
- Dedicated page with its own `notes.css` and `notes.js`
- Instant PDF preview in a modal (no page reload)
- Live search across note titles
- Category filtering
- Direct PDF download buttons

### Accessibility & SEO
- ARIA labels, roles, and `aria-live` regions throughout
- Keyboard-navigable modal (focus trap, Escape to close)
- Visible focus states and `prefers-reduced-motion` support
- `<title>`, `<meta description>`, Open Graph tags, and `theme-color`

---

## 📁 Project Structure

```text
asadokz18-portfolio/
│
├── index.html          ← Main portfolio page
├── style.css           ← All styles for index.html
├── script.js           ← All JS for index.html (single IIFE, no globals)
│
├── notes.html          ← Dedicated study-notes page
├── notes.css           ← Styles for notes.html
├── notes.js            ← Logic for notes.html
│
├── README.md
│
└── assets/
    ├── images/
    │   ├── profile.png
    │   ├── logo.svg
    │   ├── hostel-management.png
    │   ├── amazon-clone.png
    │   ├── html-css-practice.png
    │   ├── asadokz-practice-portfolio.png
    │   └── css-transform.png
    │
    ├── notes/
    │   ├── HTML-Notes.pdf
    │   ├── CSS-Notes.pdf
    │   ├── JavaScript-Notes.pdf
    │   └── Web-Development-basic-Notes.pdf
    │
    └── cv/
        └── Asad_Ullah_Resume.pdf
```

---

## ▶️ How to Run Locally

1. **Clone or download** the repository.
2. Open the project folder.
3. Double-click `index.html` (or open it in Chrome, Edge, Firefox, or Safari).

No installation, no server, and no build step required.
An internet connection is needed only to load the Font Awesome icons from the CDN.

---

## ✏️ How to Customize

| What to change | Where |
| --- | --- |
| Name, intro text, About bio | `index.html` — Hero and About sections |
| Color palette (light & dark) | `style.css` — section **1. COLORS** at the top (CSS custom properties) |
| Skills chips | `index.html` — Skills section (`<ul class="chips">` lists) |
| Journey modules | `index.html` — Development Journey `<ol class="timeline">` |
| Add a project | Copy a `<article class="project-card">` block in `index.html`, set `data-category` to one or more of: `javascript`, `mern`, `react-native`, `php-sql`, `html-css` |
| Notes PDFs | Replace / add PDFs in `assets/notes/`, then update cards in `notes.html` and the notes preview in `index.html` |
| CV file | Replace `assets/cv/Asad_Ullah_Resume.pdf` (keep the same filename) |
| Profile photo & logo | Replace `assets/images/profile.png` and `assets/images/logo.svg` |
| Contact email | `CONTACT_EMAIL` constant at the top of `script.js`, and the `mailto:` link in `index.html` |
| Typing effect words | `words` array inside `initTypingEffect()` in `script.js` |
| Icons | Browse [fontawesome.com/icons](https://fontawesome.com/icons) and use classes like `fa-solid fa-star` |

### About the contact form

This is a **static website** — there is no backend. After client-side validation the form constructs a `mailto:` link and opens the visitor's default email app with the message pre-filled. Nothing is sent to or stored on a server.

---

## 🔗 Social Links

**Username:** `asadokz18`

| Platform | URL |
| --- | --- |
| 💼 LinkedIn | <https://linkedin.com/in/asadokz18> |
| 🐙 GitHub | <https://github.com/asadokz18> |
| 📘 Facebook | <https://facebook.com/asadokz18> |
| 📸 Instagram | <https://instagram.com/asadokz18> |
| ✉️ Email | asadokz18@gmail.com |

---

## 🗂️ Projects

| # | Project | Stack | Live Demo |
| --- | --- | --- | --- |
| 1 | Practice Portfolio | HTML5, CSS3, JavaScript | [asadokz-portfolio.vercel.app](https://asadokz-portfolio.vercel.app/) |
| 2 | Hostel Management System *(Final Year Project)* | HTML, CSS, JavaScript, PHP, MySQL | [final-year-project-bice-chi.vercel.app](https://final-year-project-bice-chi.vercel.app/) |
| 3 | Amazon Home Page Clone | HTML5, CSS3, JavaScript | [amazonhomepageclone-omega.vercel.app](https://amazonhomepageclone-omega.vercel.app/) |
| 4 | HTML & CSS Practice | HTML5, CSS3 | [mypracticeproject.vercel.app](https://mypracticeproject.vercel.app/) |
| 5 | CSS Transform Practice | HTML5, CSS3 | [transform-practice.vercel.app](https://transform-practice.vercel.app/) |

---

## 🗺️ Development Journey

| Module | Topic | Status |
| --- | --- | --- |
| 1 | Web Designing — HTML5, CSS3 | ✅ Current skill |
| 2 | Front-End Development — JavaScript | ✅ Current skill |
| 3 | Modern Front-End — ReactJS | ✅ Current skill |
| 4 | Back-End App Development — Node.js, Express, MongoDB, PostgreSQL | 🎯 Learning goal |
| 5 | Mobile App Development — React Native | 🎯 Learning goal |

---

## 🔮 Future Improvements

- [ ] Add React, Node.js, and mobile app projects as they are completed
- [ ] Add GitHub source-code link buttons to each project card
- [ ] Replace project screenshots with WebP format for faster loading
- [ ] Add a real contact-form backend (Node.js + Express + nodemailer) once learned
- [ ] Add multi-language support

---

## 📜 License

Personal portfolio. All content © Asad Ullah. All rights reserved.
