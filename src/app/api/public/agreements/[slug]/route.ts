import { NextResponse } from "next/server";
import {
  ensureTables,
  normalizeAgreement,
  renderAgreementHtml,
  sql,
} from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM site_agreements WHERE slug = ${params.slug} LIMIT 1`;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    const agreement = rows[0];
    const data = normalizeAgreement(agreement);

    try {
      const html = await renderAgreementHtml(agreement.type, agreement.variables || {});
      return NextResponse.json({ ...data, html });
    } catch {
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreement", detail: String(error) }, { status: 500 });
  }
}
