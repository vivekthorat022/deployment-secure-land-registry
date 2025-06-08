import React, { useEffect, useState } from "react";
import socket from "../lib/socket";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";

const ChatPage = () => {
  const location = useLocation();
  const { landId, sellerId, sellerName } = location.state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  const [landOwnerId, setLandOwnerId] = useState(null);

  const fetchUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("userInfo");
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  };

  useEffect(() => {
    const currentUser = fetchUserFromLocalStorage();
    if (!currentUser) {
      toast.error("User not logged in");
      return;
    }
    setUser(currentUser);

    // Modification begins

    if (landId) {
      axios
        .get(`http://localhost:5000/api/lands/${landId}`)
        .then((res) => {
          const ownerId = res.data.user._id;
          console.log("✅ Land owner ID:", ownerId);
          setLandOwnerId(ownerId);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch land owner info:", err);
        });
    }


    // Modification ends

    console.log("🔍 ChatPage params:", { landId, sellerId, sellerName, userId: currentUser._id });

    if (!sellerId || !sellerName) {
      console.error("❌ Seller info missing");
      toast.error("Seller info unavailable");
    }

    socket.emit("join-room", {
      landId,
      userId: currentUser._id,
      otherUserId: sellerId || "unknown",
    });

    socket.on("connect", () => {
      console.log("🔗 Socket.IO connected:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.error("❌ Socket.IO error:", err.message);
      toast.error("Socket connection failed");
    });

    if (sellerId && landId) {
      axios
        .get(`http://localhost:5000/api/messages/${landId}/${sellerId}?currentUserId=${currentUser._id}`)
        .then((res) => {
          console.log("💬 Loaded messages:", res.data);
          setMessages(res.data);
        })
        .catch((err) => {
          console.error("❌ Error loading messages:", err);
          toast.error("Failed to load chat history");
        });
    }

    socket.on("receive-message", (msg) => {
      console.log("💬 Real-time message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message-error", ({ error }) => {
      console.error("❌ Socket message error:", error);
      toast.error(error);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receive-message");
      socket.off("message-error");
    };
  }, [landId, sellerId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!sellerId) {
      toast.error("Seller ID missing");
      return;
    }

    const newMessage = {
      landId,
      senderId: user._id,
      receiverId: sellerId,
      message,
    };

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const savedMessage = await response.json();

      if (!response.ok) throw new Error(savedMessage.error || "Unknown error");

      // setMessages((prev) => [...prev, savedMessage]); // Show locally
      socket.emit("send-message", savedMessage); // Broadcast to others
      setMessage("");
    } catch (err) {
      console.error("❌ Message send failed:", err.message);
      toast.error("Failed to send message");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6 h-[80vh] flex flex-col border rounded-xl shadow-lg bg-gray-50">
        <div className="p-4 border-b flex justify-between items-center bg-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Chat with {sellerName || "Unknown Seller"}
          </h2>
          {/* Old button */}
          {/* <Button>Initiate Transaction</Button> */}

          {/* Modified Button start */}

          <Button
            onClick={() => {
              if (!user || !landId || !landOwnerId) return toast.error("Missing required info");

              if (String(user._id) !== String(landOwnerId)) {
                toast.error("Only the seller can initiate the transaction");
                return;
              }

              console.log("✅ Seller initiating transaction...");

              socket.emit("initiate-transaction", {
                landId,
                sellerId: user._id,
                buyerId: location.state?.buyerId || "", // adjust later if needed
              });
            }}
          >
            Initiate Transaction
          </Button>

          {/* Modified Button end */}

        </div>
        <ChatWindow messages={messages} currentUserId={user?._id} />
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
