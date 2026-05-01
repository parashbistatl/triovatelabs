import { NextResponse } from "next/server";
import { ensureTables, normalizeAgreement, sql } from "@/lib/server/content-api";
import { hashAgreementPassword } from "@/lib/server/agreement-security";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM site_agreements WHERE id = ${Number(params.id)} LIMIT 1`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeAgreement(rows[0]));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreement", detail: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await ensureTables();
    const payload = await request.json();
    const title = payload.title ? String(payload.title).trim() : undefined;
    const variables = payload.variables;
    const documentHtml = payload.documentHtml !== undefined ? String(payload.documentHtml || "") : undefined;
    const currencyCode = payload.currencyCode ? String(payload.currencyCode).trim().toUpperCase() : undefined;
    const password = payload.password !== undefined ? String(payload.password).trim() : undefined;
    const expiresAt =
      payload.expiresAt !== undefined
        ? payload.expiresAt
          ? new Date(String(payload.expiresAt))
          : null
        : undefined;

    if (
      !title &&
      variables === undefined &&
      documentHtml === undefined &&
      currencyCode === undefined &&
      password === undefined &&
      expiresAt === undefined
    ) {
      return NextResponse.json(
        { error: "At least one updatable field is required" },
        { status: 400 },
      );
    }

    if (expiresAt instanceof Date && Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ error: "Invalid expiry date" }, { status: 400 });
    }

    const rows =
      expiresAt === undefined
        ? await sql`
            UPDATE site_agreements
            SET
              title = COALESCE(${title}, title),
              variables = COALESCE(${variables !== undefined ? JSON.stringify(variables) : null}, variables),
              document_html = COALESCE(${documentHtml ?? null}, document_html),
              currency_code = COALESCE(${currencyCode}, currency_code),
              password_hash = COALESCE(${password ? hashAgreementPassword(password) : null}, password_hash),
              updated_at = NOW()
            WHERE id = ${Number(params.id)}
            RETURNING *
          `
        : await sql`
            UPDATE site_agreements
            SET
              title = COALESCE(${title}, title),
              variables = COALESCE(${variables !== undefined ? JSON.stringify(variables) : null}, variables),
              document_html = COALESCE(${documentHtml ?? null}, document_html),
              currency_code = COALESCE(${currencyCode}, currency_code),
              password_hash = COALESCE(${password ? hashAgreementPassword(password) : null}, password_hash),
              expires_at = ${expiresAt ? expiresAt.toISOString() : null},
              updated_at = NOW()
            WHERE id = ${Number(params.id)}
            RETURNING *
          `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeAgreement(rows[0]));
  } catch (error) {
    return NextResponse.json({ error: "Failed to update agreement", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await ensureTables();
    await sql`DELETE FROM site_agreements WHERE id = ${Number(params.id)}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete agreement", detail: String(error) }, { status: 500 });
  }
}
