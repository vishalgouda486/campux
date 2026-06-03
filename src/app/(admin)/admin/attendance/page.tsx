"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: string;
  name: string;
  semester: number;
};

type AttendanceRecord = {
  id: string;
  date: string;
  status: string;
  student: {
    name: string;
    semester: number;
  };
  subject: {
    name: string;
  };
};

type AttendanceReport = {
  total: number;
  present: number;
  absent: number;
  percentage: number;
  records: AttendanceRecord[];
};

export default function AdminAttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [report, setReport] = useState<AttendanceReport>({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
    records: [],
  });

  async function loadSubjects() {
    const res = await fetch("/api/subjects");
    const data = await res.json();

    setSubjects(data.subjects || []);
  }

  async function loadReport(nextSemester = semester, nextSubjectId = subjectId) {
    const params = new URLSearchParams();

    if (nextSemester) params.set("semester", nextSemester);
    if (nextSubjectId) params.set("subjectId", nextSubjectId);

    const res = await fetch(`/api/attendance?${params.toString()}`);
    const data = await res.json();

    setReport(data);
  }

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([loadSubjects(), loadReport()]);
    }

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Attendance Reports</h1>
        <p className="text-gray-500 mt-2">
          Filter attendance by semester and subject.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={semester}
            onChange={(event) => {
              setSemester(event.target.value);
              loadReport(event.target.value, subjectId);
            }}
            className="border rounded-2xl px-4 py-3"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <select
            value={subjectId}
            onChange={(event) => {
              setSubjectId(event.target.value);
              loadReport(semester, event.target.value);
            }}
            className="border rounded-2xl px-4 py-3"
          >
            <option value="">All Subjects</option>
            {subjects
              .filter((subject) => !semester || subject.semester === Number(semester))
              .map((subject) => (
                <option key={subject.id} value={subject.id}>
                  Sem {subject.semester} - {subject.name}
                </option>
              ))}
          </select>

          <div className="rounded-2xl bg-gray-900 text-white px-5 py-3">
            {report.percentage}% attendance
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          ["Total", report.total],
          ["Present", report.present],
          ["Absent", report.absent],
          ["Percentage", `${report.percentage}%`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
          >
            <p className="text-gray-500">{label}</p>
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1.3fr_120px_120px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Student</div>
          <div>Subject</div>
          <div>Date</div>
          <div>Status</div>
        </div>
        <div className="divide-y">
          {report.records.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-[1.2fr_1.3fr_120px_120px] gap-4 px-6 py-4"
            >
              <div>
                <p className="font-semibold">{record.student.name}</p>
                <p className="text-sm text-gray-500">
                  Sem {record.student.semester}
                </p>
              </div>
              <div>{record.subject.name}</div>
              <div>{new Date(record.date).toLocaleDateString()}</div>
              <div>{record.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
