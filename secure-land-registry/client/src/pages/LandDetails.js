import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";

const LandDetails = () => {
  const { state: land } = useLocation();
  const navigate = useNavigate();
  const { walletAddress, web3, contract } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!walletAddress || !web3 || !contract) {
      toast.error("Wallet not connected or contract not loaded.");
      return;
    }

    setLoading(true);
    try {
      const valueInWei = web3.utils.toWei(String(land.price), "ether");

      const tx = await contract.methods
        .createTransaction(walletAddress, land.contactWallet)
        .send({ from: walletAddress, value: valueInWei });

      const transactionHash = tx.transactionHash;
      const blockHash = tx.blockHash;

      // Step 1: Save transaction in backend
      // const res = await fetch("http://localhost:5000/api/transactions", {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landId: land._id,
          buyerId: land.buyerId || "PLACEHOLDER_BUYER_ID",
          sellerId: land.user,
          agreedPrice: land.price,
          transactionHash,
          blockHash
        })
      });

      const result = await res.json();

      // Step 2: Finalize transaction
      if (res.ok) {
        // const finalizeRes = await fetch("http://localhost:5000/api/transactions/finalize", {
        const finalizeRes = await fetch("http://localhost:5000/api/transactions/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: result.transactionId,
            transactionHash,
            blockHash
          })
        });

        const finalizeResult = await finalizeRes.json();

        if (finalizeRes.ok) {
          toast.success("🎉 Land purchase successful!");
          navigate("/profile");
        } else {
          toast.error("Finalize failed: " + finalizeResult.error);
        }
      } else {
        toast.error("Backend error: " + result.error);
      }

    } catch (err) {
      console.error(err);
      toast.error("❌ Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-100 p-6 flex justify-center">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">{land.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={land.images[0] || "http://via.placeholder.com/300x200"}
              alt={land.title}
              className="w-full h-64 object-cover mb-6 rounded"
            />
            <p className="mb-2">{land.description}</p>
            <p><strong>Type:</strong> {land.type}</p>
            <p><strong>Location:</strong> {land.location.city}, {land.location.state}</p>
            <p><strong>Size:</strong> {land.size} sq.ft</p>
            <p><strong>Price:</strong> ₹{land.price}</p>
            <p><strong>Seller Contact:</strong> {land.contactName} ({land.contactPhone})</p>

            <div className="mt-6 flex gap-4">
              <Button onClick={handleBuyNow} disabled={loading}>
                {loading ? "Processing..." : "Buy Now"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LandDetails;
