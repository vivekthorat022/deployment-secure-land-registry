import React, { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Layout from "../components/Layout";
import { WalletContext } from "../context/WalletContext";

const TransactionHistory = () => {
  const { walletAddress } = useContext(WalletContext);
  const [transactions, setTransactions] = useState([]);
  const [userId] = useState("665b72e4dfd31beab8c2f456"); // 🔁 Replace with dynamic user ID later

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // const res = await fetch(`http://localhost:5000/api/transactions/user/${userId}`);
        const res = await fetch(`http://localhost:5000/api/transactions/user/${userId}`);
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">📜 Transaction History</h1>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No transactions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {transactions.map((tx) => (
              <Card key={tx._id} className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle>{tx.land?.title || "Untitled Land"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p><strong>Buyer:</strong> {tx.buyer?.fullName || "N/A"}</p>
                  <p><strong>Seller:</strong> {tx.seller?.fullName || "N/A"}</p>
                  <p><strong>Price:</strong> ₹{tx.agreedPrice}</p>
                  <p><strong>Date:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
                  <p>
                    <strong>Txn Hash:</strong>{" "}
                    <span className="font-mono">{tx.transactionHash?.slice(0, 12)}...</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionHistory;
