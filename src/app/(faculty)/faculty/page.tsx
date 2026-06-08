"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ClassItem = {
  subject: string;
  class: string;
  room: string;
  time: string;
};

export default function FacultyPage() {
  const [todayClasses, setTodayClasses] = useState<ClassItem[]>([]);
  const [totalClassesCount, setTotalClassesCount] = useState(0);
  const [pendingSwapsCount, setPendingSwapsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentUserEmail = typeof window !== "undefined" ? localStorage.getItem("campux-email") || "" : "";

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUserEmail) return;
      setLoading(true);
      try {
        const resTimetable = await fetch("/api/timetable");
        const dataTimetable = await resTimetable.json();
        
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = daysOfWeek[new Date().getDay()];

        const facultySlots = (dataTimetable.timetable || []).filter(
          (entry: any) => entry.faculty.email === currentUserEmail
        );

        setTotalClassesCount(facultySlots.length);

        const todaySlots = facultySlots.filter((entry: any) => entry.day === today);
        // Sort by period
        todaySlots.sort((a: any, b: any) => a.period - b.period);

        const formattedTodaySlots = todaySlots.map((entry: any) => ({
          subject: entry.subject.name,
          class: `BCA Semester ${entry.semester}`,
          room: entry.classroom,
          time: `${entry.startTime} - ${entry.endTime}`,
        }));

        setTodayClasses(formattedTodaySlots);

        const resSwaps = await fetch(`/api/swaps?email=${currentUserEmail}`);
        const dataSwaps = await resSwaps.json();
        if (dataSwaps.success) {
          const pendingCount = (dataSwaps.received || []).filter((s: any) => s.status === "PENDING").length;
          setPendingSwapsCount(pendingCount);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [currentUserEmail]);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = daysOfWeek[new Date().getDay()];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 font-sans tracking-tight">Faculty Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Manage classes, attendance and student activities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 mb-3 text-sm font-semibold uppercase tracking-wider">Classes Today</p>
          <h2 className="text-4xl font-bold text-blue-600">
            {todayClasses.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 mb-3 text-sm font-semibold uppercase tracking-wider">Weekly Classes Assigned</p>
          <h2 className="text-4xl font-bold text-orange-500">
            {totalClassesCount}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
          <p className="text-gray-500 mb-3 text-sm font-semibold uppercase tracking-wider">Pending Swap Requests</p>
          <h2 className="text-4xl font-bold text-green-600">
            {pendingSwapsCount}
          </h2>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Classes</h2>
            <p className="text-gray-500 mt-1">{todayName} Schedule</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm animate-pulse">Loading dashboard information...</p>
        ) : todayClasses.length === 0 ? (
          <div className="py-10 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            No classes scheduled for today. Have a great day off!
          </div>
        ) : (
          <div className="space-y-5">
            {todayClasses.map((item, index) => (
              <motion.div
                key={`${item.subject}-${item.time}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-3xl p-5 hover:bg-gray-50/80 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{item.subject}</h3>
                    <p className="text-gray-500 mt-2">{item.class}</p>
                    <p className="text-gray-500 mt-1">{item.room}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-sm font-semibold text-gray-700">
                      {item.time}
                    </div>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-2xl hover:opacity-90 transition text-sm font-semibold">
                      Mark Attendance
                    </button>
                    <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded-2xl hover:bg-gray-300 transition text-sm font-semibold">
                      Send Notice
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
