import { NextResponse } from "next/server";
import type { AgreementType } from "@/lib/types/agreement";
import {
  createAgreementTemplateDefaults,
  ensureTables,
  generateRandomSlug,
  normalizeAgreement,
  sql,
} from "@/lib/server/content-api";
import { hashAgreementPassword } from "@/lib/server/agreement-security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM site_agreements ORDER BY created_at DESC`;
    return NextResponse.json(rows.map(normalizeAgreement));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreements", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTables();
    const payload = await request.json();
    const type = String(payload.type || "").trim();
    const title = String(payload.title || "").trim();
    const currencyCode = String(payload.currencyCode || "NPR").trim().toUpperCase() || "NPR";
    const variables = {
      ...createAgreementTemplateDefaults(type as AgreementType, currencyCode),
      ...(payload.variables || {}),
    };
    const documentHtml = payload.documentHtml ? String(payload.documentHtml) : null;
    const password = String(payload.password || "").trim();
    const expiresAt = payload.expiresAt ? new Date(String(payload.expiresAt)) : null;

    if (!type || !title || !password) {
      return NextResponse.json({ error: "Type, title, and password are required" }, { status: 400 });
    }

    if (expiresAt && Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ error: "Invalid expiry date" }, { status: 400 });
    }

    let slug = "";
    let retries = 0;
    while (retries < 5) {
      slug = generateRandomSlug();
      const existing = await sql`SELECT id FROM site_agreements WHERE slug = ${slug} LIMIT 1`;
      if (existing.length === 0) break;
      retries += 1;
    }

    if (!slug) {
      return NextResponse.json({ error: "Failed to generate unique slug" }, { status: 500 });
    }

    const rows = await sql`
      INSERT INTO site_agreements (
        slug,
        type,
        title,
        variables,
        document_html,
        password_hash,
        currency_code,
        expires_at,
        created_at,
        updated_at
      )
      VALUES (
        ${slug},
        ${type},
        ${title},
        ${JSON.stringify(variables)},
        ${documentHtml},
        ${hashAgreementPassword(password)},
        ${currencyCode},
        ${expiresAt ? expiresAt.toISOString() : null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(normalizeAgreement(rows[0]));
  } catch (error) {
    return NextResponse.json({ error: "Failed to create agreement", detail: String(error) }, { status: 500 });
  }
}
