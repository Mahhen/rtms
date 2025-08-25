import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.next(); // ✅ request continues
  } catch {
    return NextResponse.json({ message: "Invalid Token" }, { status: 403 });
  }
}

export const config = {
  matcher: ["/api/book/:path*", "/api/admin/:path*", "/api/verify-token/:path*"],
};
