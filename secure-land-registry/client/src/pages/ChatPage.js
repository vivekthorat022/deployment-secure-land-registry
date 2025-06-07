import React, { useEffect, useState } from "react";
import socket from "../lib/socket";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";

const ChatPage = () => {
  const location = useLocation();
  const { landId, sellerId, sellerName } = location.state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  };

  useEffect(() => {
    const currentUser = fetchUserFromLocalStorage();
    if (!currentUser) return;
    setUser(currentUser);

    // Join chat room
    socket.emit("join-room", {
      landId,
      userId: currentUser._id,
      otherUserId: sellerId,
    });

    // Load previous messages
    axios
      .get(
        `https://land-registry-backend-h86i.onrender.com/api/messages/${landId}/${sellerId}?currentUserId=${currentUser._id}`
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error loading messages:", err));

    // Listen for incoming messages
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [landId, sellerId]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      landId,
      senderId: user._id,
      receiverId: sellerId,
      message,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6 h-[80vh] flex flex-col border rounded-xl shadow-lg bg-gray-50">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Chat with {sellerName || "Seller"}
          </h2>
          <Button>Buy Now</Button>
        </div>

        {/* Chat messages */}
        <ChatWindow messages={messages} currentUserId={user?._id} />

        {/* Input area */}
        <div className="p-4 border-t flex items-center bg-white rounded-b-xl">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 mr-2 text-sm"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
