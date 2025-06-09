import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";

const AdminApproval = () => {
  const [lands, setLands] = useState([]);

  const fetchPendingLands = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/lands/pending");
      const data = await response.json();
      setLands(data);
    } catch (error) {
      console.error("Error fetching pending lands:", error);
    }
  };

  const approveLand = async (landId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lands/${landId}/approve`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Land approved successfully");
        fetchPendingLands();
      } else {
        alert("❌ " + (data.error || "Approval failed"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  useEffect(() => {
    fetchPendingLands();
  }, []);

  return (
    <Layout>
      <div className="min-h-[80vh] p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🧾 Pending Land Listings
        </h1>

        {lands.length === 0 ? (
          <p className="text-center text-green-600 text-lg font-medium">
            ✅ No pending listings right now
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lands.map((land) => (
              <Card key={land._id} className="bg-white border rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800 font-semibold">
                    {land.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p><strong>🧱 Type:</strong> {land.type}</p>
                  <p><strong>📝 Description:</strong> {land.description}</p>
                  <p><strong>📍 Location:</strong> {land.location.city}, {land.location.district}, {land.location.state} - {land.location.pincode}</p>
                  <p><strong>💰 Price:</strong> ₹{land.price.toLocaleString()}</p>
                  <p><strong>📐 Size:</strong> {land.size} sq.ft</p>
                  <p><strong>📞 Contact:</strong> {land.contactName} ({land.contactPhone})</p>
                  <div className="pt-2">
                    <Button onClick={() => approveLand(land._id)} className="w-full">
                      ✅ Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminApproval;
