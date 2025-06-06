import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import toast from "react-hot-toast";

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
  const navigate = useNavigate();

  const fetchLands = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://land-registry-backend-h86i.onrender.com/api/lands/approved");
      const data = await res.json();
      setLands(data);
      setFilteredLands(data);
    } catch (err) {
      console.error("Error fetching lands:", err);
      toast.error("❌ Failed to load land listings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const handleEnquire = (ownerId) => {
    navigate(`/chat?receiverId=${ownerId}`);
  };

  const applyFilters = () => {
    let result = [...lands];

    if (filters.type) {
      result = result.filter((land) => land.type === filters.type);
    }

    if (filters.availableFor) {
      result = result.filter((land) => land.availableFor === filters.availableFor);
    }

    if (filters.city) {
      result = result.filter((land) =>
        land.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.pincode) {
      result = result.filter((land) =>
        land.location.pincode.toString().includes(filters.pincode)
      );
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
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-600">🔄 Loading listings...</div>
        ) : filteredLands.length === 0 ? (
          <div className="text-center text-red-500 font-medium mt-6">🚫 No lands found matching your filters.</div>
        ) : (
          <
