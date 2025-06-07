import React, { useEffect, useRef } from "react";

const ChatWindow = ({ messages, currentUserId }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white rounded-xl shadow-inner">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`mb-2 flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
            msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}>
            {msg.message}
          </div>
        </div>
      ))}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatWindow;
