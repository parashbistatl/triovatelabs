import { NextResponse } from "next/server";
import { ensureTables, getAgreementRecordBySlug, normalizeAgreement, sql } from "@/lib/server/content-api";
import { getAgreementAccessCookieName, hasAgreementAccessCookieValue } from "@/lib/server/agreement-security";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    await ensureTables();
    const agreementRecord = await getAgreementRecordBySlug(params.slug);

    if (!agreementRecord) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    const agreementMeta = normalizeAgreement(agreementRecord);
    if (agreementMeta.expiresAt && new Date(agreementMeta.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Agreement link has expired" }, { status: 410 });
    }

    if (agreementRecord.password_hash) {
      const cookieHeader = request.headers.get("cookie") || "";
      const accessCookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${getAgreementAccessCookieName(params.slug)}=`))
        ?.split("=")[1];

      if (!hasAgreementAccessCookieValue(accessCookie, params.slug, agreementRecord.password_hash)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = await request.json();
    const signerName = String(payload.signerName || "").trim();
    const signatureData = String(payload.signatureData || "").trim();

    if (!signerName || !signatureData) {
      return NextResponse.json({ error: "Signer name and signature are required" }, { status: 400 });
    }

    const rows = await sql`
      UPDATE site_agreements
      SET
        signer_name = ${signerName},
        signature_data = ${signatureData},
        signer_ip = ${getClientIp(request)},
        signed_at = NOW(),
        updated_at = NOW()
      WHERE slug = ${params.slug}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, agreement: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign agreement", detail: String(error) }, { status: 500 });
  }
}
