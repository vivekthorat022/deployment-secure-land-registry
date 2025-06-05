const mongoose = require("mongoose");

const landSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  type: String, // residential, commercial, etc.
  location: {
    state: String,
    district: String,
    city: String,
    pincode: String,
  },
  availableFor: [String], // sale, lease, or both
  images: [String], // paths to uploaded images
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  price: Number,
  size: Number, // in sq ft
  isApproved: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model("Land", landSchema);
