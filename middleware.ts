import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyJwtToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const verifiedToken =
          token &&
          (await verifyJwtToken(token).catch((err) => {
              // console.log(err); if you are experiencing issues, uncomment this line to see the error
          }));

  if (!verifiedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.next(); // ✅ request continues
  } catch(e) {
    console.error("Token verification error:", e);
    return NextResponse.json({ message: "Invalid Token" }, { status: 403 });
  }
}

export const config = {
  matcher: ["/api/ping/:path*", "/api/admin/:path*", "/api/verify-token/:path*"]
};
