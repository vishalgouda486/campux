"use client";

import { useState } from "react";

type Faculty = {
  id: string;
  name: string;
  email: string;
  department: string;
  designation?: string;
  specialization?: string;
  isTeaching: boolean;
};

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "BCA",
    designation: "",
    specialization: "",
    isTeaching: true,
  });

  async function loadFaculty() {
    const res = await fetch("/api/faculty");
    const data = await res.json();

    setFaculty(data.faculty || []);
  }

  async function addFaculty() {
    const res = await fetch("/api/faculty", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Faculty Added");

      loadFaculty();
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Faculty Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage BCA faculty members.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border shadow-sm">

        <h2 className="text-2xl font-bold mb-6">
          Add Faculty
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Faculty Name"
            className="border rounded-xl p-3"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            className="border rounded-xl p-3"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Designation"
            className="border rounded-xl p-3"
            onChange={(e) =>
              setForm({
                ...form,
                designation: e.target.value,
              })
            }
          />

          <input
            placeholder="Specialization"
            className="border rounded-xl p-3"
            onChange={(e) =>
              setForm({
                ...form,
                specialization: e.target.value,
              })
            }
          />

          <select
            className="border rounded-xl p-3"
            onChange={(e) =>
              setForm({
                ...form,
                isTeaching: e.target.value === "true",
              })
            }
          >
            <option value="true">
              Teaching
            </option>

            <option value="false">
              Non Teaching
            </option>
          </select>

        </div>

        <button
          onClick={addFaculty}
          className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
        >
          Add Faculty
        </button>

      </div>

      <div className="bg-white rounded-3xl p-6 border shadow-sm">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Faculty List
          </h2>

          <button
            onClick={loadFaculty}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Refresh
          </button>

        </div>

        <div className="space-y-4">

          {faculty.map((item) => (

            <div
              key={item.id}
              className="border rounded-2xl p-4"
            >

              <h3 className="font-bold text-lg">
                {item.name}
              </h3>

              <p>{item.email}</p>

              <p>{item.designation}</p>

              <p>{item.specialization}</p>

              <p>
                {item.isTeaching
                  ? "Teaching"
                  : "Non Teaching"}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}