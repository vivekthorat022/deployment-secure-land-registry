const mongoose = require("mongoose");

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

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
