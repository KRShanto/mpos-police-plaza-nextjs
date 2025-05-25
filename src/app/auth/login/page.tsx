"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show success message if redirected from registration
    if (searchParams.get("registered")) {
      setSuccess("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to dashboard on successful login
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during login");
      } else {
        setError("An unknown error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-bg-secondary">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">WELCOME!</h1>
        <p className="text-gray-600 mb-8">Log In to your account</p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-600">
              📧
            </span>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full py-3 px-10 border-b border-gray-300 focus:border-[#4facfe] outline-none text-base"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-600">
              🔒
            </span>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full py-3 px-10 border-b border-gray-300 focus:border-[#4facfe] outline-none text-base"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-[#e8ff54] text-black py-3 px-6 rounded-full text-base font-medium hover:bg-[#d9f046] transition-colors mt-5 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-between items-center mt-4">
            <a
              href="/auth/forget-password"
              className="text-[#4facfe] text-sm hover:underline"
            >
              Forget Password?
            </a>
            <a
              href="/auth/create"
              className="text-[#4facfe] text-sm hover:underline"
            >
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
