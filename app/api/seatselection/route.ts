import { NextResponse } from "next/server"

// In-memory storage (resets when server restarts)
let soldSeats: string[] = ["LB1A", "UB2A"]

// GET - fetch sold seats
export async function GET() {
  return NextResponse.json({ soldSeats })
}

// POST - mark seats as sold
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { seats } = body

    if (!Array.isArray(seats)) {
      return NextResponse.json({ error: "Seats must be an array" }, { status: 400 })
    }

    // Add new sold seats (avoid duplicates)
    soldSeats = [...new Set([...soldSeats, ...seats])]

    return NextResponse.json({ message: "Seats marked as sold", soldSeats })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
