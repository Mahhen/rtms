const mongoose = require("mongoose")

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rtms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Define the schema
const bookingSchema = new mongoose.Schema({
  book_id: { type: String, required: true },
  book_type: { type: String, required: true },
  user_booking_details: { type: Object, required: true },
  payment: { type: Object, required: true }
});

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking