# 🕰️ Arabian Dial — Concept Storefront

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel&logoColor=white)](https://arabian-dial-concept.vercel.app)

An ultra-premium, cinematic, dark-mode concept storefront designed and engineered for **Arabian Dial** (associated with [arabiandial.store](https://arabiandial.store)), a custom watch modification brand specializing in bespoke timepieces featuring custom horology and premium Arabic calligraphy dials.

**Live Staging Link:** [arabian-dial-concept.vercel.app](https://arabian-dial-concept.vercel.app)

---

## 🎨 Design Philosophy & Aesthetic

Inspired by the dark, cinematic, and macro-lens visuals on [Arabian Dial's Instagram](https://www.instagram.com/arabian_dial/), this storefront reflects high-end watch modification artistry:
- **Obsidian Dark Palette:** Deep black `#09090B` backgrounds combined with clean champagne-gold accents `#BBA870` reflecting luxury horology.
- **Asymmetric & Minimalist Grid:** A layout optimized for visual density, utilizing structural whitespace and fine borders to elevate the product photography.
- **Micro-Animations & Motion:** Substantial but refined scroll reveals, hover states, and smooth slide-out drawers to engage the user without breaking the luxury focus.
- **Custom Typography:** Editorial luxury pairing using *Cormorant Garamond* for titles and *Inter* for precise technical specifications and interface elements.

---

## ✨ Key Features

- **Dynamic Hero Section:** Immersive full-screen showcase of the watch craftsmanship using bold asymmetric typography.
- **The Yawm & Tareekh Collection:** Interactive variants selection (Olive Green, Pure Black, Sky Blue) with live status and specs updates.
- **Bespoke Specifications Grid:** Detailed look at the watch construction (Miyota 8285 Automatic, 316L Stainless Steel case, Sapphire Crystal, 50m Water Resistance).
- **Persistent Cart Engine:** Client-side React Context cart drawer supporting real-time item updates, removal, and visual feedback.
- **Luxury Checkout Flow:** Styled modal detailing shipping and purchase simulation.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS v4.0 (leveraging CSS `@theme` variables for lightning-fast compilation and theme synchronization)
- **State Management:** Custom React Context-based store with automatic synchronization
- **Fonts:** Optimized load via `next/font/google` (*Cormorant Garamond* & *Inter*)
- **Icons:** Inline optimized SVG vectors

---

## 📂 Project Structure

```
arabian-dial-concept/
├── public/                 # Static assets (watch photography)
│   └── watches/
│       ├── olive-green.png
│       ├── pure-black.png
│       └── sky-blue.png
├── src/
│   ├── app/                # Next.js App Router core
│   │   ├── layout.tsx      # SEO metadata, HTML skeleton & providers
│   │   ├── page.tsx        # Modular page builder
│   │   └── globals.css     # Global styles & Tailwind v4 theme configuration
│   ├── components/         # Premium UI Components
│   │   ├── Header.tsx      # Navigation & Cart indicator
│   │   ├── Hero.tsx        # Asymmetric hero visualizer
│   │   ├── ProductShowcase.tsx # Asymmetric variants showcase grid
│   │   ├── ProductCard.tsx # Hover-interactive individual card
│   │   ├── Specifications.tsx # Horological specs block
│   │   ├── CartDrawer.tsx  # Dynamic side-panel shopping cart
│   │   ├── CheckoutModal.tsx # Simulated luxury transaction screen
│   │   └── Footer.tsx      # Clean footer layout
│   └── lib/                # Shared utilities & states
│       ├── products.ts     # Curated product database
│       ├── cart-store.tsx  # Global cart state engine
│       └── use-scroll-reveal.ts # IntersectionObserver scroll reveal hook
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.x or later) and **npm** installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Burj-ul-Itqan/arabian-dial-concept.git
   cd arabian-dial-concept
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To compile a highly optimized production bundle:
```bash
npm run build
npm run start
```

---

## 🔗 Deployment

This application is built for seamless deployment on Vercel:
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Node.js Version:** `18.x` or `20.x`

Pushing to the `main` branch triggers automatic production deployment to [arabian-dial-concept.vercel.app](https://arabian-dial-concept.vercel.app).
