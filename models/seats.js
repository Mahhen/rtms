// models/seats.js

const mongoose = require('mongoose')

const seatsSchema = new mongoose.Schema({
    train_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train', // Linking to trains collection
        required: true
    },
    journey_date: {
        type: Date,
        required: true
    },
    classes: [
        {
            class_name: { type: String, required: true }, // e.g., "1AC", "2AC", "3AC", "Sleeper", "General"
            seat_type: { type: String, required: true }, // e.g., "Side Lower", "Window", "Middle"
            total: { type: Number, default: 0 },
            booked: { type: Number, default: 0 },
            bookedSeats: [
                {
                    seat_number: String,
                    source: String,       // e.g. "Hyderabad"
                    destination: String,  // e.g. "Vijayawada"
                }
            ]
        }
    ],
    waiting_list: {
        total: { type: Number, default: 0 },
        booked: { type: Number, default: 0 }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

// Virtual field for available seats
seatsSchema.virtual('availability').get(function () {
    return this.classes.map(cls => ({
        class_name: cls.class_name,
        seat_type: cls.seat_type,
        available: cls.total - cls.booked
    }))
})

const Seats = mongoose.model('Seats', seatsSchema)

module.exports = Seats
