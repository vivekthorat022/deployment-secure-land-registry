const mongoose = require("mongoose");

// Modification

const Message = require("../models/Message");
const TransactionInitiation = require("../models/TransactionInitiation");

// Modification 

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    // Join a specific chat room
    socket.on("join-room", ({ landId, userId, otherUserId }) => {
      const sortedIds = [userId, otherUserId].sort();
      const roomId = `${landId}_${sortedIds[0]}_${sortedIds[1]}`;
      socket.join(roomId);
      console.log(`📦 User ${userId} joined room ${roomId}`);
    });

    // Broadcast-only send-message handler
    socket.on("send-message", (data) => {
      const { landId, senderId, receiverId } = data;

      if (!landId || !senderId || !receiverId) {
        console.warn("⚠️ Missing required fields in socket message:", data);
        return socket.emit("message-error", { error: "Invalid message broadcast" });
      }

      const sortedIds = [senderId, receiverId].sort();
      const roomId = `${landId}_${sortedIds[0]}_${sortedIds[1]}`;

      console.log(`📡 Broadcasting message to room ${roomId}:`, data);
      io.to(roomId).emit("receive-message", data);
    });

    // Modification

    socket.on("initiate-transaction", async ({ landId, sellerId, buyerId }) => {
      try {
        console.log("📥 initiate-transaction received with:", { landId, sellerId, buyerId });
        
        // 1. Save the transaction initiation flag
        await TransactionInitiation.create({ landId, sellerId, buyerId });

        // 2. Save a system message in chat
        const systemMessage = await Message.create({
          landId,
          senderId: sellerId,
          receiverId: buyerId,
          message: "Seller is ready to proceed with the transaction.",
          type: "system",
          timestamp: new Date(),
        });

        // 3. Broadcast to both users
        // io.emit("receive-message", systemMessage);

        // 3. Broadcast to the correct room
        const sortedIds = [sellerId, buyerId].sort();
        const roomId = `${landId}_${sortedIds[0]}_${sortedIds[1]}`;

        console.log(`📡 Broadcasting system message to room ${roomId}`);
        io.to(roomId).emit("receive-message", systemMessage);


      } catch (err) {
        console.error("❌ Error initiating transaction:", err);
        socket.emit("message-error", { error: "Failed to initiate transaction" });
      }
    });

    // Modification

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
