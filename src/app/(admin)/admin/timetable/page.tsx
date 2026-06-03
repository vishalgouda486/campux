"use client";

import { useEffect, useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [
  { period: 1, label: "9:30 AM - 10:30 AM" },
  { period: 2, label: "11:00 AM - 12:00 PM" },
  { period: 3, label: "12:00 PM - 1:00 PM" },
  { period: 4, label: "2:00 PM - 3:00 PM" },
  { period: 5, label: "3:00 PM - 4:00 PM" },
  { period: 6, label: "4:00 PM - 5:00 PM" },
];

type Entry = {
  id: string;
  day: string;
  period: number;
  classroom: string;
  roomType: string;
  semester: number;
  subject: {
    name: string;
  };
  faculty: {
    name: string;
  };
};

type Validation = {
  scheduledSlots: number;
  facultyClashes: string[];
  roomClashes: string[];
  semesterClashes: string[];
  overloads: string[];
  unscheduled: string[];
};

export default function AdminTimetablePage() {
  const [semester, setSemester] = useState(1);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [validation, setValidation] = useState<Validation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function loadTimetable() {
    const res = await fetch("/api/timetable");
    const data = await res.json();

    setEntries(data.timetable || []);
  }

  async function generateTimetable() {
    setIsGenerating(true);

    const res = await fetch("/api/timetable/create", {
      method: "POST",
    });
    const data = await res.json();

    setValidation(data.validation || null);

    if (res.ok) {
      await loadTimetable();
    }

    setIsGenerating(false);
  }

  useEffect(() => {
    async function loadInitialTimetable() {
      await loadTimetable();
    }

    loadInitialTimetable();
  }, []);

  function getCell(day: string, period: number) {
    return entries.find(
      (item) =>
        item.semester === semester &&
        item.day === day &&
        item.period === period
    );
  }

  const issueCount = validation
    ? validation.facultyClashes.length +
      validation.roomClashes.length +
      validation.semesterClashes.length +
      validation.overloads.length +
      validation.unscheduled.length
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Timetable Generator
          </h1>
          <p className="text-gray-500 mt-2">
            Smart BCA semester scheduling with clash validation.
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="border rounded-2xl px-4 py-3"
          >
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <button
            onClick={generateTimetable}
            disabled={isGenerating}
            className="bg-black text-white px-6 py-3 rounded-2xl disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Generate Timetable"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="border p-4 bg-gray-50 min-w-[150px]">
                Time
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="border p-4 bg-gray-50 min-w-[220px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {PERIODS.map((slot) => (
              <tr key={slot.period}>
                <td className="border p-4 font-semibold bg-gray-50">
                  {slot.label}
                </td>

                {DAYS.map((day) => {
                  const cell = getCell(day, slot.period);

                  return (
                    <td
                      key={`${day}-${slot.period}`}
                      className="border p-3 h-[120px] align-top"
                    >
                      {cell ? (
                        <div className="bg-blue-50 rounded-2xl p-3 h-full">
                          <div className="font-bold text-blue-900 text-sm">
                            {cell.subject.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            {cell.faculty.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {cell.classroom} / {cell.roomType}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-300 text-sm">Free</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100">
        <h2 className="font-bold text-xl mb-3">Smart Engine Rules</h2>
        <ul className="space-y-2 text-gray-600 list-disc pl-5">
          <li>Working Hours: 9:30 AM - 5:00 PM</li>
          <li>Break: 10:30 AM - 11:00 AM</li>
          <li>Lunch: 1:00 PM - 2:00 PM</li>
          <li>Movie Screening: 1 Hour Weekly</li>
          <li>Student Activity: 1 Hour Weekly</li>
          <li>Labs: 2 Continuous Hours</li>
          <li>Teaching faculty: maximum 4 scheduled classes per day</li>
        </ul>
      </div>

      {validation && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h2 className="font-bold text-xl">Generation Validation</h2>
              <p className="text-gray-500 mt-1">
                {validation.scheduledSlots} slots scheduled.
              </p>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {issueCount === 0 ? "No conflicts detected" : "Review required"}
            </div>
          </div>

          {validation.unscheduled.length > 0 && (
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-amber-900">
              <p className="font-semibold mb-2">Unscheduled items</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {validation.unscheduled.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
