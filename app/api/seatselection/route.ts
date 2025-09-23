// app/api/seatselection/route.ts
import { NextResponse } from "next/server";
import Booking from "@/models/booking";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const train_no = searchParams.get("train_no");
    const journey_date_str = searchParams.get("date");
    const class_name = searchParams.get("class_name");
    const coach_name = searchParams.get("coach_name");

    if (!train_no || !journey_date_str || !class_name || !coach_name) {
      return NextResponse.json(
        { success: false, error: "Missing query parameters" },
        { status: 400 }
      );
    }

    const journeyDate = new Date(journey_date_str);
    journeyDate.setUTCHours(0, 0, 0, 0);

    // 🔹 Find all bookings that match this train/date/class/coach
    const bookings = await Booking.find({
      train_no,
      journey_date: journeyDate,
      class_name,
      coach_name,
      bookingStatus: "CONFIRMED",
    });

    // 🔹 Collect confirmed seat numbers from passengers
    const bookedSeats = bookings.flatMap(b =>
      b.passengers
        .filter(p => p.status === "CONFIRMED")
        .map(p => ({ seat_number: p.seat_number }))
    );

    return NextResponse.json({ success: true, bookedSeats });
  } catch (err: any) {
    console.error("❌ Error fetching seats:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch seat availability" },
      { status: 500 }
    );
  }
}
