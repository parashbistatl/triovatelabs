import { NextResponse } from "next/server";
import { ensureTables, normalizeBlog, normalizeStatusValue, sql, toIsoDate } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await ensureTables();
    const rows = await sql`SELECT * FROM site_blogs ORDER BY published_at DESC, created_at DESC`;
    return NextResponse.json(rows.map(normalizeBlog));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTables();
    const payload = await request.json();
    const id = payload.id || `admin-blog-${Date.now()}`;
    const title = String(payload.title || "").trim();
    const slug = String(payload.slug || "").trim();
    const excerpt = String(payload.excerpt || "").trim();
    const body = String(payload.body || "").trim();
    const author = String(payload.author || "").trim();
    const coverImage = String(payload.coverImage || "").trim();
    const status = normalizeStatusValue(payload.status);

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (!title || !excerpt || !body || !author || !coverImage) {
      return NextResponse.json(
        { error: "Title, excerpt, body, author, and cover image are required" },
        { status: 400 },
      );
    }

    if (!status) {
      return NextResponse.json({ error: "Status must be either 'draft' or 'published'" }, { status: 400 });
    }

    const slugConflict = await sql`
      SELECT id FROM site_blogs
      WHERE slug = ${slug}
      AND id <> ${id}
      LIMIT 1
    `;

    if (slugConflict.length > 0) {
      return NextResponse.json({ error: "Slug already exists. Use a unique slug." }, { status: 409 });
    }

    const rows = await sql`
      INSERT INTO site_blogs (id, slug, title, excerpt, body, author, cover_image, status, published_at)
      VALUES (${id}, ${slug}, ${title}, ${excerpt}, ${body}, ${author}, ${coverImage}, ${status}, ${toIsoDate(payload.publishedAt)})
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        body = EXCLUDED.body,
        author = EXCLUDED.author,
        cover_image = EXCLUDED.cover_image,
        status = EXCLUDED.status,
        published_at = EXCLUDED.published_at
      RETURNING *
    `;

    return NextResponse.json(normalizeBlog(rows[0]));
  } catch (error) {
    return NextResponse.json({ error: "Failed to save blog", detail: String(error) }, { status: 500 });
  }
}
