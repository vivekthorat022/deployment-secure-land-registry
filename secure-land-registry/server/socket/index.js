const Message = require("../models/Message");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connected:", socket.id);

    socket.on("join-room", ({ landId, userId, otherUserId }) => {
      const roomId = `${landId}_${userId}_${otherUserId}`;
      socket.join(roomId);
      console.log(`📦 User ${userId} joined room ${roomId}`);
    });

    socket.on("send-message", async (data) => {
      const { landId, senderId, receiverId, message } = data;
      const roomId = `${landId}_${senderId}_${receiverId}`;

      const newMessage = new Message({
        landId,
        senderId,
        receiverId,
        message,
      });

      await newMessage.save();

      io.to(roomId).emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
