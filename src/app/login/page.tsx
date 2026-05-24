"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    email: "",

    password: "",
  });

  async function handleLogin() {

    try {

      setLoading(true);

      const res = await fetch("/api/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {

        alert(data.message || "Login failed");

        return;
      }

      // Save JWT Token
      localStorage.setItem(
        "campux-token",
        data.token
      );

      localStorage.setItem(
        "campux-role",
        data.role
      );

      localStorage.setItem(
        "campux-email",
        form.email
      );

      // Redirect By Role
      if (data.role === "admin") {

        router.push("/admin");

        return;
      }

      if (data.role === "faculty") {

        router.push("/faculty");

        return;
      }

      router.push("/student");

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl">

        {/* Header */}
        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Login to Campux ERP
          </p>

        </div>

        {/* Form */}
        <div className="space-y-6">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-3">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium hover:opacity-90 transition mt-4"
          >

            {loading
              ? "Logging In..."
              : "Login"
            }

          </button>

        </div>

      </div>

    </div>
  );
}