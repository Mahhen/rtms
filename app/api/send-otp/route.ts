import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend('re_AhZZ8WM4_czUhy7Gh5gCDG9CGeg7mGavr');

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", 
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
