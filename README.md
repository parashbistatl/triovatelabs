# Triovate Labs Marketing Site

This repository contains the marketing website for **Triovate Labs** – a premium, performance‑oriented site for web development, digital marketing, and custom software services.

The app is a modern React single‑page application with a custom design system and a strong focus on performance, accessibility, and SEO.

---

## Tech stack

- **Build tool**: [Vite](https://vitejs.dev/) (React + TypeScript template)
- **UI library**: React 18 + [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom design token system (`src/index.css`)
- **UI components**: [shadcn/ui](https://ui.shadcn.com/) on top of [Radix UI](https://www.radix-ui.com/)
- **Animations / 3D**: Framer Motion (for some components), custom CSS keyframes, light Three.js usage for 3D effects
- **Forms & validation**: `react-hook-form` + `zod`

For a page‑by‑page breakdown of content and UX, see `docs/README.md`.

---

## Getting started

Requirements:

- Node.js 18+ (recommended via [`nvm`](https://github.com/nvm-sh/nvm))
- npm 10+ (comes with Node 18+)

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Useful scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint across the codebase
```

---

## Project structure (high level)

```text
src/
  components/
    sections/      # Page-specific sections (e.g. home Hero)
    ui/            # Shared design-system + shadcn UI components
  pages/
    Index.tsx      # Home page (/)
    About.tsx      # About page (/about)
    Services.tsx   # Services page (/services)
    Contact.tsx    # Contact page (/contact)
    PrivacyPolicy.tsx
    NotFound.tsx   # 404 catch-all
  hooks/
    usePageSeo.ts  # Per-page SEO (title/meta/OG/Twitter/canonical)
    useScrollTilt.ts
index.css          # Global Tailwind + design tokens
public/
  favicon.png
  triovate.png
  triovate1.png    # Primary brand mark used in heroes / social images
  robots.txt
  sitemap.xml
```

Routing is handled by React Router; the main route configuration lives in `src/main.tsx` / `src/App.tsx`.

---

## SEO, meta tags & social sharing

- Base `<head>` tags live in `index.html` (title, description, canonical, Open Graph, Twitter card, Organization/ProfessionalService JSON‑LD).
- Per‑page SEO is handled via the `usePageSeo` hook in:
  - `Index.tsx`
  - `About.tsx`
  - `Services.tsx`
  - `Contact.tsx`
- `public/robots.txt` and `public/sitemap.xml` are checked into the repo and assume the production origin is:
  - `https://triovatelabs.com`
  - If you deploy under a different domain, update:
    - `VITE_SITE_URL` (see below)
    - `index.html` OG/canonical URLs
    - `robots.txt` and `sitemap.xml`

### Environment

The SEO hook uses `VITE_SITE_URL` if present:

```bash
VITE_SITE_URL=https://your-domain.example.com
```

Create a `.env` or `.env.local` file at the project root to override the default.

---

## Contact form behaviour

The contact form (`Contact.tsx`) currently:

- Validates all fields with `zod` + `react-hook-form`
- Uses a hidden `website` field as a honeypot (spam protection)
- On successful submission:
  - Adds a `data-analytics="lead-submitted"` attribute to the `<form>`
  - Shows a toast: “Thanks! Your message has been received.”
  - Resets the form fields

There is **no backend integration configured yet**. To wire this up to an API or email provider:

1. Update the `onSubmit` handler in `Contact.tsx` to `fetch`/`axios.post` to your backend.
2. Handle errors and success responses (show an appropriate toast).

---

## Development notes

- The design system (colors, radii, shadows, gradients, motion tokens) is defined in `src/index.css` under `@layer base`.
- Many components rely on Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`) for first‑fold layout on mobile vs. desktop.
- Some 3D / animated components use Three.js and Framer Motion; if you remove them, also clean up unused imports to keep bundle size small.

For deeper documentation and UX copy, see the markdown files under `docs/`. This README focuses on how to run and extend the codebase.
