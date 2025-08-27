import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  seq: {
    type: Number,
    required: true
  },
  station_code: {
    type: String,
    required: true
  },
  station_name: {
    type: String,
    required: true
  },
  arrival_time: {
    type: String,
    required: true
  },
  departure_time: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  }
}, { _id: false }); 

const trainSchema = new mongoose.Schema({
  train_no: {
    type: String,
    required: true,
    unique: true
  },
  train_name: {
    type: String,
    required: true
  },
  source: {
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  destination: {
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  stops: {
    type: [stopSchema],
    required: true
  }
});

// Create model
const Train = mongoose.model("Train", trainSchema);

export default Train;
