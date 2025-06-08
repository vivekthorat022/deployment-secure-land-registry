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
        // const res = await fetch(`http://localhost:5000/api/lands/${id}`);
        const res = await fetch(`http://localhost:5000/api/lands/${id}`);
        const data = await res.json();
        setLand(data);
      } catch (err) {
        console.error("Error fetching land details:", err);
      }
    };

    fetchLand();
  }, [id]);

  const handleSendMessage = () => {
    alert("🔔 Inquiry sent: " + message);
    setMessage("");
    // 🔜 Replace with actual chat API call in Step 5.9
  };

  if (!land) return <p className="text-center mt-10 text-gray-700">Loading land details...</p>;

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-100 p-6 flex flex-col items-center">
        <Card className="w-full max-w-4xl mb-8">
          <CardHeader>
            <img
              src={land.images[0] || "http://via.placeholder.com/600x300"}
              alt={land.title}
              className="w-full h-64 object-cover rounded"
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl mb-2">{land.title}</CardTitle>
            <p className="text-gray-700 mb-2">{land.description}</p>
            <p>📍 Location: {land.location.city}, {land.location.state}</p>
            <p>💰 Price: ₹{land.price}</p>
            <p>📐 Size: {land.size} sq.ft</p>
            <p>📞 Contact: {land.contactName} | {land.contactPhone}</p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Send an Inquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I'm interested in your land listing..."
              />
              <Button className="mt-2" onClick={handleSendMessage}>
                Send Inquiry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LandInquiryPage;
