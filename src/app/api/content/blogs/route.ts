import { NextResponse } from "next/server";
import { ensureTables, normalizeBlog, sql } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureTables();
    const rows = await sql`
      SELECT * FROM site_blogs
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC
    `;
    return NextResponse.json(rows.map(normalizeBlog));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs", detail: String(error) }, { status: 500 });
  }
}
