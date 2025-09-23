// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { getUserIdFromRequest } from "@/lib/auth";
import Booking from "@/models/booking";
import Seats from "@/models/seats";
import dbConnect from "@/lib/dbConnect";
import { generateSeatsForTier } from "@/lib/seat-utils";

export async function POST(req: NextRequest) {
  console.log("\n--- [START] Booking Request ---");

  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // --- Authenticate ---
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      throw new Error("Unauthorized. User session is not valid or has expired.");
    }
    console.log(`LOG: Authenticated User ID: ${userId}`);

    // --- Parse body ---
    const body = await req.json();
    const { train_no, journey_date, class_name, coach_name, src, dest, seats: selectedSeatsPayload, total_fare, seat_type } = body;

    if (!train_no || !journey_date || !class_name || !coach_name || !selectedSeatsPayload?.length) {
      throw new Error("Invalid request body. Missing required fields.");
    }

    const journeyDate = new Date(journey_date);

    const seatsToBook = selectedSeatsPayload.map((s: any) => ({
      seat_number: `${coach_name}-${s.seat_number}`,
      source: src,
      destination: dest,
      passenger: s.passenger,
      booked_at: new Date(),
    }));

    const seatNumbersToCheck = seatsToBook.map(s => s.seat_number);
    console.log(`LOG: Seats requested: ${seatNumbersToCheck.join(", ")}`);

    // --- Find/Create Seats doc ---
    let seatDoc = await Seats.findOne({ train_no, journey_date: journeyDate }).session(session);
    if (!seatDoc) {
      console.log(`LOG: Creating new Seats doc for train ${train_no}.`);
      seatDoc = new Seats({
        train_no,
        journey_date: journeyDate,
        classes: [],
      });
    }

    // --- Find/Create class/coach sub-doc ---
    let classInDoc = seatDoc.classes.find(c => c.class_name === class_name && c.coach_name === coach_name);
    if (!classInDoc) {
      console.log(`LOG: Adding class/coach ${class_name}/${coach_name}.`);
      const totalSeatsInClass = generateSeatsForTier(class_name).length;
      const newClass = {
        class_name,
        coach_name,
        seat_type,
        total: totalSeatsInClass,
        booked: 0,
        bookedSeats: [],
      };
      seatDoc.classes.push(newClass);
      classInDoc = seatDoc.classes[seatDoc.classes.length - 1];
    }

    // --- Check conflicts ---
    const existingBookedSeats = classInDoc.bookedSeats.map(s => s.seat_number);
    const conflict = seatNumbersToCheck.find(seat => existingBookedSeats.includes(seat));
    if (conflict) {
      throw new Error(`Seat ${conflict} is already booked.`);
    }

    // --- Reserve seats ---
    classInDoc.bookedSeats.push(...seatsToBook);
    classInDoc.booked += seatsToBook.length;
    await seatDoc.save({ session });

    // --- Create booking ---
    const pnr = nanoid(10).toUpperCase();
    const newBooking = new Booking({
      pnr,
      userId,
      train_no,
      journey_date: journeyDate,
      src,
      dest,
      fare: total_fare,
      class_name,
      coach_name,
      bookingStatus: "CONFIRMED",
      passengers: seatsToBook.map(s => ({
        ...s.passenger,
        seat_number: s.seat_number,
        status: "CONFIRMED",
      })),
    });
    await newBooking.save({ session });

    await session.commitTransaction();
    console.log(`LOG: Booking SUCCESS. PNR: ${pnr}`);

    return NextResponse.json({ success: true, bookingDetails: { pnr } });

  } catch (error: any) {
    await session.abortTransaction();
    console.error("--- ❌ Booking FAILED ---");
    console.error("Reason:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 409 });
  } finally {
    session.endSession();
    console.log("--- [END] Booking Request ---");
  }
}
