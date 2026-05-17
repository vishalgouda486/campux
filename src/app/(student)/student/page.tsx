import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function StudentDashboard() {

  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    return redirect("/sign-in");
  }

  const email = user.emailAddresses[0].emailAddress;

  // Fetch Student
  const student = await prisma.student.findUnique({
    where: {
      email,
    },
  });

  if (!student) {
    return (
      <div className="p-10">
        Student not found in database.
      </div>
    );
  }

  // Fetch Timetable
  const timetable = await prisma.timetable.findMany({
    where: {
      department: student.department,
      semester: student.semester,
    },

    include: {
      subject: true,
      faculty: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  // Fetch Attendance
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: student.id,
    },

    include: {
      subject: true,
    },
  });

  // Fetch Marks
  const marks = await prisma.mark.findMany({
    where: {
      studentId: student.id,
    },

    include: {
      subject: true,
    },
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>

        <h1 className="text-4xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-2">
          {student.name}
        </p>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-2">
            Department
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {student.department}
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-2">
            Semester
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            Sem {student.semester}
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

          <p className="text-gray-500 mb-2">
            Subjects
          </p>

          <h2 className="text-3xl font-bold text-orange-500">
            {timetable.length}
          </h2>

        </div>

      </div>

      {/* Timetable */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Weekly Timetable
            </h2>

            <p className="text-gray-500 mt-1">
              Live Schedule Data
            </p>

          </div>

        </div>

        <div className="space-y-5">

          {timetable.map((item) => (

            <div
              key={item.id}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-5"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>

                  <p className="text-blue-600 font-semibold text-sm">
                    {item.day}
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {item.subject.name}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Faculty: {item.faculty.name}
                  </p>

                  <p className="text-gray-500 mt-1">
                    Classroom: {item.classroom}
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl font-medium">
                    {item.startTime}
                  </div>

                  <div className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl font-medium">
                    {item.endTime}
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Attendance */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Attendance
        </h2>

        <div className="space-y-5">

          {attendance.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl p-5"
            >

              <div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {item.subject.name}
                </h3>

                <p className="text-gray-500 mt-1">
                  Attendance Percentage
                </p>

              </div>

              <div className="text-3xl font-bold text-blue-600">
                {item.percentage}%
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Marks */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Internal Marks
        </h2>

        <div className="space-y-5">

          {marks.map((item) => (

            <div
              key={item.id}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-5"
            >

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-xl font-semibold text-gray-900">
                  {item.subject.name}
                </h3>

                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium">
                  Internal
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-white rounded-2xl p-4 border border-gray-100">

                  <p className="text-gray-500 mb-2">
                    Internal Marks
                  </p>

                  <h2 className="text-3xl font-bold text-blue-600">
                    {item.internal}
                  </h2>

                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100">

                  <p className="text-gray-500 mb-2">
                    Assignment Marks
                  </p>

                  <h2 className="text-3xl font-bold text-green-600">
                    {item.assignment}
                  </h2>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}