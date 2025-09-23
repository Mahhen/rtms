// app/api/pnr/[pnr]/route.ts

import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/booking";
import dbConnect from "@/lib/dbConnect";
import { getUserIdFromRequest } from "@/lib/auth";

// Define the shape of the params object for TypeScript
interface RouteParams {
  pnr: string;
}

// Correctly type the `params` argument
export async function GET(request: NextRequest, { params }: { params: RouteParams }) {
  try {
    const { pnr } = params; // <-- This now works correctly

    if (!pnr || pnr.length < 5) {
      return NextResponse.json({ success: false, error: "A valid PNR is required." }, { status: 400 });
    }

    await dbConnect();

    const booking = await Booking.findOne({ pnr: pnr.toUpperCase() }).lean();

    if (!booking) {
      return NextResponse.json({ success: false, error: "PNR not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });

  } catch (error: any) {
    console.error("PNR lookup failed:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}