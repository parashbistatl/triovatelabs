import { NextResponse } from "next/server";
import { ensureTables, renderAgreementHtml, sql } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  await ensureTables();
  const rows = await sql`SELECT * FROM site_agreements WHERE slug = ${params.slug} LIMIT 1`;

  if (rows.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const agreement = rows[0];
  const html = await renderAgreementHtml(agreement.type, agreement.variables || {});

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
