"use client";

import { useEffect, useState } from "react";

type Timetable = {
  id: string;

  day: string;

  startTime: string;
  endTime: string;

  classroom: string;

  semester: number;
  department: string;

  subject: {
    name: string;
  };

  faculty: {
    name: string;
  };
};

export default function AdminTimetablePage() {

  const [timetable, setTimetable] = useState<Timetable[]>([]);

  const [form, setForm] = useState({
    day: "",
    startTime: "",
    endTime: "",
    classroom: "",

    semester: 6,

    department: "CSE",

    subjectId: "",
    facultyId: "",
  });

  async function fetchTimetable() {

    const res = await fetch("/api/timetable");

    const data = await res.json();

    setTimetable(data.timetable);
  }

  useEffect(() => {

    fetchTimetable();

  }, []);

  async function createTimetable() {

    await fetch("/api/timetable/create", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    });

    alert("Timetable Added");

    fetchTimetable();
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>

        <h1 className="text-4xl font-bold text-gray-900">
          Timetable Management
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage ERP schedules.
        </p>

      </div>

      {/* Add Timetable */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add Timetable
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          <input
            placeholder="Day"
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                day: e.target.value,
              })
            }
          />

          <input
            placeholder="Start Time"
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
          />

          <input
            placeholder="End Time"
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value,
              })
            }
          />

          <input
            placeholder="Classroom"
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                classroom: e.target.value,
              })
            }
          />

          <input
            placeholder="Subject ID"
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                subjectId: e.target.value,
              })
            }
          />

          <input
            placeholder="Faculty ID"
            className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                facultyId: e.target.value,
              })
            }
          />

        </div>

        <button
          onClick={createTimetable}
          className="mt-6 bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition"
        >
          Create Timetable
        </button>

      </div>

      {/* Timetable List */}
      <div className="space-y-5">

        {timetable.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
                    {item.day}
                  </div>

                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                    Sem {item.semester}
                  </div>

                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {item.subject.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  Faculty: {item.faculty.name}
                </p>

                <p className="text-gray-500 mt-1">
                  Room: {item.classroom}
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <div className="bg-gray-100 px-5 py-3 rounded-2xl font-medium text-gray-800">
                  {item.startTime}
                </div>

                <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-medium">
                  {item.endTime}
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}