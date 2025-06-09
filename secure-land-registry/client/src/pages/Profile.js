import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { walletAddress } = useContext(WalletContext);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?._id;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (userId) fetchUserInfo();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditMode(false);
        alert("✅ Profile updated successfully");
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl relative shadow-lg border border-gray-200">
          {/* Chat Navigation Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute p-5 top-5 right-5 text-base bg-blue-200"
            onClick={() => window.location.href = "/chat-list"}
          >
            💬 Chats
          </Button>

          <CardHeader>
            <CardTitle className="text-2xl text-blue-700 font-bold">👤 User Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-[15px] text-gray-800">
            {user ? (
              <>
                <div><strong>Name:</strong> {user.fullName}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div>
                  <strong>Approval Status:</strong>{" "}
                  {user.isApproved ? (
                    <span className="text-green-600">✅ Approved</span>
                  ) : (
                    <span className="text-red-500">⏳ Pending</span>
                  )}
                </div>

                {editMode ? (
                  <div className="space-y-3 pt-3">
                    <div>
                      <label className="block mb-1 text-sm">Phone</label>
                      <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Wallet Address</label>
                      <Input name="walletAddress" value={formData.walletAddress || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">State</label>
                      <Input name="state" value={formData.state || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">City</label>
                      <Input name="city" value={formData.city || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Pincode</label>
                      <Input name="pincode" value={formData.pincode || ""} onChange={handleChange} />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleSave}>💾 Save</Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <div><strong>Phone:</strong> {user.phone || "-"}</div>
                    <div><strong>Wallet:</strong> {user.walletAddress || "-"}</div>
                    <div><strong>State:</strong> {user.state || "-"}</div>
                    <div><strong>City:</strong> {user.city || "-"}</div>
                    <div><strong>Pincode:</strong> {user.pincode || "-"}</div>
                    <Button className="mt-4" onClick={() => setEditMode(true)}>✏️ Edit Profile</Button>
                  </div>
                )}

                <Button
                  className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </Button>
              </>
            ) : (
              <p>Loading user info...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
