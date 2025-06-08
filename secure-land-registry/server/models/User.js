const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  walletAddress: { type: String, default: '' },
  state: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
