"use client";

import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-bg-secondary">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">WELCOME!</h1>
        <p className="text-gray-600 mb-8">Log In to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-600">
              👤
            </span>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full py-3 px-10 border-b border-gray-300 focus:border-[#4facfe] outline-none text-base"
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
            />
          </div>

          <button
            type="submit"
            className="bg-[#e8ff54] text-black py-3 px-6 rounded-full text-base font-medium hover:bg-[#d9f046] transition-colors mt-5"
          >
            Login
          </button>

          <a
            href="/auth/forgot-password"
            className="text-[#4facfe] text-sm hover:underline mt-4"
          >
            Forget Password?
          </a>
        </form>
      </div>
    </div>
  );
}
