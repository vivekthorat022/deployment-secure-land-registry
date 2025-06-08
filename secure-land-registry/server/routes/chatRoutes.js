const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const Land = require("../models/Land");

// ==============================
// @route   GET /api/chats/list/:userId
// @desc    Get unique chat users with land context for current user
// ==============================
router.get("/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "fullName email")
      .populate("receiverId", "fullName email")
      .populate("landId", "title");

    const chatMap = new Map();

    messages.forEach((msg) => {
      if (!msg.senderId || !msg.receiverId || !msg.landId) return;

      const otherUser =
        String(msg.senderId._id) === userId ? msg.receiverId : msg.senderId;
      const land = msg.landId;
      const key = `${otherUser._id}_${land._id}`;

      if (!chatMap.has(key)) {
        chatMap.set(key, {
          otherUserId: otherUser._id,
          otherUserName: otherUser.fullName || "Unknown",
          landId: land._id,
          landTitle: land.title || "Untitled Land",
        });
      }
    });

    res.status(200).json(Array.from(chatMap.values()));
  } catch (error) {
    console.error("❌ Error fetching chat list:", error);
    res.status(500).json({ message: "Failed to load chat list" });
  }
});

// ==============================
// @route   GET /api/chats/:landId/:userId
// @desc    Get all messages between two users for a specific land
// ==============================
router.get("/:landId/:userId", async (req, res) => {
  try {
    const { landId, userId } = req.params;
    const { currentUserId } = req.query;

    if (
      !landId ||
      !userId ||
      !currentUserId ||
      !mongoose.isValidObjectId(landId) ||
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(currentUserId)
    ) {
      return res.status(400).json({ message: "Invalid or missing parameters" });
    }

    const messages = await Message.find({
      landId,
      $or: [
        { senderId: userId, receiverId: currentUserId },
        { senderId: currentUserId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ Error loading messages:", error);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

// ==============================
// @route   POST /api/messages
// @desc    Save a new chat message to the database
// ==============================
router.post("/", async (req, res) => {
  try {
    const { landId, senderId, receiverId, message } = req.body;

    if (
      !landId ||
      !senderId ||
      !receiverId ||
      !message ||
      !mongoose.isValidObjectId(landId) ||
      !mongoose.isValidObjectId(senderId) ||
      !mongoose.isValidObjectId(receiverId)
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const newMessage = new Message({
      landId,
      senderId,
      receiverId,
      message,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("❌ Error saving message via REST:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
