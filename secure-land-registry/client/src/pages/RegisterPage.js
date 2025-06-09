import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      alert("✅ Registration successful! Awaiting admin approval.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("❌ Server error. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
        <Card className="w-full max-w-md shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-700">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label>Full Name</Label>
                <Input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="9876543210"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Register</Button>
            </form>
            <p className="text-sm mt-4 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Log in here
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
