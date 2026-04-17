import { auth } from "@/auth"
import { db } from "@/lib/db"
import { resources } from "@/lib/schema"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const rows = await db.select().from(resources).orderBy(desc(resources.createdAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const [created] = await db
    .insert(resources)
    .values({
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      thumbnail: body.thumbnail ?? null,
      pdfUrl: body.pdfUrl ?? null,
    })
    .returning()

  return NextResponse.json(created)
}
