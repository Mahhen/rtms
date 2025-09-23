// app/api/my-bookings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth"; // Your auth helper for cookies
import Booking from "@/models/booking";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Authenticate the user and get their ID from the session cookie
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 3. Find all bookings in the database that match the user's ID
    // We sort by journey_date in descending order to show upcoming/most recent trips first.
    const bookings = await Booking.find({ userId: userId })
      .sort({ journey_date: -1 })
      .lean(); // .lean() makes the query faster by returning plain JS objects

    // 4. Return the found bookings
    return NextResponse.json({ success: true, bookings });

  } catch (error: any) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}