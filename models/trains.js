const mongoose = require("mongoose")

const trainSchema = new mongoose.Schema({
  trn_id: {
    type: String,
    required: true,
    unique: true
  },
  trn_num: {
    type: String,
    required: true
  },
  trn_name: {
    type: String,
    required: true
  },
  trn_desc: {
    type: String
  },
  trn_ticket: {
    type: Number,
    required: true,
    min: 0
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  halts: {
    type: [Number],
    required : true
  }
})

// Create model
const Train = mongoose.model("Train", trainSchema)

module.exports = Train
