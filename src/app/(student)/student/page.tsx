"use client";

import { useEffect, useState } from "react";

type Student = {
  name: string;
  department: string;
  semester: number;
};

export default function StudentDashboard() {

  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {

    async function fetchStudent() {

      const email = localStorage.getItem(
        "campux-email"
      );

      if (!email) return;

      const res = await fetch(
        `/api/student?email=${email}`
      );

      const data = await res.json();

      setStudent(data.student);
    }

    fetchStudent();

  }, []);

  if (!student) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* Header */}
      <div>

        <h1 className="text-4xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-2">
          {student.name}
        </p>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-2">
            Department
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {student.department}
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-2">
            Semester
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            Sem {student.semester}
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-2">
            Status
          </p>

          <h2 className="text-3xl font-bold text-orange-500">
            Active
          </h2>

        </div>

      </div>

    </div>
  );
}