"use client";

import { useEffect, useState } from "react";

export default function StudentAttendancePage() {

  const [loading, setLoading] =
    useState(true);

  const [attendance, setAttendance] =
    useState<any>(null);

  const [student, setStudent] =
    useState<any>(null);

  useEffect(() => {

    async function loadData() {

      try {

        const email =
          localStorage.getItem(
            "campux-email"
          );

        if (!email) return;

        const studentRes =
          await fetch(
            `/api/student?email=${email}`
          );

        const studentData =
          await studentRes.json();

        setStudent(
          studentData.student
        );

        if (
          !studentData.student?.id
        ) {

          setLoading(false);

          return;
        }

        const attendanceRes =
          await fetch(
            `/api/attendance?studentId=${studentData.student.id}`
          );

        const attendanceData =
          await attendanceRes.json();

        setAttendance(
          attendanceData
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    loadData();

  }, []);

  if (loading) {

    return (
      <div className="p-10 text-2xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="space-y-8 p-6">

      <div>

        <h1 className="text-4xl font-bold">
          Attendance Dashboard
        </h1>

        <p className="text-gray-500 mt-2">

          {student?.name}

        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl border p-6">

          <h3 className="text-gray-500">
            Attendance %
          </h3>

          <p className="text-4xl font-bold mt-3">

            {attendance?.percentage || 0}%

          </p>

        </div>

        <div className="bg-white rounded-3xl border p-6">

          <h3 className="text-gray-500">
            Total Classes
          </h3>

          <p className="text-4xl font-bold mt-3">

            {attendance?.total || 0}

          </p>

        </div>

        <div className="bg-white rounded-3xl border p-6">

          <h3 className="text-gray-500">
            Present
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-3">

            {attendance?.present || 0}

          </p>

        </div>

        <div className="bg-white rounded-3xl border p-6">

          <h3 className="text-gray-500">
            Absent
          </h3>

          <p className="text-4xl font-bold text-red-600 mt-3">

            {attendance?.absent || 0}

          </p>

        </div>

      </div>

      <div className="bg-white rounded-3xl border p-6">

        <h2 className="text-2xl font-bold mb-6">
          Attendance Records
        </h2>

        <div className="space-y-4">

          {attendance?.records?.map(
            (record: any) => (

              <div
                key={record.id}
                className="border rounded-2xl p-4 flex justify-between"
              >

                <div>

                  <p className="font-semibold">

                    {
                      record.subject
                        ?.name
                    }

                  </p>

                  <p className="text-gray-500 text-sm">

                    {new Date(
                      record.date
                    ).toLocaleDateString()}

                  </p>

                </div>

                <div>

                  <span
                    className={`px-4 py-2 rounded-xl text-white ${
                      record.status ===
                      "PRESENT"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >

                    {record.status}

                  </span>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}