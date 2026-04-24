import { NextResponse } from "next/server";
import { uploadFileWithFallback } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    return NextResponse.json(await uploadFileWithFallback(file, "image"));
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload image", detail: String(error) }, { status: 500 });
  }
}
