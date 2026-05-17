"use client";

import { motion } from "framer-motion";

export default function AdminPage() {

  const stats = [
    {
      title: "Total Students",
      value: "2,431",
    },
    {
      title: "Faculty Members",
      value: "124",
    },
    {
      title: "Classes Today",
      value: "86",
    },
    {
      title: "Announcements",
      value: "14",
    },
  ];

  return (
    <div>

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your entire college ERP system.
        </p>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {stats.map((stat, index) => (

          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >

            <p className="text-gray-500 mb-3">
              {stat.title}
            </p>

            <h2 className="text-4xl font-bold text-gray-900">
              {stat.value}
            </h2>

          </motion.div>

        ))}

      </div>

      {/* Main Grid */}
      <div className="grid xl:grid-cols-3 gap-6">

        {/* Left */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                ERP Management
              </h2>

              <p className="text-gray-500 mt-1">
                Quick administrative controls
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <button className="bg-black text-white p-6 rounded-3xl text-left hover:opacity-90 transition">

              <h3 className="text-xl font-bold mb-2">
                Manage Students
              </h3>

              <p className="text-gray-300">
                Add, edit and manage student records
              </p>

            </button>

            <button className="bg-blue-600 text-white p-6 rounded-3xl text-left hover:opacity-90 transition">

              <h3 className="text-xl font-bold mb-2">
                Manage Faculty
              </h3>

              <p className="text-blue-100">
                Faculty allocation and access control
              </p>

            </button>

            <button className="bg-green-600 text-white p-6 rounded-3xl text-left hover:opacity-90 transition">

              <h3 className="text-xl font-bold mb-2">
                Time Table Control
              </h3>

              <p className="text-green-100">
                Create and update class schedules
              </p>

            </button>

            <button className="bg-orange-500 text-white p-6 rounded-3xl text-left hover:opacity-90 transition">

              <h3 className="text-xl font-bold mb-2">
                Send Announcements
              </h3>

              <p className="text-orange-100">
                Broadcast notifications to all users
              </p>

            </button>

          </div>

        </div>

        {/* Right */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>

          <div className="space-y-5">

            <div>

              <p className="font-semibold text-gray-900">
                Time Table Updated
              </p>

              <p className="text-sm text-gray-500 mt-1">
                CSE Semester 6 • 10 mins ago
              </p>

            </div>

            <div>

              <p className="font-semibold text-gray-900">
                Faculty Swap Approved
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Operating Systems • 1 hour ago
              </p>

            </div>

            <div>

              <p className="font-semibold text-gray-900">
                Attendance Uploaded
              </p>

              <p className="text-sm text-gray-500 mt-1">
                240 records updated
              </p>

            </div>

            <div>

              <p className="font-semibold text-gray-900">
                New Announcement Sent
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Semester Examination Circular
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}