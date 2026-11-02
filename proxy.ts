import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const secret = process.env.SECRET_KEY;
  const token = request.headers.get("x-hub-signature-256");

  // SECRET_KEY 未設定なら全拒否 (fail closed)
  const ok = !!secret && !!token && token === secret;
  //TODO: timingSafeEqual(Buffer.from(token), Buffer.from(secret));

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/vulnerability-report",
};
