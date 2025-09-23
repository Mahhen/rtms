// In your login API file (e.g., app/api/login/route.ts)

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/users";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ "login.login_username": email });

    if (!user || !user.login) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.login.login_password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // --- THIS IS THE FIX ---
    // Generate JWT, converting user._id to a string
    const token = await new SignJWT({
      sub: user._id.toString(), // <-- Use .toString() here
      email: user.user_email,
      role: user.login.role?.role_name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    // Create a response that ONLY sets the cookie for security
    const response = NextResponse.json({ success: true, message: "Login successful" }, { status: 200 });

    response.cookies.set({
      name: "session-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30, // 30 minutes
    });

    return response;
  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}