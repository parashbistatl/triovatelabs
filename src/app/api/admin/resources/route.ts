import { NextResponse } from "next/server";
import { ensureTables, normalizeResource, normalizeStatusValue, sql } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM site_resources ORDER BY created_at DESC`;
    return NextResponse.json(rows.map(normalizeResource));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTables();
    const payload = await request.json();
    const id = payload.id || `admin-resource-${Date.now()}`;
    const title = String(payload.title || "").trim();
    const slug = String(payload.slug || "").trim();
    const description = String(payload.description || "").trim();
    const thumbnail = String(payload.thumbnail || "").trim();
    const pdfUrl = String(payload.pdfUrl || "").trim();
    const status = normalizeStatusValue(payload.status);

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (!title || !description || !thumbnail || !pdfUrl) {
      return NextResponse.json(
        { error: "Title, description, thumbnail, and PDF are required" },
        { status: 400 },
      );
    }

    if (!status) {
      return NextResponse.json({ error: "Status must be either 'draft' or 'published'" }, { status: 400 });
    }

    const slugConflict = await sql`
      SELECT id FROM site_resources
      WHERE slug = ${slug}
      AND id <> ${id}
      LIMIT 1
    `;

    if (slugConflict.length > 0) {
      return NextResponse.json({ error: "Slug already exists. Use a unique slug." }, { status: 409 });
    }

    const rows = await sql`
      INSERT INTO site_resources (id, slug, title, description, thumbnail, pdf_url, status)
      VALUES (${id}, ${slug}, ${title}, ${description}, ${thumbnail}, ${pdfUrl}, ${status})
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        thumbnail = EXCLUDED.thumbnail,
        pdf_url = EXCLUDED.pdf_url,
        status = EXCLUDED.status
      RETURNING *
    `;

    return NextResponse.json(normalizeResource(rows[0]));
  } catch (error) {
    return NextResponse.json({ error: "Failed to save resource", detail: String(error) }, { status: 500 });
  }
}
