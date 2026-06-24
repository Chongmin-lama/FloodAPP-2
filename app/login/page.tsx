"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine role based on email
    let role = "citizen";
    if (formData.email.includes("admin")) role = "admin";
    else if (formData.email.includes("authority")) role = "authority";

    // Save user data to localStorage
    const userData = {
      name: formData.email.split("@")[0],
      email: formData.email,
      role: role,
    };
    localStorage.setItem("floodguard_user", JSON.stringify(userData));

    // Redirect to appropriate dashboard
    if (role === "admin") router.push("/admin");
    else if (role === "authority") router.push("/authority");
    else router.push("/citizen");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-blue-600 text-white">
          <div className="inline-block p-3 bg-white/20 rounded-2xl mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-blue-100 text-sm">Secure access to FloodGuard</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg shadow-blue-200"
          >
            Sign In
          </button>

          <div className="text-center">
            <a
              href="/register"
              className="text-sm text-slate-500 hover:text-blue-600 font-medium"
            >
              Don't have an account? Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
