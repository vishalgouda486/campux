"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    semester: "1",
    type: "THEORY",
    weeklyHours: "4",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.semester || !form.type || !form.weeklyHours) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          semester: Number(form.semester),
          type: form.type,
          weeklyHours: Number(form.weeklyHours),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Failed to add subject.");
        return;
      }

      alert("Subject added successfully!");
      router.push("/admin/subjects");
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
          href="/admin/subjects"
          className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Add New Subject</h1>
          <p className="text-gray-500 mt-1">Configure a subject in the curriculum.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Subject Details</h2>
              <p className="text-sm text-gray-500">Configure weekly requirements.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                placeholder="e.g. Advanced Java, Software Engineering"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black bg-white transition"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="THEORY">Theory</option>
                  <option value="LAB">Lab</option>
                  <option value="ACTIVITY">Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weekly Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
                  value={form.weeklyHours}
                  onChange={(e) => setForm({ ...form, weeklyHours: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium hover:opacity-90 transition shadow-md disabled:opacity-60"
          >
            {loading ? "Creating Subject..." : "Create Subject"}
          </button>
        </form>
      </div>
    </div>
  );
}
