const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get all messages between two users for a specific land
router.get("/:landId/:userId", async (req, res) => {
  try {
    const { landId, userId } = req.params;
    const currentUserId = req.query.currentUserId;

    const messages = await Message.find({
      landId,
      $or: [
        { senderId: userId, receiverId: currentUserId },
        { senderId: currentUserId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error loading messages:", error);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

module.exports = router;
