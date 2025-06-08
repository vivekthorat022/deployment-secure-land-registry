import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ Save full userInfo object with _id
      localStorage.setItem("userInfo", JSON.stringify({ _id: data.userId }));

      alert("✅ Login successful");
      navigate("/profile");

    } catch (err) {
      console.error(err);
      setError("❌ Server error. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">🔐 Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} required />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
            </form>
            <p className="text-sm mt-4">
              Don’t have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>Register</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
