import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { jwtVerify } from 'jose';

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));
    return NextResponse.next(); // ✅ request continues
  } catch(e) {
    console.error("Token verification error:", e);
    return NextResponse.json({ message: "Invalid Token" }, { status: 403 });
  }
}

export const config = {
  matcher: ["/api/ping/:path*", "/api/admin/:path*", "/api/verify-token/:path*"],

};
