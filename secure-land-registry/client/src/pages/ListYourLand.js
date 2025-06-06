import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import PreviewModal from "../components/PreviewModal";

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
    contactName: "",
    contactPhone: "",
    contactEmail: ""
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("❌ User not logged in");
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImagesToBase64 = async (files) => {
    const base64List = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
          })
      )
    );
    return base64List;
  };

  const handleSubmit = async () => {
    try {
      const base64Images = await convertImagesToBase64(imageFiles);

      const response = await fetch("https://land-registry-backend-h86i.onrender.com/api/lands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
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
          images: base64Images,
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
          contactName: "",
          contactPhone: "",
          contactEmail: ""
        });
        setImageFiles([]);
        setIsPreviewOpen(false);
      } else {
        toast.error("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to process images");
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setIsPreviewOpen(true); }}>
              <div>
                <Label>Title</Label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded-md h-10 px-3"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Industrial">Industrial</option>
                </select>
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
                <select
                  name="availableFor"
                  value={formData.availableFor}
                  onChange={handleChange}
                  className="w-full border rounded-md h-10 px-3"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="Sale">Sale</option>
                  <option value="Lease">Lease</option>
                  <option value="Both">Both</option>
                </select>
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
                <Label>Upload Land Images (jpg, jpeg, png)</Label>
                <Input type="file" accept="image/png, image/jpeg" multiple onChange={handleImageChange} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded">
                      <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
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
              <div className="md:col-span-2 text-center mt-4">
                <Button type="submit" className="w-full">🚀 Preview Listing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        imageFiles={imageFiles}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default ListYourLand;
