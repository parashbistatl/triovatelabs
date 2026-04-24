import { NextResponse } from "next/server";
import { ensureTables, normalizeAgreement, sql } from "@/lib/server/content-api";

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

    if (!title && variables === undefined) {
      return NextResponse.json(
        { error: "At least one field (title or variables) is required" },
        { status: 400 },
      );
    }

    const rows = await sql`
      UPDATE site_agreements
      SET
        title = COALESCE(${title}, title),
        variables = COALESCE(${variables !== undefined ? JSON.stringify(variables) : null}, variables),
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
