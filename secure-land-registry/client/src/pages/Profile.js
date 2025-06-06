import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Layout from "../components/Layout";

const Profile = () => {
  const { walletAddress } = useContext(WalletContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔁 Simulated user info fetch — replace with actual API call later
    const fetchUserInfo = async () => {
      const dummyUser = {
        fullName: "Vivek Sharma",
        email: "vivek@example.com",
        phone: "+91-9876543210",
      };
      setUser(dummyUser);
    };

    fetchUserInfo();
  }, []);

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gray-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">👤 User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            {user ? (
              <>
                <div>
                  <strong>Name:</strong> {user.fullName}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Phone:</strong> {user.phone}
                </div>
              </>
            ) : (
              <p>Loading user info...</p>
            )}
            <div>
              <strong>Connected Wallet:</strong>{" "}
              {walletAddress ? (
                <span className="text-green-600 font-mono">{walletAddress}</span>
              ) : (
                <span className="text-red-500">Not Connected</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
