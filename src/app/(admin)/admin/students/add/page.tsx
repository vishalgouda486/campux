"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "BCA",
    semester: "1",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.department || !form.semester) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to add student.");
        return;
      }

      alert("Student added successfully! Default password is 'Password@123'.");
      router.push("/admin/students");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/students"
          className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-gray-500 mt-1">Register a student semester-wise.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Student Profile Info</h2>
              <p className="text-sm text-gray-500">All fields are mandatory.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter student's full name"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter student's email"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <select
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black bg-white transition"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="BCom">BCom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black bg-white transition"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-600">
            💡 **Default Login Info:** The student will log in using their email and the default password **`Password@123`** (which meets security guidelines). They can change it after logging in.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium hover:opacity-90 transition shadow-md disabled:opacity-60"
          >
            {loading ? "Registering Student..." : "Create Student Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
