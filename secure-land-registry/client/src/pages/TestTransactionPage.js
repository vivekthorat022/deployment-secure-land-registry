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
      const seller = accounts[1] || accounts[0]; // fallback to self if 2nd account missing
      const price = web3.utils.toWei("0.01", "ether");
      const transactionId = Date.now(); // test ID

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
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-100 text-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4 text-blue-900">
            🔗 Blockchain Transaction Test
          </h1>
          <p className="text-gray-700 mb-6">
            This demo sends <span className="font-medium text-blue-700">0.01 ETH</span> from your MetaMask wallet
            to a second test account using the <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">completeTransaction()</code> method
            of your smart contract.
          </p>
          <Button
            onClick={handleTestTransaction}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Processing..." : "🚀 Send 0.01 ETH"}
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Make sure MetaMask is connected and Ganache is running.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TestTransactionPage;
