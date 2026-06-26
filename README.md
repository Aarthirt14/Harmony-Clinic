# Harmony Family Clinic

A premium healthcare website built with pure **HTML5, CSS3, and Vanilla JavaScript** — no build tools, no frameworks, no npm.

## 🚀 Quick Start

Just double-click `index.html` — that's it. No installation required.

## 📁 Project Structure

```
Harmony-Family-Health/
│
├── index.html              ← Open this in any browser
├── favicon.svg
│
├── css/
│   ├── style.css           ← All styles, animations, components
│   └── responsive.css      ← Mobile-first media queries
│
├── js/
│   └── script.js           ← All interactions (no external libs)
│
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

## ✨ Features

- **Hero section** with CSS blob animations & entrance reveal
- **Services** — 6 cards with 3D tilt hover effect
- **Doctors section** — searchable doctor grid
- **Stats counters** — animated with Intersection Observer
- **Why Choose Us** — sticky scrolling layout
- **Book Appointment** — form with full validation
- **Testimonials** — auto-playing slider with touch/swipe support
- **Health Resources** — article grid
- **FAQ Accordion** — smooth CSS grid-template-rows animation
- **Contact section** — form + Google Maps embed
- **Mobile navigation** — full-screen panel with smooth animation
- **Floating CTA button** — scroll-triggered
- **Loading screen** — animated entrance

## 🎨 Animation Stack (Zero external dependencies)

- `CSS @keyframes` for blobs, floats, loader, and pulse
- `Intersection Observer API` for scroll-triggered reveals and counter start
- `requestAnimationFrame` for parallax scrolling
- `CSS grid-template-rows` transition for accordion
- `CSS transitions` for card tilt, hover effects, nav

## 🌐 Deploy

Works on **GitHub Pages**, **Netlify**, or **Vercel** — just upload the folder. No build step needed.

## ♿ Accessibility

- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels and roles throughout
- `aria-expanded` on accordion and mobile menu
- `prefers-reduced-motion` respected
- Keyboard-navigable

## 📱 Responsive

- Desktop (1280px+)
- Laptop (1024px)
- Tablet (768px)
- Mobile (480px and below)
