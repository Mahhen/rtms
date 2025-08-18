const mongoose = require('mongoose');

// Define Role Schema
const roleSchema = new mongoose.Schema({
  role_id: { type: String, required: true },
  role_name: { type: String, required: true },
  role_desc: { type: String }
}, { _id: false });

// Define Login Schema
const loginSchema = new mongoose.Schema({
  login_id: { type: String, required: true },
  login_username: { type: String, required: true },
  login_password_hash: { type: String, required: true },
  role: { type: roleSchema, required: true }
}, { _id: false });

// Define Permission Schema
const permissionSchema = new mongoose.Schema({
  per_id: { type: String, required: true },
  name_of_official: { type: String, required: true }
}, { _id: false });

// Define User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  user_name: { type: String, required: true },
  user_mobile: { type: String, required: true },
  user_email: { type: String, required: true },
  user_address: { type: String, required: true },
  login: { type: loginSchema, required: true },
  permission: { type: permissionSchema, required: true }
});

// Create Model
const User = mongoose.model('User', userSchema);

module.exports = User;
