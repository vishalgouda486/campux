"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  department: string;
  semester: number;
};

type TimetableEntry = {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  classroom: string;
  semester: number;
  subject: {
    name: string;
  };
  faculty: {
    name: string;
  };
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const email = localStorage.getItem("campux-email");

      if (!email) return;

      const studentRes = await fetch(`/api/student?email=${email}`);
      const studentData = await studentRes.json();
      const activeStudent = studentData.student;

      setStudent(activeStudent);

      if (!activeStudent) return;

      const timetableRes = await fetch("/api/timetable");
      const timetableData = await timetableRes.json();

      setEntries(
        (timetableData.timetable || []).filter(
          (entry: TimetableEntry) => entry.semester === activeStudent.semester
        )
      );
    }

    loadDashboard();
  }, []);

  if (!student) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Semester {student.semester} Timetable
        </h1>
        <p className="text-gray-500 mt-2">
          {student.name} / {student.department}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          ["Department", student.department],
          ["Semester", `Sem ${student.semester}`],
          ["Weekly Slots", entries.length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >
            <p className="text-gray-500 mb-2">{label}</p>
            <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {DAYS.map((day) => {
          const dayEntries = entries
            .filter((entry) => entry.day === day)
            .sort((a, b) => a.period - b.period);

          return (
            <div
              key={day}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5">{day}</h2>
              <div className="space-y-3">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {entry.subject.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {entry.faculty.name} / {entry.classroom}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {entry.startTime} - {entry.endTime}
                      </p>
                    </div>
                  </div>
                ))}

                {dayEntries.length === 0 && (
                  <p className="text-gray-400">No classes scheduled.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
