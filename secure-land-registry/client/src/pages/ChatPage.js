import React, { useEffect, useState } from "react";
import socket from "../lib/socket";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";
// import { getWeb3Instance } from "../lib/web3";
import { getWeb3Instance } from "../lib/web3LandRegistry";


const ChatPage = () => {
  const location = useLocation();
  const { landId, sellerId, sellerName } = location.state || {};
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [landOwnerId, setLandOwnerId] = useState(null);
  const [initiationDone, setInitiationDone] = useState(false);
  const [sellerWallet, setSellerWallet] = useState("");

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

    if (landId) {
      axios
        .get(`http://localhost:5000/api/lands/${landId}`)
        .then((res) => {
          const owner = res.data.user;
          setLandOwnerId(owner._id);
          setSellerWallet(owner.wallet); // 🟡 Assuming seller wallet is saved in land.user.wallet
        })
        .catch((err) => {
          console.error("❌ Failed to fetch land owner info:", err);
        });
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
      toast.error("Socket connection failed");
    });

    if (sellerId && landId) {
      axios
        .get(`http://localhost:5000/api/messages/${landId}/${sellerId}?currentUserId=${currentUser._id}`)
        .then((res) => {
          setMessages(res.data);

          const alreadyInitiated = res.data.some(
            (msg) => msg.type === "system" && msg.message.includes("ready to proceed")
          );
          setInitiationDone(alreadyInitiated);
        })
        .catch((err) => {
          toast.error("Failed to load chat history");
        });
    }

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message-error", ({ error }) => {
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
    if (!sellerId) return toast.error("Seller ID missing");

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

      socket.emit("send-message", savedMessage);
      setMessage("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleInitiate = async () => {
    if (!user || !landId || !landOwnerId) return toast.error("Missing required info");

    // SELLER LOGIC
    if (String(user._id) === String(landOwnerId)) {
      const potentialBuyerMsg = messages.find((msg) => msg.senderId !== user._id);
      const buyerId = potentialBuyerMsg?.senderId;
      if (!buyerId) return toast.error("Buyer not identified in chat");

      try {
        const res = await fetch("http://localhost:5000/api/transaction-initiations/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ landId, sellerId: user._id, buyerId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");

        toast.success("Transaction initiated successfully");
        setMessages((prev) => [...prev, data.systemMessage]);
        setInitiationDone(true);
      } catch (err) {
        toast.error("Failed to initiate transaction");
      }
    }

    // BUYER METAMASK LOGIC
    else {
      if (!initiationDone) return toast.error("Seller hasn't initiated transaction yet");

      try {
        const web3 = await getWeb3Instance();
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];

        if (!sellerWallet) return toast.error("Seller wallet not found");

        const valueInEth = "0.01";
        const valueInWei = web3.utils.toWei(valueInEth, "ether");

        toast.loading("Sending transaction...");

        await web3.eth.sendTransaction({
          from,
          to: sellerWallet,
          value: valueInWei,
        });

        toast.dismiss();
        toast.success("Payment successful via MetaMask!");
      } catch (err) {
        toast.dismiss();
        console.error("❌ MetaMask Error:", err);
        toast.error("Transaction failed");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6 h-[80vh] flex flex-col border rounded-xl shadow-lg bg-gray-50">
        <div className="p-4 border-b flex justify-between items-center bg-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Chat with {sellerName || "Unknown Seller"}
          </h2>

          <Button onClick={handleInitiate}>
            {String(user?._id) === String(landOwnerId)
              ? initiationDone
                ? "Initiation Sent"
                : "Initiate Transaction"
              : "Make Payment"}
          </Button>
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
