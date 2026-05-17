"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
};

export default function FacultyAttendancePage() {

  const [students, setStudents] = useState<Student[]>([]);

  const [absentStudents, setAbsentStudents] = useState<string[]>([]);

  // Fetch Students
  useEffect(() => {

    async function fetchStudents() {

      const res = await fetch("/api/students");

      const data = await res.json();

      setStudents(data.students);
    }

    fetchStudents();

  }, []);

  function toggleAbsent(id: string) {

    setAbsentStudents((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  async function submitAttendance() {

    for (const student of students) {

      const status = absentStudents.includes(student.id)
        ? "ABSENT"
        : "PRESENT";

      await fetch("/api/attendance", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId: student.id,

          subjectId: "replace-subject-id",

          status,
        }),
      });
    }

    alert("Attendance Submitted");
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>

        <h1 className="text-4xl font-bold text-gray-900">
          Attendance Management
        </h1>

        <p className="text-gray-500 mt-2">
          Mark absent students for today's class.
        </p>

      </div>

      {/* Attendance Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Operating Systems
            </h2>

            <p className="text-gray-500 mt-1">
              CSE Semester 6
            </p>

          </div>

          <button
            onClick={submitAttendance}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:opacity-90 transition font-medium"
          >
            Submit Attendance
          </button>

        </div>

        {/* Students */}
        <div className="space-y-4">

          {students.map((student) => {

            const isAbsent = absentStudents.includes(student.id);

            return (
              <div
                key={student.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl p-5"
              >

                <div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </h3>

                </div>

                <button
                  onClick={() => toggleAbsent(student.id)}
                  className={`px-5 py-2 rounded-2xl font-medium transition
                  
                  ${
                    isAbsent
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }
                  `}
                >
                  {isAbsent ? "Absent" : "Present"}
                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}