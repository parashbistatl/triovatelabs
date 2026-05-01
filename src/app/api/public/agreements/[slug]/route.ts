import { NextResponse } from "next/server";
import {
  ensureTables,
  getAgreementRecordBySlug,
  hydrateAgreementRecord,
  normalizeAgreement,
} from "@/lib/server/content-api";
import {
  createAgreementAccessToken,
  getAgreementAccessCookieName,
  hasAgreementAccessCookieValue,
  verifyAgreementPassword,
} from "@/lib/server/agreement-security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await ensureTables();
    const agreementRecord = await getAgreementRecordBySlug(params.slug);
    if (!agreementRecord) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    const agreementMeta = normalizeAgreement(agreementRecord);
    const requiresPassword = Boolean(agreementRecord.password_hash);

    if (agreementMeta.expiresAt && new Date(agreementMeta.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Agreement link has expired" }, { status: 410 });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const accessCookie = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${getAgreementAccessCookieName(params.slug)}=`))
      ?.split("=")[1];

    if (requiresPassword && !hasAgreementAccessCookieValue(accessCookie, params.slug, agreementRecord?.password_hash)) {
      return NextResponse.json(
        {
          title: agreementMeta.title,
          slug: agreementMeta.slug,
          expiresAt: agreementMeta.expiresAt,
          passwordProtected: true,
          requiresPassword: true,
        },
        { status: 401 },
      );
    }

    const agreement = await hydrateAgreementRecord(agreementRecord);
    return NextResponse.json(agreement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agreement", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    await ensureTables();
    const agreementRecord = await getAgreementRecordBySlug(params.slug);

    if (!agreementRecord) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }

    const agreementMeta = normalizeAgreement(agreementRecord);
    const passwordHash = agreementRecord?.password_hash;
    if (agreementMeta.expiresAt && new Date(agreementMeta.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: "Agreement link has expired" }, { status: 410 });
    }

    if (!passwordHash) {
      return NextResponse.json({ success: true, passwordProtected: false });
    }

    const payload = await request.json();
    const password = String(payload.password || "");

    if (!verifyAgreementPassword(password, passwordHash)) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: getAgreementAccessCookieName(params.slug),
      value: createAgreementAccessToken(params.slug, passwordHash),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: agreementMeta.expiresAt ? new Date(agreementMeta.expiresAt) : undefined,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify password", detail: String(error) }, { status: 500 });
  }
}
