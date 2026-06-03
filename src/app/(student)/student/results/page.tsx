"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  semester: number;
};

type ResultRow = {
  id: string;
  subject: {
    name: string;
    semester: number;
  };
  internal: number;
  assignment: number;
  total: number;
  status: string;
};

type ResultSummary = {
  totalSubjects: number;
  average: number;
  passCount: number;
  needsImprovement: number;
};

export default function ResultsPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [summary, setSummary] = useState<ResultSummary>({
    totalSubjects: 0,
    average: 0,
    passCount: 0,
    needsImprovement: 0,
  });

  useEffect(() => {
    async function loadResults() {
      const email = localStorage.getItem("campux-email");

      if (!email) return;

      const studentRes = await fetch(`/api/student?email=${email}`);
      const studentData = await studentRes.json();
      const activeStudent = studentData.student;

      setStudent(activeStudent);

      if (!activeStudent?.id) return;

      const resultRes = await fetch(`/api/results?studentId=${activeStudent.id}`);
      const resultData = await resultRes.json();

      setRows(resultData.rows || []);
      setSummary(resultData.summary || {
        totalSubjects: 0,
        average: 0,
        passCount: 0,
        needsImprovement: 0,
      });
    }

    loadResults();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Results</h1>
        <p className="text-gray-500 mt-2">
          {student
            ? `${student.name} / Semester ${student.semester}`
            : "Subject-wise performance"}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          ["Subjects", summary.totalSubjects],
          ["Average", `${summary.average}%`],
          ["Passed", summary.passCount],
          ["Needs Work", summary.needsImprovement],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <p className="text-gray-500 mb-2">{label}</p>
            <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1.6fr_120px_120px_120px_150px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Subject</div>
          <div>Internal</div>
          <div>Assignment</div>
          <div>Total</div>
          <div>Status</div>
        </div>

        <div className="divide-y">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1.6fr_120px_120px_120px_150px] gap-4 px-6 py-4 items-center"
            >
              <div>
                <p className="font-semibold text-gray-900">{row.subject.name}</p>
                <p className="text-sm text-gray-500">
                  Semester {row.subject.semester}
                </p>
              </div>
              <div>{row.internal}</div>
              <div>{row.assignment}</div>
              <div className="font-semibold">{row.total}</div>
              <div>
                <span
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    row.status === "PASS"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {row.status === "PASS" ? "Pass" : "Needs Improvement"}
                </span>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="px-6 py-10 text-gray-500">
              No marks have been published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
