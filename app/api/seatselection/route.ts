import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Seats from "@/models/seats"

// 🔹 Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return

  const uri = process.env.MONGOURI
  if (!uri) {
    throw new Error("MONGOURI is not defined in environment variables")
  }

  await mongoose.connect(uri, {
    dbName: "rtms",
  })
}

// ============ GET ============
// Fetch all seat documents
export async function GET() {
  try {
    await connectDB()
    const seats = await Seats.find({})
    return NextResponse.json({ success: true, data: seats })
  } catch (err) {
    console.error("GET error:", err)
    return NextResponse.json({ success: false, error: "Failed to fetch seats" }, { status: 500 })
  }
}

// ============ POST ============
// Book seats into DB using Seats schema
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const {
      train_no,       // ✅ changed from train_id
      journey_date,
      class_name,
      seat_type,
      seats, // array of { seat_number, source, destination }
    } = body

    if (!train_no || !journey_date || !class_name || !seat_type || !Array.isArray(seats)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // ✅ Ensure correct types
    const journeyDate = new Date(journey_date)

    // Find or create seat document
    let seatDoc = await Seats.findOne({ train_no, journey_date: journeyDate })
    if (!seatDoc) {
      seatDoc = new Seats({ train_no, journey_date: journeyDate, classes: [] })
    }

    // Find the class entry
    let cls = seatDoc.classes.find(
      (c) => c.class_name === class_name && c.seat_type === seat_type
    )
    if (!cls) {
      cls = { class_name, seat_type, total: 0, booked: 0, bookedSeats: [] }
      seatDoc.classes.push(cls)
    }

    // ✅ Prevent duplicate booking
    const alreadyBooked = cls.bookedSeats.map((s: any) => s.seat_number)
    const newSeats = seats.filter((s: any) => !alreadyBooked.includes(s.seat_number))

    if (newSeats.length === 0) {
      return NextResponse.json({ success: false, error: "Selected seats already booked" }, { status: 400 })
    }

    // Add new booked seats
    for (const s of newSeats) {
      cls.bookedSeats.push({
        seat_number: s.seat_number,
        source: s.source,
        destination: s.destination,
      })
    }
    cls.booked += newSeats.length

    await seatDoc.save()

    return NextResponse.json({
      success: true,
      message: "Seats booked successfully",
      data: seatDoc,
    })
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to book seats" }, { status: 500 })
  }
}
