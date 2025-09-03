import mongoose, { Document, Schema, Model } from "mongoose"

interface BookedSeat {
  seat_number: string
  source: string
  destination: string
}

interface SeatClass {
  class_name: string
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
  train_no: Number       // ✅ changed from train_id:ObjectId → train_no:String
  journey_date: Date
  classes: SeatClass[]
  waiting_list: WaitingList
  created_at: Date
  availability: {
    class_name: string
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
  seat_type: { type: String, required: true },
  total: { type: Number, default: 0 },
  booked: { type: Number, default: 0 },
  bookedSeats: [bookedSeatSchema],
})

const seatsSchema = new Schema<ISeats>({
  train_no: {                  // ✅ now consistent with Train schema
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
    total: { type: Number, default: 0 },
    booked: { type: Number, default: 0 },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

// ✅ Virtual field for available seats
seatsSchema.virtual("availability").get(function (this: ISeats) {
  return this.classes.map((cls) => ({
    class_name: cls.class_name,
    seat_type: cls.seat_type,
    available: cls.total - cls.booked,
  }))
})

const Seats: Model<ISeats> =
  mongoose.models.Seats || mongoose.model<ISeats>("Seats", seatsSchema)

export default Seats
