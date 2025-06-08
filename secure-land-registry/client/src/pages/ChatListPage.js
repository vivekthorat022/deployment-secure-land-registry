import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?._id;
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 User ID from localStorage:", userId);
    console.log("🔍 Full userInfo:", JSON.stringify(userInfo, null, 2));

    const fetchChats = async () => {
      if (!userId) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching chats from:", `http://localhost:5000/api/chats/list/${userId}`);
        const res = await fetch(`http://localhost:5000/api/chats/list/${userId}`);
        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Server response:", JSON.stringify(errorData, null, 2));
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.message || 'Unknown error'}`);
        }
        const data = await res.json();

        console.log("💬 Chat list response:", JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setChats(data);
        } else {
          console.error("❌ Expected array but got:", data);
          toast.error(data.message || "Invalid chat list data");
          setChats([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch chats:", err.message);
        toast.error(err.message || "Failed to load chat list");
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  const openChat = (chat) => {
    navigate("/chat", {
      state: {
        landId: chat.landId,
        sellerId: chat.otherUserId,
        sellerName: chat.otherUserName,
      },
    });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-6">💬 Your Chats</h1>

        {loading ? (
          <p>Loading chat list...</p>
        ) : chats.length === 0 ? (
          <p>No chat history found.</p>
        ) : (
          <div className="space-y-4">
            {chats.map((chat, index) => (
              <div
                key={index}
                onClick={() => openChat(chat)}
                className="cursor-pointer bg-white p-4 shadow-md rounded-md hover:shadow-lg transition"
              >
                <div className="font-semibold text-lg">{chat.otherUserName || "Unknown User"}</div>
                <div className="text-sm text-gray-600">Land: {chat.landTitle || "Untitled"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatListPage;