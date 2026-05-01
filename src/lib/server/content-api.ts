import "server-only";

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { UTApi, UTFile } from "uploadthing/server";
import type { Agreement, AgreementType } from "@/lib/types/agreement";
import { generateSecureAgreementSlug } from "@/lib/server/agreement-security";

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
  document_html?: string | null;
  password_hash?: string | null;
  currency_code?: string | null;
  expires_at?: string | Date | null;
  signed_at?: string | Date | null;
  signer_ip?: string | null;
  signer_name?: string | null;
  signature_data?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  NPR: "NPR",
};

const MONEY_VARIABLE_KEYS = new Set([
  "YOU_PAY",
  "TOTAL_VALUE",
  "PAYMENT_INSTALLMENT",
  "INCLUDED_VALUE",
  "SERVICE_PRICE",
  "SOCIAL_MGMT_FEE",
  "ADS_MGMT_FEE",
  "BONUS_1_VALUE",
  "BONUS_2_VALUE",
  "BONUS_3_VALUE",
  "MONTH_1_TOTAL",
  "MONTHLY_RETAINER",
  "ONBOARDING_FEE",
  "SOCIAL_SETUP_FEE",
  "MIN_AD_SPEND",
]);

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
          document_html TEXT,
          password_hash TEXT,
          currency_code TEXT NOT NULL DEFAULT 'NPR',
          expires_at TIMESTAMPTZ,
          signed_at TIMESTAMPTZ,
          signer_ip TEXT,
          signer_name TEXT,
          signature_data TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS document_html TEXT;
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS password_hash TEXT;
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS currency_code TEXT NOT NULL DEFAULT 'NPR';
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS signer_ip TEXT;
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS signer_name TEXT;
      `;

      await sql`
        ALTER TABLE site_agreements
        ADD COLUMN IF NOT EXISTS signature_data TEXT;
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

