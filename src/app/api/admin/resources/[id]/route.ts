import { NextResponse } from "next/server";
import { ensureTables, sql } from "@/lib/server/content-api";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await ensureTables();
    await sql`DELETE FROM site_resources WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resource", detail: String(error) }, { status: 500 });
  }
}
