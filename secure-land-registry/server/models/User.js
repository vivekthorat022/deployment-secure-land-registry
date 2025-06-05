const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  isApproved: { type: Boolean, default: false },
  walletAddress: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
