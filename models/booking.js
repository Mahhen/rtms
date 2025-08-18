const mongoose = require("mongoose")
// Define the schema
const bookingSchema = new mongoose.Schema({
  book_id: { type: String, required: true },
  book_type: { type: String, required: true }, // Could be "ONLINE", "OFFLINE", etc.
  
  user_booking_details: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true }, // Link to train
  classType: { type: String, enum: ['1AC', '2AC', '3AC', 'Sleeper', 'General'], required: true },
  seatType: { type: String, enum: ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'] }, // Optional for confirmed
  
  seatNumber: { type: String }, // Only for confirmed passengers

  status: { type: String, enum: ['CONFIRMED', 'WAITING', 'REJECTED'], default: 'WAITING' },

  payment: { type: Object, required: true },

  bookingDate: { type: Date, default: Date.now }
});

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
