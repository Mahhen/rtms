import mongoose from 'mongoose'
// models/station.js

// Define the schema for stations
const stationSchema = new mongoose.Schema({
     code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        unique: true // No duplicate station codes
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
   
    
})

// Create the model
const Station = mongoose.model('Station', stationSchema)

module.exports = Station

