import "server-only";

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { UTApi, UTFile } from "uploadthing/server";
import type { Agreement, AgreementType } from "@/lib/types/agreement";

const sql = neon(process.env.DATABASE_URL!);
const publicUploadsDir = path.join(process.cwd(), "public", "uploads");

function isHostedEnvironment() {
  return (
    process.env.NETLIFY === "true" ||
    process.env.VERCEL === "1" ||
    process.env.CONTEXT === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function getUploadThingClient() {
  if (!process.env.UPLOADTHING_TOKEN) {
    return null;
  }

  return new UTApi({ token: process.env.UPLOADTHING_TOKEN });
}

export type ContentStatus = "draft" | "published";

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  cover_image: string;
  status: string;
  published_at: string | Date;
  created_at?: string | Date;
};

export type ResourceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  pdf_url: string;
  status: string;
  created_at?: string | Date;
};

export type AgreementRow = {
  id: number;
  slug: string;
  type: string;
  title: string;
  variables: Record<string, string>;
  created_at: string | Date;
  updated_at: string | Date;
};

let ensureTablesPromise: Promise<void> | null = null;

export async function ensureTables() {
  if (!ensureTablesPromise) {
    ensureTablesPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS site_blogs (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          body TEXT NOT NULL,
          author TEXT NOT NULL,
          cover_image TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'published',
          published_at DATE NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      await sql`
        ALTER TABLE site_blogs
        ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS site_resources (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          thumbnail TEXT NOT NULL,
          pdf_url TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'published',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      await sql`
        ALTER TABLE site_resources
        ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS site_agreements (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          variables JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;
    })().catch((error) => {
      ensureTablesPromise = null;
      throw error;
    });
  }

  await ensureTablesPromise;
}

export function normalizeStatusValue(value: unknown): ContentStatus | null {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "draft") return "draft";
  if (raw === "published") return "published";
  return null;
}

export function toIsoDate(value: unknown) {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function normalizeBlog(row: BlogRow | Record<string, any>) {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    body: String(row.body),
    author: String(row.author),
    coverImage: String(row.cover_image),
    status: normalizeStatusValue(row.status) || "published",
    publishedAt: toIsoDate(row.published_at),
  };
}

export function normalizeResource(row: ResourceRow | Record<string, any>) {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    thumbnail: String(row.thumbnail),
    pdfUrl: String(row.pdf_url),
    status: normalizeStatusValue(row.status) || "published",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
}

export function normalizeAgreement(row: AgreementRow | Record<string, any>) {
  const rawType = String(row.type);
  const agreementType: AgreementType =
    rawType === "website_proposal" ||
    rawType === "digital_starter_agreement" ||
    rawType === "digital_marketing_proposal"
      ? rawType
      : "website_proposal";

  const normalized: Agreement = {
    id: Number(row.id),
    slug: String(row.slug),
    type: agreementType,
    title: String(row.title),
    variables: row.variables || {},
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };

  return normalized;
}

export async function getAdminBlogs() {
  await ensureTables();
  const rows = await sql`SELECT * FROM site_blogs ORDER BY published_at DESC, created_at DESC`;
  return rows.map(normalizeBlog);
}

export async function getAdminResources() {
  await ensureTables();
  const rows = await sql`SELECT * FROM site_resources ORDER BY created_at DESC`;
  return rows.map(normalizeResource);
}

export async function getAdminAgreements() {
  await ensureTables();
  const rows = await sql`SELECT * FROM site_agreements ORDER BY created_at DESC`;
  return rows.map(normalizeAgreement);
}

export async function getAgreementBySlug(slug: string) {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_agreements
    WHERE slug = ${slug}
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  const agreement = rows[0];
  const data = normalizeAgreement(agreement);

  try {
    const html = await renderAgreementHtml(agreement.type, agreement.variables || {});
    return { ...data, html };
  } catch {
    return data;
  }
}

export async function getAdminStats() {
  await ensureTables();
  const [blogRows, resourceRows, agreementRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM site_blogs`,
    sql`SELECT COUNT(*)::int AS count FROM site_resources`,
    sql`SELECT COUNT(*)::int AS count FROM site_agreements`,
  ]);

  return {
    blogCount: Number(blogRows[0]?.count ?? 0),
    resourceCount: Number(resourceRows[0]?.count ?? 0),
    agreementCount: Number(agreementRows[0]?.count ?? 0),
  };
}

export async function getPublishedBlogs() {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_blogs
    WHERE status = 'published'
    ORDER BY published_at DESC, created_at DESC
  `;
  return rows.map(normalizeBlog);
}

export async function getPublishedBlogBySlug(slug: string) {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_blogs
    WHERE slug = ${slug}
    AND status = 'published'
    LIMIT 1
  `;
  return rows[0] ? normalizeBlog(rows[0]) : null;
}

export async function getPublishedResources() {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_resources
    WHERE status = 'published'
    ORDER BY created_at DESC
  `;
  return rows.map(normalizeResource);
}

export async function getPublishedResourceBySlug(slug: string) {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_resources
    WHERE slug = ${slug}
    AND status = 'published'
    LIMIT 1
  `;
  return rows[0] ? normalizeResource(rows[0]) : null;
}

export function generateRandomSlug() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i += 1) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

const TEMPLATE_FILES: Record<string, string> = {
  website_proposal: "website-proposal.html",
  digital_starter_agreement: "digital-starter-agreement.html",
  digital_marketing_proposal: "digital-marketing-proposal.html",
};

export async function renderAgreementHtml(type: string, variables: Record<string, string>) {
  const filename = TEMPLATE_FILES[type];
  if (!filename) {
    throw new Error(`Unknown agreement type: ${type}`);
  }

  const templatePath = path.join(process.cwd(), "src", "lib", "agreement-templates", filename);
  let html = await readFile(templatePath, "utf8");

  for (const [key, value] of Object.entries(variables ?? {})) {
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value ?? ""));
  }

  return html.replace(/\{\{[A-Z_]+\}\}/g, "");
}

export async function uploadFileWithFallback(file: File, kind: "image" | "pdf") {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeExt = path.extname(file.name || "") || (kind === "pdf" ? ".pdf" : ".bin");
  const uploadThingClient = getUploadThingClient();

  if (uploadThingClient) {
    const utFile = new UTFile([bytes], file.name || `upload${safeExt}`, {
      type: file.type,
      lastModified: Date.now(),
    });

    const result = await uploadThingClient.uploadFiles(utFile);
    if (result && !result.error && result.data) {
      return {
        key: result.data.key,
        url: result.data.ufsUrl || result.data.url,
        provider: "uploadthing",
      };
    }

    throw new Error(result?.error?.message || "UploadThing upload failed");
  }

  if (isHostedEnvironment()) {
    throw new Error(
      "UploadThing is required in production. Set UPLOADTHING_TOKEN in your Netlify environment variables.",
    );
  }

  await mkdir(publicUploadsDir, { recursive: true });
  const filename = `${Date.now()}-${randomUUID()}${safeExt}`;
  const fullPath = path.join(publicUploadsDir, filename);
  await writeFile(fullPath, bytes);

  return {
    key: `local-${filename}`,
    url: `/uploads/${filename}`,
    provider: "local",
  };
}

export { sql };
