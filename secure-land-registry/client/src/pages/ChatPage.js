import React, { useEffect, useState } from "react";
import socket from "../lib/socket";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast"; // Import toast

const ChatPage = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
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
        if (!currentUser) {
            toast.error("You need to be logged in to view chat.");
            navigate("/login", { replace: true }); // Redirect to login
            return;
        }
        // --- FIX: Set user ID to currentUser.userId based on the userInfo object structure ---
        setUser({ ...currentUser, _id: currentUser.userId }); // Create _id for consistency if other components rely on it


        // Ensure landId and sellerId are available from location state
        if (!landId || !sellerId) {
            toast.error("Chat details are missing. Please try again from the land details page.");
            navigate("/lands", { replace: true }); // Redirect to lands page
            return;
        }

        // Join chat room
        // --- FIX: Use currentUser.userId for socket emit ---
        socket.emit("join-room", {
            landId,
            userId: currentUser.userId, // Use userId from the parsed object
            otherUserId: sellerId,
        });

        // Load previous messages
        axios
            .get(
                // --- FIX: Use currentUser.userId for API call parameter ---
                `https://land-registry-backend-h86i.onrender.com/api/messages/${landId}/${sellerId}?currentUserId=${currentUser.userId}`
            )
            .then((res) => setMessages(res.data))
            .catch((err) => {
                console.error("Error loading messages:", err);
                toast.error("Failed to load chat history.");
            });

        // Listen for incoming messages
        socket.on("receive-message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, [landId, sellerId, navigate]); // Add navigate to dependency array

    const handleSend = () => {
        if (!message.trim()) return;

        // --- FIX: Ensure user._id is correctly set as currentUser.userId ---
        if (!user || !user._id || !landId || !sellerId) {
            toast.error("Cannot send message. Missing user or chat details.");
            return;
        }

        const newMessage = {
            landId,
            senderId: user._id, // This will now correctly map to currentUser.userId
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
