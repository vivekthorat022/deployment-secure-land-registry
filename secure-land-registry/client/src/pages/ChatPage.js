import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import { WalletContext } from "../context/WalletContext";
import Layout from "../components/Layout";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const { walletAddress } = useContext(WalletContext);

  // TEMP MAPPING — Replace this logic with actual user lookup later
  const walletToUserMap = {
    "0x805746433A187815cb146e9F89Fb4648DB2580bE": "665b72e4dfd31beab8c2f456", // You
    "0x4a9DEbbbC39ac280a90fF4754d33a54631Db04f8": "665b8da781ecb6f271222244", // Someone else
  };

  const senderId = walletToUserMap[walletAddress];

  return (
    <Layout>
      <div className="min-h-[70vh] bg-gray-900 text-white p-6">
        {!senderId || !receiverId ? (
          <p className="text-center text-red-500 text-lg mt-20">
            ❌ Cannot chat. Wallet or receiver not found.
          </p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">
              💬 Chat with Land Owner
            </h1>
            <div className="max-w-4xl mx-auto">
              <ChatBox senderId={senderId} receiverId={receiverId} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
