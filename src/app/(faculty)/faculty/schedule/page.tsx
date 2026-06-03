"use client";

import { useEffect, useState } from "react";

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
    email: string;
    name: string;
  };
};

export default function FacultySchedulePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    async function loadSchedule() {
      const email = localStorage.getItem("campux-email") || "";
      const res = await fetch("/api/timetable");
      const data = await res.json();

      setEntries(
        (data.timetable || []).filter(
          (entry: TimetableEntry) => entry.faculty.email === email
        )
      );
    }

    loadSchedule();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-500 mt-2">
          Assigned timetable slots from the smart generator.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[130px_120px_1.4fr_120px_140px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Day</div>
          <div>Time</div>
          <div>Subject</div>
          <div>Semester</div>
          <div>Room</div>
        </div>
        <div className="divide-y">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[130px_120px_1.4fr_120px_140px] gap-4 px-6 py-4"
            >
              <div className="font-semibold">{entry.day}</div>
              <div>
                {entry.startTime} - {entry.endTime}
              </div>
              <div>{entry.subject.name}</div>
              <div>Sem {entry.semester}</div>
              <div>{entry.classroom}</div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="px-6 py-10 text-gray-500">
              No timetable slots assigned yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
