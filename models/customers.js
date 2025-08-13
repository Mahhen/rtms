const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
  cus_id: {
    type: String,
    required: true,
    unique: true
  },
  cus_name: {
    type: String,
    required: true
  },
  cus_mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  cus_address: {
    type: String,
    required: true
  },
  cus_pass: {
    type: String,
    required: true
  }
})

// Create model
const Customer = mongoose.model("Customer", customerSchema)

module.exports = Customer
