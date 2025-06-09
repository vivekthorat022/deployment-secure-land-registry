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
        const res = await fetch(`http://localhost:5000/api/chats/list/${userId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setChats(data);
        } else {
          console.error("❌ Expected array but got:", data);
          toast.error("Invalid chat list format");
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
      <div className="min-h-[80vh] bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">💬 Your Conversations</h1>

        {loading ? (
          <p className="text-gray-600">🔄 Loading chat list...</p>
        ) : chats.length === 0 ? (
          <p className="text-gray-500 text-sm">You haven’t started any conversations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chats.map((chat, index) => (
              <div
                key={index}
                onClick={() => openChat(chat)}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4 space-y-1"
              >
                <div className="text-lg font-semibold text-gray-800">{chat.otherUserName || "Unknown User"}</div>
                <div className="text-sm text-gray-500">Land: {chat.landTitle || "Untitled Land"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatListPage;
