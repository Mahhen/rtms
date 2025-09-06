import mongoose, { Document, Schema, Model } from "mongoose"

interface BookedSeat {
  seat_number: string
  source: string
  destination: string
}

interface SeatClass {
  class_name: string     // e.g., "2AC"
  coach_name: string     // e.g., "B1", "B2"
  seat_type: string
  total: number
  booked: number
  bookedSeats: BookedSeat[]
}

interface WaitingList {
  total: number
  booked: number
}

export interface ISeats extends Document {
  train_no: Number
  journey_date: Date
  classes: SeatClass[]
  waiting_list: WaitingList
  created_at: Date
  availability: {
    class_name: string
    coach_name: string
    seat_type: string
    available: number
  }[]
}

const bookedSeatSchema = new Schema<BookedSeat>({
  seat_number: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
})

const seatClassSchema = new Schema<SeatClass>({
  class_name: { type: String, required: true },
  coach_name: { type: String, required: true },  // ✅ added coach_name
  seat_type: { type: String, required: true },
  total: { type: Number, default: 48 },
  booked: { type: Number, default: 0 },
  bookedSeats: [bookedSeatSchema],
})

const seatsSchema = new Schema<ISeats>({
  train_no: {
    type: Number,
    ref: "Train",
    required: true,
  },
  journey_date: {
    type: Date,
    required: true,
  },
  classes: [seatClassSchema],
  waiting_list: {
    total: { type: Number, default: 48 },
    booked: { type: Number, default: 0 },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

// ✅ Virtual field for available seats (now includes coach_name)
seatsSchema.virtual("availability").get(function (this: ISeats) {
  return this.classes.map((cls) => ({
    class_name: cls.class_name,
    coach_name: cls.coach_name,
    seat_type: cls.seat_type,
    available: cls.total - cls.booked,
  }))
})

const Seats: Model<ISeats> =
  mongoose.models.Seats || mongoose.model<ISeats>("Seats", seatsSchema)

export default Seats
