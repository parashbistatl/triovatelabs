# Project Memory: triovate-golden-glow-main

## Stack
- React + TypeScript + Vite, Tailwind CSS, React Router
- Deployed via Netlify (public/ → static assets)

## Key Files
- Hero: `src/components/sections/Hero.tsx` — dual-video crossfade system, deferred load
- Home page: `src/pages/Index.tsx`
- Global CSS: `src/index.css`

## Video Optimization (done 2026-03-12)
- Original: `public/video.mp4` — 12MB, H.264, 1904×1088, ~20Mbps
- Optimized outputs in `public/videos/`:
  - `hero-mobile.mp4` — 553KB (mobile, 640p, faststart)
  - `hero-mobile.webm` — 879KB
  - `hero-desktop.mp4` — 5.6MB (desktop, 1920p, faststart)
  - `hero-desktop.webm` — 6.1MB
  - `hero-poster.webp` — 82KB (extracted from frame at 1s, 1280×730, q65)
- Desktop: video starts immediately after window `load` event (no idle callback delay), preload="auto" on vid1
- Mobile: no video at all — `bg-white`, dark text, premium white layout
- contain: strict on hero section; content-visibility: auto on below-fold sections
- Mobile hero: white bg, gold pill tag, dark headline, gold accent rule, stats row (50+/100%/5★), gold CTA, "Free consultation · No commitment" micro-copy
- Logo: BrandMark (with shadow) on desktop, plain img (no shadow) on mobile for white bg
- Bottom gold gradient kept on both mobile and desktop for transition to services section

## Patterns
- LCP image: `<img fetchPriority="high" loading="eager" decoding="sync">` not CSS background
- Below-fold images: `loading="lazy" decoding="async"`
- Video never competes with LCP — rendered only after idle callback fires post-load
