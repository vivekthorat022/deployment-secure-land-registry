import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { getWeb3, getContract } from "../lib/web3LandRegistry";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

const TestTransactionPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestTransaction = async () => {
    setIsLoading(true);
    try {
      const web3 = await getWeb3();
      const contract = await getContract();
      const accounts = await web3.eth.getAccounts();

      const buyer = accounts[0];
      const seller = accounts[1] || accounts[0]; // for test, fallback to self
      const price = web3.utils.toWei("0.01", "ether"); // 0.01 ETH
      const transactionId = Date.now(); // random test ID

      await contract.methods
        .completeTransaction(transactionId, buyer, seller, price)
        .send({ from: buyer, value: price });

      toast.success("✅ Transaction successful!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Transaction failed. Check console.");
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Live Blockchain Transaction Test</h1>
        <Button onClick={handleTestTransaction} disabled={isLoading}>
          {isLoading ? "Processing..." : "Send 0.01 ETH to Seller"}
        </Button>
        <p className="text-sm mt-3 text-gray-600">
          This will call <code>completeTransaction()</code> on the smart contract using MetaMask.
        </p>
      </div>
    </Layout>
  );
};

export default TestTransactionPage;
