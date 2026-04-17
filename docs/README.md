# Triovate Labs Website Documentation

This directory contains comprehensive markdown documentation for each page of the Triovate Labs website.

## Application Overview

**Type:** React + Vite Single Page Application (SPA)
**Framework:** React 18 with TypeScript
**Routing:** React Router v6
**Styling:** Tailwind CSS with custom design system
**UI Components:** Radix UI + shadcn/ui
**Animations:** Framer Motion

## Site Structure

### Main Pages

| Page | Route | File | Description |
|------|-------|------|-------------|
| **Home** | `/` | [home.md](./home.md) | Main landing page with services overview |
| **New Index** | `/new` | [new-index.md](./new-index.md) | Alternative homepage design |
| **About** | `/about` | [about.md](./about.md) | Company philosophy and work process |
| **Services** | `/services` | [services.md](./services.md) | Detailed service offerings |
| **Contact** | `/contact` | [contact.md](./contact.md) | Contact form and information |
| **Privacy Policy** | `/privacy-policy` | [privacy-policy.md](./privacy-policy.md) | Privacy policy and data practices |
| **404** | `*` | [404.md](./404.md) | Error page for non-existent routes |

## Core Services

### 1. Website Development
Custom websites and web applications built for performance and scale. Focus on UX, conversion, and modern frameworks.

### 2. Digital Marketing & Growth
Data-driven campaigns with SEO, paid ads, and landing page optimization. Measurable ROI tracking.

### 3. Custom Software
Purpose-built internal tools and automation platforms for operational efficiency.

## Key Features

### Design System
- **Primary Color:** Gold (#D4AF37)
- **Tech Colors:** Blue (#1E3A8A), Red (#E63946)
- **Typography:** System fonts with responsive scaling
- **Animations:** Scroll-based parallax, reveal effects, 3D transforms

### User Experience
- Dynamic background color transitions
- 3D-tilted images with scroll interaction
- Smooth scroll navigation with hash support
- Progressive reveal animations
- Responsive design across all devices
- Performance-optimized lazy loading

### Technical Features
- Form validation with Zod schemas
- Honeypot spam protection
- React Hook Form integration
- Toast notifications
- Analytics tracking attributes
- Console error logging for 404s

## Contact Information

**Company:** Triovate Labs
**Email:** info@triovatelabs.com
**Phone:** +977-9707098190
**Location:** Kathmandu, Nepal

## Navigation

The website features a persistent navigation bar and footer across all pages:

- **Logo:** Links to home page
- **Navigation Menu:** Access to all main pages
- **Scroll to Top:** Quick return to page top
- **Footer:** Contact info and social links

## Form Fields (Contact Page)

### Required Information
- Full Name
- Email (validated)
- Phone Number (international format)
- Company Name
- Project Type (dropdown)
- Budget Range (dropdown)
- Timeline (dropdown)
- Project Details (min 10 characters)
- Privacy Policy Agreement (checkbox)

### Project Types Available
- Website Development
- Mobile Application Development
- Paid Ads Management
- Social Media Management
- IT Consultation
- Maintenance & Support

## Brand Messaging

### Value Propositions
1. **Clear Scope & Delivery:** No ambiguity, predictable execution
2. **Structure & Documentation:** Maintainable, transferable systems
3. **Performance-First:** Fast, optimized, reliable builds
4. **Full Ownership:** Complete asset and code transfer

### Target Audience
Businesses and teams seeking:
- Professional web development
- Growth marketing systems
- Custom operational software
- Structured, documented processes
- Long-term maintainability

### Not a Fit For
- Budget-only focused clients
- Unclear scope with constant pivots
- Those seeking the cheapest option

## Development Process

1. **Alignment** - Goals, users, constraints, success metrics
2. **Design/Architecture** - Structure, interfaces, content flow
3. **Build/QA/Launch** - Iterative development with quality checks
4. **Handoff/Support** - Documentation, ownership transfer, ongoing support

## File Organization

```
docs/
├── README.md           # This file - documentation index
├── home.md            # Main landing page (/)
├── new-index.md       # Alternative homepage (/new)
├── about.md           # About page (/about)
├── services.md        # Services page (/services)
├── contact.md         # Contact page (/contact)
├── privacy-policy.md  # Privacy policy (/privacy-policy)
└── 404.md             # Error page (*)
```

## Last Updated

Generated: January 2026

---

**Note:** This documentation was automatically generated from the React TypeScript source code. For the most current information, please refer to the live website or source code.
