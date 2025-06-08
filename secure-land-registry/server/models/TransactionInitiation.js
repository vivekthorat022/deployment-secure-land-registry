// Completely modified file, create now

const mongoose = require("mongoose");

const transactionInitiationSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: "Land", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  initiatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["initiated", "cancelled", "completed"], default: "initiated" }
});

module.exports = mongoose.model("TransactionInitiation", transactionInitiationSchema);
