import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const ListOfLands = () => {
  const [lands, setLands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLands = async () => {
      try {
        // const res = await fetch("http://localhost:5000/api/lands/approved");
        const res = await fetch("https://land-registry-backend-h86i.onrender.com/api/lands/approved");
        const data = await res.json();
        setLands(data);
      } catch (err) {
        console.error("Error fetching lands:", err);
      }
    };

    fetchLands();
  }, []);

  const handleEnquire = (ownerId) => {
    navigate(`/chat?receiverId=${ownerId}`);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Browse and filter through our land listings.</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lands.map((land) => (
            <Card key={land._id} className="bg-white shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <img
                  src={land.images[0] || "https://via.placeholder.com/300x200"}
                  alt={land.title}
                  className="w-full h-48 object-cover rounded"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold mb-1">{land.title}</CardTitle>
                <p className="text-sm text-gray-600 mb-1">{land.description}</p>
                <p className="text-sm text-gray-500 mb-1">
                  📍 {land.location.city}, {land.location.state}
                </p>
                <p className="text-sm mb-3">
                  💰 ₹{land.price} | 📐 {land.size} sq.ft | 📄 {land.type}
                </p>
                <Button className="w-full" onClick={() => handleEnquire(land.user)}>
                  Enquire
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ListOfLands;
