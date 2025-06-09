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
      toast.error("⚠️ Wallet not connected or contract not loaded.");
      return;
    }

    setLoading(true);
    try {
      const valueInWei = web3.utils.toWei(String(land.price), "ether");

      const tx = await contract.methods
        .createTransaction(walletAddress, land.contactWallet)
        .send({ from: walletAddress, value: valueInWei });

      const { transactionHash, blockHash } = tx;

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landId: land._id,
          buyerId: land.buyerId || "PLACEHOLDER_BUYER_ID",
          sellerId: land.user,
          agreedPrice: land.price,
          transactionHash,
          blockHash,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        const finalizeRes = await fetch("http://localhost:5000/api/transactions/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: result.transactionId,
            transactionHash,
            blockHash,
          }),
        });

        const finalizeResult = await finalizeRes.json();

        if (finalizeRes.ok) {
          toast.success("🎉 Land purchase successful!");
          navigate("/profile");
        } else {
          toast.error("❌ Finalize failed: " + finalizeResult.error);
        }
      } else {
        toast.error("❌ Backend error: " + result.error);
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
      <div className="min-h-[80vh] bg-gray-100 flex justify-center p-6">
        <Card className="w-full max-w-3xl shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center text-blue-800">{land.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <img
              src={land.images[0] || "https://placehold.co/600x300?text=No+Image"}
              alt={land.title}
              className="w-full h-64 object-cover rounded-md"
            />

            <div className="space-y-1">
              <p className="text-base"><strong>Description:</strong> {land.description}</p>
              <p><strong>Type:</strong> {land.type}</p>
              <p><strong>Location:</strong> {land.location.city}, {land.location.state}</p>
              <p><strong>Size:</strong> {land.size} sq.ft</p>
              <p><strong>Price:</strong> ₹{land.price.toLocaleString()}</p>
              <p><strong>Seller Contact:</strong> {land.contactName} ({land.contactPhone})</p>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t mt-6">
              <Button onClick={handleBuyNow} disabled={loading}>
                {loading ? "Processing..." : "💰 Buy Now"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>← Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LandDetails;
