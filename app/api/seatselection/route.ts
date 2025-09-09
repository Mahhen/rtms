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

  await mongoose.connect(uri, { dbName: "rtms" })
}

// 🔹 Normalize date (remove time part)
function normalizeDate(dateStr: string) {
  const d = new Date(dateStr)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

// ============ GET ============
export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const train_no = searchParams.get("train_no")
    const journey_date = searchParams.get("date")
    const src = searchParams.get("src")
    const dest = searchParams.get("dest")
    const class_name = searchParams.get("class_name")
    const coach_name = searchParams.get("coach_name")
    const seat_type = searchParams.get("seat_type")

    if (!train_no || !journey_date || !class_name || !coach_name || !seat_type || !src || !dest) {
      return NextResponse.json(
        { success: false, error: "Missing query parameters" },
        { status: 400 }
      )
    }

    const journeyDate = normalizeDate(journey_date)

    const seatDoc = await Seats.findOne({ train_no, journey_date: journeyDate })
    if (!seatDoc) {
      return NextResponse.json({ success: true, bookedSeats: [] })
    }

    const cls = seatDoc.classes.find(
      (c: any) =>
        c.class_name === class_name &&
        c.coach_name === coach_name &&
        c.seat_type === seat_type
    )

    return NextResponse.json({
      success: true,
      bookedSeats: cls ? cls.bookedSeats : [],
    })
  } catch (err) {
    console.error("GET error:", err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch seats" },
      { status: 500 }
    )
  }
}

// ============ POST ============
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const {
      train_no,
      journey_date,
      class_name,
      coach_name,
      seat_type,
      src,
      dest,
      seats, // array of { seat_number, source, destination }
    } = body

    if (
      !train_no ||
      !journey_date ||
      !class_name ||
      !coach_name ||
      !seat_type ||
      !src ||
      !dest ||
      !Array.isArray(seats)
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const journeyDate = normalizeDate(journey_date)

    let seatDoc = await Seats.findOne({ train_no, journey_date: journeyDate })
    if (!seatDoc) {
      seatDoc = new Seats({ train_no, journey_date: journeyDate, classes: [] })
    }

    let cls = seatDoc.classes.find(
      (c) =>
        c.class_name === class_name &&
        c.coach_name === coach_name &&
        c.seat_type === seat_type
    )

    if (!cls) {
      cls = {
        class_name,
        coach_name,
        seat_type,
        total: 48,
        booked: 0,
        bookedSeats: [],
      }
      seatDoc.classes.push(cls)
    }

    const alreadyBooked = cls.bookedSeats.map((s: any) => s.seat_number)
    const newSeats = seats.filter(
      (s: any) => !alreadyBooked.includes(`${coach_name}-${s.seat_number}`)
    )

    if (newSeats.length === 0) {
      return NextResponse.json(
        { success: false, error: "Selected seats already booked" },
        { status: 400 }
      )
    }

    for (const s of newSeats) {
      cls.bookedSeats.push({
        seat_number: `${coach_name}-${s.seat_number}`, // ✅ prefixed
        source: src,
        destination: dest,
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
    return NextResponse.json(
      { success: false, error: "Failed to book seats" },
      { status: 500 }
    )
  }
}
