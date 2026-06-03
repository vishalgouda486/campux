"use client";

import { useEffect, useState } from "react";

type Mark = {
  id: string;
  internal: number;
  assignment: number;
  student: {
    name: string;
    semester: number;
  };
  subject: {
    name: string;
  };
};

export default function AdminMarksPage() {
  const [semester, setSemester] = useState("");
  const [marks, setMarks] = useState<Mark[]>([]);

  async function loadMarks(nextSemester = semester) {
    const params = new URLSearchParams();

    if (nextSemester) params.set("semester", nextSemester);

    const res = await fetch(`/api/marks?${params.toString()}`);
    const data = await res.json();

    setMarks(data.marks || []);
  }

  useEffect(() => {
    async function loadInitialMarks() {
      await loadMarks();
    }

    loadInitialMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Marks Reports</h1>
          <p className="text-gray-500 mt-2">
            Admin overview of internal and assignment marks.
          </p>
        </div>

        <select
          value={semester}
          onChange={(event) => {
            setSemester(event.target.value);
            loadMarks(event.target.value);
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
        <div className="grid grid-cols-[1.3fr_1.4fr_100px_100px_100px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Student</div>
          <div>Subject</div>
          <div>Internal</div>
          <div>Assignment</div>
          <div>Total</div>
        </div>
        <div className="divide-y">
          {marks.map((mark) => (
            <div
              key={mark.id}
              className="grid grid-cols-[1.3fr_1.4fr_100px_100px_100px] gap-4 px-6 py-4"
            >
              <div>
                <p className="font-semibold">{mark.student.name}</p>
                <p className="text-sm text-gray-500">
                  Sem {mark.student.semester}
                </p>
              </div>
              <div>{mark.subject.name}</div>
              <div>{mark.internal}</div>
              <div>{mark.assignment}</div>
              <div className="font-semibold">{mark.internal + mark.assignment}</div>
            </div>
          ))}
          {marks.length === 0 && (
            <div className="px-6 py-10 text-gray-500">
              No marks recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
