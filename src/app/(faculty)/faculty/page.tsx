"use client";

import { motion } from "framer-motion";

export default function FacultyPage() {

  const classes = [
    {
      subject: "Operating Systems",
      class: "CSE Semester 6",
      room: "Room 204",
      time: "9:00 AM",
    },
    {
      subject: "Computer Networks",
      class: "CSE Semester 5",
      room: "Lab 3",
      time: "11:00 AM",
    },
    {
      subject: "DBMS",
      class: "ISE Semester 4",
      room: "Room 110",
      time: "2:00 PM",
    },
  ];

  return (
    <div>

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-900">
          Faculty Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage classes, attendance and student activities.
        </p>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-3">
            Classes Today
          </p>

          <h2 className="text-4xl font-bold text-blue-600">
            5
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-3">
            Attendance Pending
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            2
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-3">
            Swap Requests
          </p>

          <h2 className="text-4xl font-bold text-green-600">
            1
          </h2>

        </div>

      </div>

      {/* Schedule */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Today's Classes
            </h2>

            <p className="text-gray-500 mt-1">
              Thursday Schedule
            </p>

          </div>

        </div>

        <div className="space-y-5">

          {classes.map((item, index) => (

            <motion.div
              key={item.subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-5"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.subject}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {item.class}
                  </p>

                  <p className="text-gray-500 mt-1">
                    {item.room}
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                    {item.time}
                  </div>

                  <button className="bg-blue-600 text-white px-5 py-2 rounded-2xl hover:opacity-90 transition">
                    Mark Attendance
                  </button>

                  <button className="bg-gray-200 text-gray-800 px-5 py-2 rounded-2xl hover:bg-gray-300 transition">
                    Send Notice
                  </button>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </div>
  );
}