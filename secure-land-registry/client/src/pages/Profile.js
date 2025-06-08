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

    if (userId) {
      fetchUserInfo();
    }
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

  const handleGoToChats = () => {
    navigate("/chats");
  };

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl relative">
          {/* Chat Icon Button */}
          {/* <button
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            onClick={handleGoToChats}
            title="Manage Chats"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h6m-6 4h8m5-10a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button> */}

          {/* Modified button :  */}

          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => window.location.href = "/chat-list"}
          >
            💬
          </Button>


          <CardHeader>
            <CardTitle className="text-2xl">👤 User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
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
                  <>
                    <div>
                      <label>Phone:</label>
                      <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label>Wallet Address:</label>
                      <Input name="walletAddress" value={formData.walletAddress || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label>State:</label>
                      <Input name="state" value={formData.state || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label>City:</label>
                      <Input name="city" value={formData.city || ""} onChange={handleChange} />
                    </div>
                    <div>
                      <label>Pincode:</label>
                      <Input name="pincode" value={formData.pincode || ""} onChange={handleChange} />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button onClick={handleSave}>💾 Save</Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div><strong>Phone:</strong> {user.phone || "-"}</div>
                    <div><strong>Wallet:</strong> {user.walletAddress || "-"}</div>
                    <div><strong>State:</strong> {user.state || "-"}</div>
                    <div><strong>City:</strong> {user.city || "-"}</div>
                    <div><strong>Pincode:</strong> {user.pincode || "-"}</div>
                    <Button className="mt-4" onClick={() => setEditMode(true)}>✏️ Edit Profile</Button>
                  </>
                )}

                <Button className="w-full mt-4 bg-red-500 hover:bg-red-600" onClick={handleLogout}>
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
