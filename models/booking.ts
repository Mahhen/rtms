// models/booking.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBookingPassenger { name: string; age: number; gender: string; seat_number: string; status: string; }

export interface IBooking extends Document {
  pnr: string; userId: Types.ObjectId; train_no: string; journey_date: Date;
  src: string; dest: string; fare: number; class_name: string; coach_name: string;
  passengers: IBookingPassenger[]; bookingStatus: string;
}

const BookingPassengerSchema: Schema = new Schema({
  name: { type: String, required: true }, age: { type: Number, required: true },
  gender: { type: String, required: true }, seat_number: { type: String, required: true },
  status: { type: String, required: true, default: "CONFIRMED" },
});

const BookingSchema: Schema = new Schema({
  pnr: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  train_no: { type: String, required: true }, journey_date: { type: Date, required: true },
  src: { type: String, required: true }, dest: { type: String, required: true },
  fare: { type: Number, required: true }, class_name: { type: String, required: true },
  coach_name: { type: String, required: true }, passengers: [BookingPassengerSchema],
  bookingStatus: { type: String, required: true, default: "CONFIRMED" },
}, { timestamps: true });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;