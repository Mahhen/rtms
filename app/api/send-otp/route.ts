
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    }
  });

  try {
    await transporter.sendMail({
      from: "RailwayBuddy@gmail.com", 
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
