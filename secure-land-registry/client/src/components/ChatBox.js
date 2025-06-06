import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// Updated API https://land-registry-backend-h86i.onrender.com/api/
// const socket = io("http://localhost:5000"); // adjust if server URL is different
// const socket = io("https://land-registry-backend-h86i.onrender.com"); // adjust if server URL is different

const ChatBox = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        // const res = await fetch("http://localhost:5000/api/chats", {
        const res = await fetch("https://land-registry-backend-h86i.onrender.com/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userA: senderId, userB: receiverId })
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    socket.emit("joinRoom", { senderId, receiverId });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const msg = {
      sender: senderId,
      receiver: receiverId,
      message: text
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");

    try {
      // await fetch("http://localhost:5000/api/chats/send", {
      await fetch("https://land-registry-backend-h86i.onrender.com/api/chats/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg)
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  return (
    <div className="bg-white rounded shadow-md p-4 w-full max-w-xl mx-auto mt-4">
      <div className="h-64 overflow-y-auto border rounded mb-2 p-2 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-1 ${msg.sender === senderId ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender === senderId ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <input
          className="flex-grow border rounded px-2 py-1 mr-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
