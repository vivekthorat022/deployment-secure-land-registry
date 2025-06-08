const express = require("express");
const router = express.Router();
const TransactionInitiation = require("../models/TransactionInitiation");
const Message = require("../models/Message");

// @route   POST /api/transaction-initiations/initiate
// @desc    Save transaction initiation + system message
router.post("/initiate", async (req, res) => {
  try {
    const { landId, sellerId, buyerId } = req.body;

    if (!landId || !sellerId || !buyerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create transaction initiation flag
    const initiation = await TransactionInitiation.create({
      landId,
      sellerId,
      buyerId,
    });

    // Create system message in chat
    const systemMessage = await Message.create({
      landId,
      senderId: sellerId,
      receiverId: buyerId,
      message: "Seller is ready to proceed with the transaction.",
      type: "system",
      timestamp: new Date(),
    });

    return res.status(201).json({ initiation, systemMessage });
  } catch (err) {
    console.error("❌ Failed to initiate transaction:", err);
    return res.status(500).json({ error: "Failed to initiate transaction" });
  }
});

module.exports = router;
