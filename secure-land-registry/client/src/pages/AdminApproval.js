import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";

const AdminApproval = () => {
  const [lands, setLands] = useState([]);

  const fetchPendingLands = async () => {
    try {
      // const response = await fetch("http://localhost:5000/api/lands/pending");
      const response = await fetch("http://localhost:5000/api/lands/pending");
      const data = await response.json();
      setLands(data);
    } catch (error) {
      console.error("Error fetching pending lands:", error);
    }
  };

  const approveLand = async (landId) => {
    try {
      // const response = await fetch(`http://localhost:5000/api/lands/${landId}/approve`, {
      const response = await fetch(`http://localhost:5000/api/lands/${landId}/approve`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Land approved successfully");
        fetchPendingLands(); // Refresh list
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
      <div className="min-h-[70vh] p-6">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          🧾 Pending Land Listings
        </h1>

        <div className="space-y-6">
          {lands.length === 0 ? (
            <p className="text-center text-green-400">
              ✅ No pending listings right now
            </p>
          ) : (
            lands.map((land) => (
              <Card key={land._id} className="bg-white text-black shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{land.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Type:</strong> {land.type}</p>
                  <p><strong>Description:</strong> {land.description}</p>
                  <p><strong>Location:</strong> {land.location.city}, {land.location.district}, {land.location.state} - {land.location.pincode}</p>
                  <p><strong>Price:</strong> ₹{land.price}</p>
                  <p><strong>Size:</strong> {land.size} sq.ft</p>
                  <p><strong>Contact:</strong> {land.contactName} ({land.contactPhone})</p>
                  <Button className="mt-2" onClick={() => approveLand(land._id)}>
                    ✅ Approve
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminApproval;
