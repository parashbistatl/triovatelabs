import { auth } from "@/auth"
import { db } from "@/lib/db"
import { blogs } from "@/lib/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const rows = await db.select().from(blogs).orderBy(desc(blogs.createdAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const payload = {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt ?? null,
    body: body.body ?? null,
    author: body.author ?? null,
    coverImage: body.coverImage ?? null,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
  }

  if (body.id) {
    const [updated] = await db.update(blogs).set(payload).where(eq(blogs.id, Number(body.id))).returning()
    return NextResponse.json(updated)
  }

  const [created] = await db.insert(blogs).values(payload).returning()
  return NextResponse.json(created)
}
