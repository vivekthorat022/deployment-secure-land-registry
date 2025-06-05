const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  land: { type: mongoose.Schema.Types.ObjectId, ref: "Land", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agreedPrice: { type: Number, required: true },
  status: { type: String, enum: ['initiated', 'completed'], default: 'initiated' },
  transactionHash: { type: String },   // for storing blockchain tx hash
  blockHash: { type: String },         // for storing blockchain block hash
  certificateHash: { type: String },   // for storing IPFS file hash (optional for now)
}, {
  timestamps: true
});

module.exports = mongoose.model("Transaction", transactionSchema);