export function normalizeBlog(row: BlogRow | Record<string, unknown>) {
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

export function normalizeResource(row: ResourceRow | Record<string, unknown>) {
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

export function normalizeAgreement(row: AgreementRow | Record<string, unknown>) {
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
    documentHtml: row.document_html ? String(row.document_html) : null,
    currencyCode: String(row.currency_code || "NPR").toUpperCase(),
    expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
    passwordProtected: Boolean(row.password_hash),
    signedAt: row.signed_at ? new Date(row.signed_at).toISOString() : null,
    signerIp: row.signer_ip ? String(row.signer_ip) : null,
    signerName: row.signer_name ? String(row.signer_name) : null,
    signatureData: row.signature_data ? String(row.signature_data) : null,
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
  const agreement = await getAgreementRecordBySlug(slug);
  if (!agreement) {
    return null;
  }
  return hydrateAgreementRecord(agreement);
}

export async function getAgreementById(id: number) {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_agreements
    WHERE id = ${id}
    LIMIT 1
  `;

  const agreement = rows[0] as AgreementRow | undefined;
  if (!agreement) {
    return null;
  }
  return hydrateAgreementRecord(agreement);
}

export async function getAgreementRecordBySlug(slug: string) {
  await ensureTables();
  const rows = await sql`
    SELECT * FROM site_agreements
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] as AgreementRow | undefined;
}

export async function hydrateAgreementRecord(agreement: AgreementRow) {
  const data = normalizeAgreement(agreement);

  if (agreement.document_html) {
    return { ...data, html: appendAgreementSignatureProof(String(agreement.document_html), agreement) };
  }

  try {
    const html = await renderAgreementHtml(
      agreement.type,
      agreement.variables || {},
      String(agreement.currency_code || "NPR"),
    );
    return { ...data, html: appendAgreementSignatureProof(html, agreement) };
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

export const generateRandomSlug = generateSecureAgreementSlug;

const TEMPLATE_FILES: Record<string, string> = {
  website_proposal: "website-proposal.html",
  digital_starter_agreement: "digital-starter-agreement.html",
  digital_marketing_proposal: "digital-marketing-proposal.html",
};
const agreementTemplateCache = new Map<string, string>();

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function appendAgreementSignatureProof(html: string, agreement: AgreementRow) {
  if (!agreement.signed_at || !agreement.signer_name || html.includes('data-agreement-signature-proof="true"')) {
    return html;
  }

  const signedAt = new Date(agreement.signed_at).toLocaleString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const signatureProof = `
    <section data-agreement-signature-proof="true" style="padding: 32px 40px 40px; border-top: 1px solid #E5E7EB; background: #FFFFFF;">
      <div style="border: 1px solid #E5E7EB; border-radius: 18px; padding: 24px; background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">
        <div style="font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #B45309; font-weight: 700;">
          Signed Confirmation
        </div>
        <h3 style="margin-top: 12px; font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 24px; line-height: 1.2; color: #111827;">
          This agreement has been completed
        </h3>
        <p style="margin-top: 10px; font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #475569;">
          Signed by <strong>${escapeHtml(String(agreement.signer_name))}</strong> on <strong>${escapeHtml(signedAt)}</strong>.
        </p>
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 20px;">
          <div style="border: 1px solid #E5E7EB; border-radius: 14px; padding: 14px 16px; background: #FFFFFF;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748B; font-weight: 700;">Signer</div>
            <div style="margin-top: 8px; font-size: 15px; color: #111827; font-weight: 600;">${escapeHtml(String(agreement.signer_name))}</div>
          </div>
          <div style="border: 1px solid #E5E7EB; border-radius: 14px; padding: 14px 16px; background: #FFFFFF;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748B; font-weight: 700;">Audit Timestamp</div>
            <div style="margin-top: 8px; font-size: 15px; color: #111827; font-weight: 600;">${escapeHtml(signedAt)}</div>
          </div>
        </div>
        ${
          agreement.signature_data
            ? `<div style="margin-top: 20px; border: 1px solid #E5E7EB; border-radius: 16px; padding: 18px; background: #FFFFFF;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748B; font-weight: 700; margin-bottom: 12px;">Captured Signature</div>
                <img src="${agreement.signature_data}" alt="Captured signature" style="max-width: 320px; width: 100%; height: 110px; object-fit: contain; display: block;" />
              </div>`
            : ""
        }
      </div>
    </section>
  `;

  return html.includes("</body>")
    ? html.replace("</body>", `${signatureProof}</body>`)
    : `${html}${signatureProof}`;
}

function formatMoneyValue(value: string, currencyCode: string) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  if (!/^-?\d+([.,]\d+)?$/.test(trimmed.replace(/,/g, ""))) {
    return trimmed;
  }

  const numericValue = Number(trimmed.replace(/,/g, ""));
  if (Number.isNaN(numericValue)) return trimmed;

  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  return `${symbol} ${new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 2,
  }).format(numericValue)}`;
}

export function createAgreementTemplateDefaults(type: AgreementType, currencyCode = "NPR") {
  const baseDefaults: Record<string, string> = {
    CLIENT_NAME: "Client Name",
    CLIENT_CONTACT: "client@example.com",
    DATE: new Date().toLocaleDateString("en-NP", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    CLIENT_SHORT_NAME: "Client",
    CLIENT_LOCATION: "Kathmandu, Nepal",
    CLIENT_INDUSTRY: "Business",
    REF_NUMBER: "DSA-2026-001",
    TARGET_LOCATION: "Nepal",
  };

  const priceInWords =
    currencyCode.toUpperCase() === "NPR"
      ? "Fifty Thousand Nepali Rupees Only"
      : "Fifty Thousand Only";

  return {
    ...baseDefaults,
    YOU_PAY: "50000",
    TOTAL_VALUE: "65000",
    PAYMENT_INSTALLMENT: "25000",
    INCLUDED_VALUE: "15000",
    SERVICE_PRICE: "50000",
    PRICE_IN_WORDS: priceInWords,
    SOCIAL_MGMT_FEE: "25000",
    ADS_MGMT_FEE: "10000",
    BONUS_1_VALUE: "10000",
    BONUS_2_VALUE: "15000",
    BONUS_3_VALUE: "20000",
    MONTH_1_TOTAL: "35000",
    MONTHLY_RETAINER: "25000",
    ONBOARDING_FEE: "15000",
    SOCIAL_SETUP_FEE: "10000",
    MIN_AD_SPEND: "30000",
  };
}

export async function renderAgreementHtml(
  type: string,
  variables: Record<string, string>,
  currencyCode = "NPR",
) {
  const filename = TEMPLATE_FILES[type];
  if (!filename) {
    throw new Error(`Unknown agreement type: ${type}`);
  }

  const templatePath = path.join(process.cwd(), "src", "lib", "agreement-templates", filename);
  let html = agreementTemplateCache.get(templatePath);
  if (!html) {
    html = await readFile(templatePath, "utf8");
    agreementTemplateCache.set(templatePath, html);
  }
  const mergedVariables = {
    ...createAgreementTemplateDefaults(type as AgreementType, currencyCode),
    ...(variables ?? {}),
  };

  for (const [key, value] of Object.entries(mergedVariables)) {
    const outputValue = MONEY_VARIABLE_KEYS.has(key)
      ? formatMoneyValue(String(value ?? ""), currencyCode)
      : String(value ?? "");
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), outputValue);
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
