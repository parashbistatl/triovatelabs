# Triovate Labs Marketing Site

This repository contains the current Next.js marketing website and admin panel for Triovate Labs.

## Stack

- Next.js 14 app router
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- NextAuth credentials auth for `/labadmin`
- Neon Postgres for blogs, resources, and agreements
- UploadThing for production file uploads
- Netlify with `@netlify/plugin-nextjs`

## Local development

Requirements:

- Node.js 20
- npm 10+

Run locally:

```bash
npm install
npm run dev
```

Default local URL:

```bash
http://localhost:3000
```

## Netlify deployment

This project is configured with the `netlify.toml` file and the Next.js Netlify plugin.

Required Netlify environment variables:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `UPLOADTHING_TOKEN`

Recommended:

- `NODE_VERSION=20`

## Production upload behavior

- In local development, uploads can still fall back to `public/uploads` if UploadThing is not configured.
- In production, uploads must use UploadThing.
- If `UPLOADTHING_TOKEN` is missing on Netlify, image/PDF uploads will fail with a clear error instead of silently writing to ephemeral local storage.

This keeps production behavior stable for:

- blog cover images
- inline blog images
- resource thumbnails
- resource PDFs

## What should work in production

- Admin login and protected `/labadmin/*` routes
- Blog CRUD with cover image and inline article images
- Resource CRUD with image and PDF uploads
- Agreement creation and public agreement pages
- Public blog/resource pages reading live database content

## Deployment checklist

1. Add the required environment variables in Netlify.
2. Confirm your Neon database is reachable from Netlify.
3. Confirm UploadThing is configured and active.
4. Set `NEXTAUTH_URL` to your real production domain.
5. Update `public/sitemap.xml` and `public/robots.txt` if the production domain changes.
6. Deploy and test:
   - admin login
   - create a blog with cover image + inline image
   - create a resource with thumbnail + PDF
   - open public blog/resource/agreement pages

## Notes

- This README is intentionally aligned with the current Next.js app structure, not the old Vite setup.
- There are existing unrelated lint issues in the repository; deployment readiness here focuses on runtime behavior and production hosting safety.
