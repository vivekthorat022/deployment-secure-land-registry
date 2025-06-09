import React, { useEffect, useRef } from "react";
import moment from "moment";

const ChatWindow = ({ messages, currentUserId }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isNewDate = (prev, curr) => {
    if (!prev) return true;
    return !moment(prev.timestamp).isSame(curr.timestamp, "day");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white rounded-xl shadow-inner">
      {messages.map((msg, idx) => {
        const showDateSeparator = idx === 0 || isNewDate(messages[idx - 1], msg);

        return (
          <div key={idx}>
            {/* 📆 Date Separator */}
            {showDateSeparator && (
              <div className="text-center my-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
                {moment(msg.timestamp).format("MMMM D, YYYY")}
              </div>
            )}

            {/* 🛠️ System Message with horizontal separators */}
            {msg.type === "system" ? (
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                  {msg.message}
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            ) : (
              // 💬 Normal user message bubble
              <div
                className={`flex items-end mb-3 ${
                  msg.senderId === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2 text-sm rounded-2xl ${
                    msg.senderId === currentUserId
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* Scroll anchor */}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChatWindow;
