"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [semester, setSemester] = useState("");

  async function loadStudents(nextSemester = semester) {
    const params = new URLSearchParams();

    if (nextSemester) params.set("semester", nextSemester);

    const res = await fetch(`/api/student/list?${params.toString()}`);
    const data = await res.json();

    setStudents(data.students || []);
  }

  useEffect(() => {
    async function loadInitialStudents() {
      await loadStudents();
    }

    loadInitialStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-2">
            Browse BCA student records by semester.
          </p>
        </div>

        <select
          value={semester}
          onChange={(event) => {
            setSemester(event.target.value);
            loadStudents(event.target.value);
          }}
          className="border rounded-2xl px-4 py-3 bg-white"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1.5fr_120px_120px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Name</div>
          <div>Email</div>
          <div>Department</div>
          <div>Semester</div>
        </div>
        <div className="divide-y">
          {students.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-[1.3fr_1.5fr_120px_120px] gap-4 px-6 py-4"
            >
              <div className="font-semibold text-gray-900">{student.name}</div>
              <div className="text-gray-500">{student.email}</div>
              <div>{student.department}</div>
              <div>Sem {student.semester}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
