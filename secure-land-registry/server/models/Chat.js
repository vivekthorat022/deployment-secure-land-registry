const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  timestamp: { type: Date, default: Date.now },
  land: { type: mongoose.Schema.Types.ObjectId, ref: "Land" },
}, {
  timestamps: true
});

module.exports = mongoose.model("Chat", chatSchema);
