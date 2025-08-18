const mongoose = require("mongoose")
// models/station.js

// Define the schema for stations
const stationSchema = new mongoose.Schema({
    station_id: {
        type: String,
        required: true,
        unique: true // Every station should have a unique ID
    },
    station_name: {
        type: String,
        required: true,
        trim: true
    },
    station_code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        unique: true // No duplicate station codes
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    number_of_platforms: {
        type: Number,
        default: 1
    }
})

// Create the model
const Station = mongoose.model('Station', stationSchema)

module.exports = Station

