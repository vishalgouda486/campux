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
  {
    period: 1,
    label: "9:30 AM - 10:30 AM",
  },
  {
    period: 2,
    label: "11:00 AM - 12:00 PM",
  },
  {
    period: 3,
    label: "12:00 PM - 1:00 PM",
  },
  {
    period: 4,
    label: "2:00 PM - 3:00 PM",
  },
  {
    period: 5,
    label: "3:00 PM - 4:00 PM",
  },
  {
    period: 6,
    label: "4:00 PM - 5:00 PM",
  },
];

type Entry = {
  id: string;

  day: string;

  period: number;

  classroom: string;

  semester: number;

  subject: {
    name: string;
  };

  faculty: {
    name: string;
  };
};

export default function AdminTimetablePage() {

  const [semester, setSemester] = useState(1);

  const [entries, setEntries] = useState<Entry[]>([]);

  async function loadTimetable() {

    const res = await fetch("/api/timetable");

    const data = await res.json();

    setEntries(data.timetable || []);
  }

  async function generateTimetable() {

    const res = await fetch(
      "/api/timetable/create",
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (data.success) {

      alert(
        "Timetable Generated Successfully"
      );

      loadTimetable();
    }
  }

  useEffect(() => {

    loadTimetable();

  }, []);

  function getCell(
    day: string,
    period: number
  ) {

    return entries.find(
      (item) =>
        item.semester === semester &&
        item.day === day &&
        item.period === period
    );
  }

  return (

    <div className="space-y-8">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">
            Timetable Generator
          </h1>

          <p className="text-gray-500 mt-2">
            BCA Semester Timetable
          </p>

        </div>

        <div className="flex gap-3">

          <select
            value={semester}
            onChange={(e) =>
              setSemester(
                Number(e.target.value)
              )
            }
            className="border rounded-2xl px-4 py-3"
          >

            <option value={1}>
              Semester 1
            </option>

            <option value={2}>
              Semester 2
            </option>

            <option value={3}>
              Semester 3
            </option>

            <option value={4}>
              Semester 4
            </option>

            <option value={5}>
              Semester 5
            </option>

            <option value={6}>
              Semester 6
            </option>

          </select>

          <button
            onClick={generateTimetable}
            className="bg-black text-white px-6 py-3 rounded-2xl"
          >
            Generate Timetable
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

                  const cell = getCell(
                    day,
                    slot.period
                  );

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

                            {cell.classroom}

                          </div>

                        </div>

                      ) : (

                        <div className="text-gray-300 text-sm">

                          Free

                        </div>

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

        <h2 className="font-bold text-xl mb-3">
          College Rules
        </h2>

        <ul className="space-y-2 text-gray-600">

          <li>
            • Working Hours: 9 AM - 5 PM
          </li>

          <li>
            • 30 Minute Break
          </li>

          <li>
            • 1 Hour Lunch Break
          </li>

          <li>
            • Movie Screening: 1 Hour Weekly
          </li>

          <li>
            • Student Activity: 1 Hour Weekly
          </li>

          <li>
            • Labs: 2 Continuous Hours
          </li>

        </ul>

      </div>

    </div>
  );
}