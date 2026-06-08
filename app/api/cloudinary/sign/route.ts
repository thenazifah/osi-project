import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { signCloudinaryParams } from "@/lib/cloudinary-sign";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!apiSecret) {
    return NextResponse.json(
      { error: "CLOUDINARY_API_SECRET is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { paramsToSign?: Record<string, string | number> };
  const paramsToSign = body.paramsToSign;

  if (!paramsToSign || typeof paramsToSign !== "object") {
    return NextResponse.json({ error: "Missing paramsToSign." }, { status: 400 });
  }

  const signature = signCloudinaryParams(paramsToSign, apiSecret);
  return NextResponse.json({ signature });
}
