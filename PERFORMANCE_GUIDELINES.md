# Triovate Labs - Performance & Animation System

## UNIFIED ANIMATION SYSTEM

### Timing Constants (CSS Variables)
```css
--timing-instant: 0ms     /* No animation */
--timing-fast: 120ms      /* Hover/Interactive */
--timing-base: 180ms      /* Content entrance */
--timing-slow: 250ms      /* Section changes */
--timing-page: 300ms      /* Page transitions */
```

### Easing Functions
```css
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1)  /* Default - natural feel */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)        /* Entrance animations */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)      /* Two-way transitions */
```

## GOLDEN RULES

### Motion Constraints
- **Maximum translateY**: 8px (never more)
- **Maximum scale**: 1.02 (avoid bouncy feels)
- **NO rotation on hover** (causes jank)
- **NO dramatic motion** (feels cheap)

### When to Animate
✅ **ALLOWED:**
- Button hover states (120ms + translateY(-1px to -2px))
- Link underlines (180ms width transition)
- Card elevation (180ms box-shadow)
- Page entrance (250ms opacity + translateY(4px))

❌ **FORBIDDEN:**
- Background animations during scroll
- Continuous animations (pulse, rotate, etc.)
- 3D transforms on scroll
- Parallax effects
- Scale transforms > 1.02
- Rotation on hover
- Multiple simultaneous transforms

## SPECIFIC USE CASES

### 1. BUTTONS
```jsx
// PRIMARY BUTTON
style={{
  transition: 'transform var(--timing-fast) var(--ease-smooth), box-shadow var(--timing-fast) var(--ease-smooth)'
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.4)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.3)';
}}
```

### 2. LINKS
```css
.nav-link {
  transition: color var(--timing-fast) var(--ease-smooth);
}
.nav-link::before {
  transition: width var(--timing-base) var(--ease-smooth);
}
```

### 3. CARDS
```css
.card {
  transition: transform var(--timing-fast) var(--ease-smooth),
              box-shadow var(--timing-base) var(--ease-smooth);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px hsl(var(--gold) / 0.08);
}
```

## PERFORMANCE OPTIMIZATIONS

### Disabled for Performance
- AnimatedGridPattern component (removed)
- QuantumOrbits component (removed)
- Background color transitions > 400ms
- 3D image tilts on scroll
- Continuous animations (pulse, rotate, glow)
- Heavy blur effects (>8px)
- Decorative particles

### Scroll Behavior
- Use `requestAnimationFrame` throttling
- No calculations outside RAF callback
- Passive event listeners only
- Maximum transition: 400ms
- No will-change on scroll elements

### CSS Containment
```css
section, article, div[class*="container"] {
  contain: layout style;
}

.glass-morphism {
  contain: layout style paint;
}
```

### Loading Strategy
```jsx
<img loading="lazy" />  /* All non-hero images */
```

## SCROLL ANIMATION RULES

### Page Scroll
- Behavior: `instant` on navigation clicks
- No smooth scroll animations
- No scroll-jacking

### Background Transitions
```css
/* Maximum duration: 400ms */
transition: background 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Content Entrance
```css
/* Maximum: opacity + translateY(8px) */
/* Duration: 180-250ms */
opacity: 0;
transform: translateY(8px);
transition: opacity var(--timing-base) var(--ease-out),
            transform var(--timing-base) var(--ease-out);
```

## FOOTER & LAYOUT

### Page Structure
```jsx
<div className="flex flex-col min-h-screen">
  {/* Content */}
  <div className="mt-auto">
    <SiteFooter />
  </div>
</div>
```

### Overflow Control
```css
html, body {
  overflow-x: hidden;
}
```

## BLUR EFFECTS

### Maximum Blur Values
- Navigation: `blur(8px)`
- Glass morphism: `blur(4-6px)`
- Background elements: `blur(20px)` (static only)
- **NEVER** animate blur values

## DEVELOPER CHECKLIST

Before adding any animation, ask:
1. Is this animation necessary?
2. Can I achieve this with opacity or color only?
3. Is the duration ≤ 250ms?
4. Does it use the unified timing system?
5. Will this cause layout shift or jank?
6. Can this block user interaction?

If you answer "yes" to questions 5 or 6, **don't do it**.

## ONE-LINE RULE FOR DEVELOPERS

**"Fast, subtle, and intentional. If users notice the animation itself, it's too much."**

## ANIMATION BUDGET

Maximum simultaneous animations on screen: **3**

Priority order:
1. User-initiated interactions (hover, click)
2. Page entrance
3. Content reveal

Everything else: **removed**.
