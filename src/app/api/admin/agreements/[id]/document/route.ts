import { NextResponse } from "next/server";
import { getAgreementById } from "@/lib/server/content-api";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const agreement = await getAgreementById(Number(params.id));

    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json(agreement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreement document", detail: String(error) }, { status: 500 });
  }
}
