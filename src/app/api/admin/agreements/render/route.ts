import { NextResponse } from "next/server";
import type { AgreementType } from "@/lib/types/agreement";
import {
  createAgreementTemplateDefaults,
  renderAgreementHtml,
} from "@/lib/server/content-api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const type = String(payload.type || "").trim();
    const currencyCode = String(payload.currencyCode || "NPR").trim().toUpperCase() || "NPR";
    const variables = {
      ...createAgreementTemplateDefaults(type as AgreementType, currencyCode),
      ...(payload.variables || {}),
    };

    if (!type) {
      return NextResponse.json({ error: "Agreement type is required" }, { status: 400 });
    }

    const html = await renderAgreementHtml(type, variables, currencyCode);
    return NextResponse.json({ html, variables });
  } catch (error) {
    return NextResponse.json({ error: "Failed to render agreement", detail: String(error) }, { status: 500 });
  }
}
