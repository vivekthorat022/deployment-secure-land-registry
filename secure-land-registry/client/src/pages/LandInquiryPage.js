import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import Layout from "../components/Layout";

const LandInquiryPage = () => {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/lands/${id}`);
        const data = await res.json();
        setLand(data);
      } catch (err) {
        console.error("❌ Error fetching land details:", err);
      }
    };

    fetchLand();
  }, [id]);

  const handleSendMessage = () => {
    alert("🔔 Inquiry sent: " + message);
    setMessage("");
    // 🔜 Integrate actual chat backend in production
  };

  if (!land) return <p className="text-center mt-10 text-gray-700">Loading land details...</p>;

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-100 p-6 flex flex-col items-center">
        {/* Land Info Card */}
        <Card className="w-full max-w-4xl mb-8 shadow">
          <CardHeader className="p-0">
            <img
              src={land.images[0] || "https://placehold.co/600x300?text=No+Image"}
              alt={land.title}
              className="w-full h-64 object-cover rounded-t"
            />
          </CardHeader>
          <CardContent className="p-6 text-gray-700 space-y-2">
            <CardTitle className="text-3xl font-semibold text-blue-800">{land.title}</CardTitle>
            <p>{land.description}</p>
            <p><strong>📍 Location:</strong> {land.location.city}, {land.location.state}</p>
            <p><strong>💰 Price:</strong> ₹{land.price.toLocaleString()}</p>
            <p><strong>📐 Size:</strong> {land.size} sq.ft</p>
            <p><strong>📞 Contact:</strong> {land.contactName} | {land.contactPhone}</p>
          </CardContent>
        </Card>

        {/* Inquiry Card */}
        <Card className="w-full max-w-4xl shadow">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-xl font-semibold">📨 Send an Inquiry</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="space-y-3">
              <Label htmlFor="message" className="text-base">Your Message</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I'm interested in your land listing..."
                className="h-12 px-4 text-base"
              />
              <Button className="mt-2 w-full sm:w-auto" onClick={handleSendMessage}>
                📤 Send Inquiry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LandInquiryPage;
