import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import toast from "react-hot-toast";
import LandDetailsModal from "../components/LandDetailsModal";

const ListOfLands = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    availableFor: "",
    city: "",
    pincode: "",
    priceMin: "",
    priceMax: "",
    sort: ""
  });
  const [loading, setLoading] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const navigate = useNavigate();
  const userInfoRaw = localStorage.getItem("userInfo");
  const userId = userInfoRaw ? JSON.parse(userInfoRaw)?._id : null;

  const fetchLands = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/lands/approved");
      const data = await res.json();
      console.log("Fetched lands:", data);

      if (Array.isArray(data)) {
        setLands(data);
        setFilteredLands(data);
      } else {
        setLands([]);
        setFilteredLands([]);
        console.error("Expected array, got:", data);
        toast.error("❌ Unexpected response from server");
      }
    } catch (err) {
      console.error("Error fetching lands:", err);
      toast.error("❌ Failed to load land listings");
      setLands([]);
      setFilteredLands([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const applyFilters = () => {
    let result = [...lands];

    if (filters.type) {
      result = result.filter((land) => land.type === filters.type);
    }
    if (filters.availableFor) {
      result = result.filter((land) => land.availableFor === filters.availableFor);
    }
    if (filters.city) {
      result = result.filter((land) => land.location.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.pincode) {
      result = result.filter((land) => land.location.pincode.toString().includes(filters.pincode));
    }
    if (filters.priceMin) {
      result = result.filter((land) => land.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((land) => land.price <= Number(filters.priceMax));
    }
    if (filters.sort === "priceLowHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "priceHighLow") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredLands(result);
    setVisibleCount(9);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (land) => {
    setSelectedLand(land);
    setIsModalOpen(true);
  };

  const handleEnquire = () => {
    if (!selectedLand || !selectedLand.user) {
      toast.error("❌ Invalid land selection");
      return;
    }

    if (!userId) {
      toast.error("❌ Please log in to enquire about this land");
      return;
    }

    const currentUserId = String(userId).trim();
    const landUserId = String(selectedLand.user._id).trim();

    if (currentUserId === landUserId) {
      toast.error("⚠️ You already own this land listing.");
      setIsModalOpen(false);
    } else {
      setIsModalOpen(false);
      navigate(`/chat?receiverId=${selectedLand.user._id}`);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Browse and filter through our land listings</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Label>Type</Label>
            <select name="type" value={filters.type} onChange={handleChange} className="w-full h-10 border rounded px-3">
              <option value="">All</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
          <div>
            <Label>Availability</Label>
            <select name="availableFor" value={filters.availableFor} onChange={handleChange} className="w-full h-10 border rounded px-3">
              <option value="">All</option>
              <option value="Sale">Sale</option>
              <option value="Lease">Lease</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <Label>City</Label>
            <Input name="city" value={filters.city} onChange={handleChange} placeholder="e.g., Pune" />
          </div>
          <div>
            <Label>Pincode</Label>
            <Input name="pincode" value={filters.pincode} onChange={handleChange} placeholder="e.g., 411001" />
          </div>
          <div>
            <Label>Min Price (₹)</Label>
            <Input name="priceMin" value={filters.priceMin} onChange={handleChange} type="number" />
          </div>
          <div>
            <Label>Max Price (₹)</Label>
            <Input name="priceMax" value={filters.priceMax} onChange={handleChange} type="number" />
          </div>
          <div className="md:col-span-2">
            <Label>Sort By</Label>
            <select name="sort" value={filters.sort} onChange={handleChange} className="w-full h-10 border rounded px-3">
              <option value="">Default</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">🔄 Loading listings...</div>
        ) : Array.isArray(filteredLands) && filteredLands.length === 0 ? (
          <div className="text-center text-red-500 font-medium mt-6">❌ No lands found matching your filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredLands.slice(0, visibleCount).map((land) => (
                <Card key={land._id} className="relative bg-white shadow-md hover:shadow-xl transition-shadow border border-gray-200 rounded-lg overflow-hidden">
                  {land.user && land.user._id === userId && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full z-10">
                      Your Listing
                    </span>
                  )}
                  <CardHeader className="p-0">
                    <img
                      src={(land.images && land.images[0]) || "http://placehold.co/300x200?text=No+Image"}
                      alt={land.title}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold mb-1">{land.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-1">{land.description}</p>
                    <p className="text-sm text-gray-500 mb-1">📍 {land.location?.city}, {land.location?.state}</p>
                    <p className="text-sm mb-3">💰 ₹{land.price} | 📀 {land.size} sq.ft | 📄 {land.type}</p>
                    <Button className="w-full" onClick={() => openModal(land)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {visibleCount < filteredLands.length && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
          </>
        )}
      </div>

      <LandDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        land={selectedLand}
        onEnquire={handleEnquire}
      />
    </Layout>
  );
};

export default ListOfLands;
  