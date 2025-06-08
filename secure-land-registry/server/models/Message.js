const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
