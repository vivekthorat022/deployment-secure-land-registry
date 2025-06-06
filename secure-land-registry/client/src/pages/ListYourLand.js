import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const ListYourLand = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    availableFor: "",
    price: "",
    size: "",
    image: "",
    contactName: "",
    contactPhone: "",
    contactEmail: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch("http://localhost:5000/api/lands", {
        const response = await fetch("https://land-registry-backend-h86i.onrender.com/api/lands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: "665b72e4dfd31beab8c2f456", // 🔁 Replace with dynamic ID later
          title: formData.title,
          description: formData.description,
          type: formData.type,
          location: {
            state: formData.state,
            district: formData.district,
            city: formData.city,
            pincode: formData.pincode
          },
          availableFor: formData.availableFor,
          price: Number(formData.price),
          size: Number(formData.size),
          images: [formData.image],
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Land listing submitted successfully!");
        setFormData({
          title: "",
          description: "",
          type: "",
          state: "",
          district: "",
          city: "",
          pincode: "",
          availableFor: "",
          price: "",
          size: "",
          image: "",
          contactName: "",
          contactPhone: "",
          contactEmail: ""
        });
      } else {
        toast.error("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error");
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gray-100 p-6 flex items-center justify-center">
        <Card className="w-full max-w-4xl p-4">
          <CardHeader>
            <CardTitle className="text-2xl">📋 List Your Land</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <Label>Title</Label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div>
                <Label>Type</Label>
                <Input name="type" value={formData.type} onChange={handleChange} placeholder="Residential / Commercial / etc." required />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input name="description" value={formData.description} onChange={handleChange} required />
              </div>
              <div>
                <Label>State</Label>
                <Input name="state" value={formData.state} onChange={handleChange} required />
              </div>
              <div>
                <Label>District</Label>
                <Input name="district" value={formData.district} onChange={handleChange} required />
              </div>
              <div>
                <Label>City</Label>
                <Input name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
              <div>
                <Label>Available For</Label>
                <Input name="availableFor" value={formData.availableFor} onChange={handleChange} placeholder="Sale / Lease / Both" required />
              </div>
              <div>
                <Label>Price (in ₹)</Label>
                <Input name="price" value={formData.price} onChange={handleChange} type="number" required />
              </div>
              <div>
                <Label>Size (sq. ft)</Label>
                <Input name="size" value={formData.size} onChange={handleChange} type="number" required />
              </div>
              <div className="md:col-span-2">
                <Label>Image URL</Label>
                <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <Label>Contact Name</Label>
                <Input name="contactName" value={formData.contactName} onChange={handleChange} required />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input name="contactEmail" value={formData.contactEmail} onChange={handleChange} type="email" required />
              </div>
              <div className="md:col-span-2 text-center">
                <Button type="submit" className="w-full">Submit Listing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ListYourLand;
