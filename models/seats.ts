// models/seats.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPassenger { name: string; age: number; gender: string; }
export interface IBookedSeat { seat_number: string; source: string; destination: string; booked_at: Date; passenger: IPassenger; }
export interface ISeatClass { class_name: string; coach_name: string; seat_type: string; total: number; booked: number; bookedSeats: IBookedSeat[]; }
export interface ISeats extends Document { train_no: string; journey_date: Date; classes: ISeatClass[]; }

const PassengerSchema: Schema = new Schema({
  name: { type: String, required: true }, age: { type: Number, required: true },
  gender: { type: String, required: true },
});

const BookedSeatSchema: Schema = new Schema({
  seat_number: { type: String, required: true }, source: { type: String, required: true },
  destination: { type: String, required: true }, booked_at: { type: Date, default: Date.now },
  passenger: { type: PassengerSchema, required: true },
});

const SeatClassSchema: Schema = new Schema({
  class_name: { type: String, required: true }, coach_name: { type: String, required: true },
  seat_type: { type: String, required: true }, total: { type: Number, required: true },
  booked: { type: Number, default: 0 }, bookedSeats: [BookedSeatSchema],
});

const SeatsSchema: Schema = new Schema({
  train_no: { type: String, required: true }, journey_date: { type: Date, required: true },
  classes: [SeatClassSchema],
}, { timestamps: true });

SeatsSchema.index({ train_no: 1, journey_date: 1 }, { unique: true });

const Seats: Model<ISeats> = mongoose.models.Seats || mongoose.model<ISeats>("Seats", SeatsSchema);

export default Seats;