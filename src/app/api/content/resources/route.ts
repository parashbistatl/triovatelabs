import { NextResponse } from "next/server";
import { ensureTables, normalizeResource, sql } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureTables();
    const rows = await sql`
      SELECT * FROM site_resources
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows.map(normalizeResource));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources", detail: String(error) }, { status: 500 });
  }
}
