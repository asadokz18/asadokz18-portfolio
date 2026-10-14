# Asad Ullah | Web Developer — Personal Portfolio

A responsive personal portfolio website for **Asad Ullah**, a Computer Science graduate (BS Computer Science, 2022–2026) and Web Developer. It presents his skills, learning path, projects, study notes, resume, and contact details.

The website is built **entirely with HTML5, CSS3, and Vanilla JavaScript**. There are no frameworks, no CSS libraries, and no build tools. The only external resource is the **Font Awesome** icon stylesheet, loaded from a CDN.

## Technologies Used

- **HTML5** — semantic structure
- **CSS3** — Flexbox, Grid, media queries, CSS custom properties (used for colors only)
- **Vanilla JavaScript** — theme switching, mobile menu, modal, form validation, scroll effects
- **Font Awesome 6** (CDN) — icons

## Features

- Sticky navigation with active-section highlighting and smooth scrolling
- Mobile hamburger menu
- Dark / Light mode (follows the system theme on first visit, then remembers the choice in `localStorage`)
- Hero section with profile photo, call-to-action buttons, social links, and a typing effect (edit the `words` list in `initTypingEffect()` in `script.js`)
- Button hover effects: lift, light shine sweep, color fill on outline buttons, and animated icons
- About section with quick-fact cards
- Skills section that clearly separates **Current Skills** from **Currently Learning** (no fake percentages)
- Development Journey timeline (5 modules)
- Project grid with lazy-loaded images (3 columns on desktop, 2 on tablet, 1 on mobile)
- Interactive project filtering by category: **All**, **JavaScript**, **MERN Stack**, **React Native**, **PHP, SQL**, and **HTML & CSS**
- Dynamic 6-project view limit with a smooth **Show More Projects** / **Show Less Projects** toggle button
- Notes section: **View Note** opens the PDF in an accessible modal, **Download** saves it
- Resume section and **Download CV** buttons
- Contact form with client-side validation (required fields, email format, minimum message length)
- Back-to-top button and dynamic copyright year
- Accessibility: skip link, visible focus states, ARIA labels, keyboard-friendly modal, reduced-motion support
- SEO: title, description, author, Open Graph tags, theme color

## Project Structure

```text
portfolio/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── assets/
    ├── images/
    │   ├── hostel-management.png
    │   ├── amazon-clone.png
    │   ├── html-css-practice.png
    │   ├── asadokz-practice-portfolio.png
    │   ├── css-transform.png
    │   ├── profile.png
    │   └── logo.svg
    │
    ├── notes/
    │   ├── html-notes.pdf
    │   ├── css-notes.pdf
    │   └── javascript-notes.pdf
    │
    └── cv/
        └── Asad_Ullah_Resume.pdf
```

## How to Run Locally

1. Download or clone the project.
2. Open the `portfolio` folder.
3. Open `index.html` in a modern web browser (Chrome, Edge, Firefox, Safari).

No installation or server is required. An internet connection is needed only to load the Font Awesome icons. The rest of the site works offline.

## How to Customize

| What to change | Where |
| --- | --- |
| Name, intro text, About text | `index.html` (Hero and About sections) |
| Colors (light and dark) | `style.css` — section **1. COLORS** at the top. Variables are used for colors only. |
| Skills | `index.html` — Skills section (`<ul class="chips">` lists) |
| Journey modules | `index.html` — Development Journey section |
| Projects & Filters | `index.html` — copy a `<article class="project-card">` block, assign `data-category="..."` (such as `javascript`, `mern`, `react-native`, `php-sql`, `html-css`), then change the image, title, text, tags, and link. The page initially displays 6 projects, with the "Show More Projects" button appearing automatically if more than 6 projects are present. |
| Notes | Replace the PDFs in `assets/notes/`, or add a new `.note-card` with `data-note-src` pointing to the PDF |
| CV | Replace `assets/cv/Asad_Ullah_Resume.pdf` (keep the same file name) |
| Profile photo / logo | Replace `assets/images/profile.png` and `assets/images/logo.svg` |
| Contact email | `CONTACT_EMAIL` at the top of `script.js`, and the `mailto:` link in `index.html` |
| Icons | Browse [fontawesome.com/icons](https://fontawesome.com/icons) and use classes such as `fa-solid fa-star` |

### About the contact form

This is a static website, so the form has no server behind it. After validation, it opens the visitor's own email app with the message pre-filled (`mailto:`). Nothing is sent to or stored on a server.

## Social Links

Username: **asadokz18**

- LinkedIn: <https://linkedin.com/in/asadokz18>
- GitHub: <https://github.com/asadokz18>
- Facebook: <https://facebook.com/asadokz18>
- Instagram: <https://instagram.com/asadokz18>

## Projects

| Project | Technologies | Live Demo |
| --- | --- | --- |
| Hostel Management System (Final Year Project) | HTML, CSS, JavaScript, PHP, MySQL | <https://final-year-project-bice-chi.vercel.app/> |
| Amazon Home Page Clone | HTML5, CSS3, JavaScript | <https://amazonhomepageclone-omega.vercel.app/> |
| HTML & CSS Practice | HTML5, CSS3 | <https://mypracticeproject.vercel.app/> |
| Practice Portfolio | HTML5, CSS3, JavaScript | <https://asadokz-portfolio.vercel.app/> |
| CSS Transform Practice | HTML5, CSS3 | <https://transform-practice.vercel.app/> |

## Future Improvements

- Add React, Node.js, and mobile projects as they are completed
- Add a real contact-form backend (for example Node.js + Express) once learned
- Add a GitHub link button to each project card
- Optimize project screenshots to WebP for faster loading
- Add a multi-language option

## License

Personal portfolio. All content © Asad Ullah.
