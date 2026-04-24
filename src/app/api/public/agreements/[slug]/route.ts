import { NextResponse } from "next/server";
import {
  ensureTables,
  getAgreementBySlug,
} from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    await ensureTables();
    const agreement = await getAgreementBySlug(params.slug);

    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json(agreement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreement", detail: String(error) }, { status: 500 });
  }
}
