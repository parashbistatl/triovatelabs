import { auth } from "@/auth"
import { db } from "@/lib/db"
import { blogs } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await db.delete(blogs).where(eq(blogs.id, Number(id)))

  return NextResponse.json({ success: true })
}
