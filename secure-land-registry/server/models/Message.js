const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  land: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  content: { type: String, required: true },
}, {
  timestamps: true // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.model('Message', messageSchema);
