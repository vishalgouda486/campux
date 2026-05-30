"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
};

export default function FacultyAttendancePage() {

  const [students, setStudents] =
    useState<Student[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [absentStudents, setAbsentStudents] =
    useState<string[]>([]);

  useEffect(() => {

    async function loadData() {

      const subjectsRes =
        await fetch("/api/subjects");

      const subjectsData =
        await subjectsRes.json();

      setSubjects(
        subjectsData.subjects || []
      );

      const studentsRes =
        await fetch("/api/student/list");

      const studentsData =
        await studentsRes.json();

      setStudents(
        studentsData.students || []
      );
    }

    loadData();

  }, []);

  function toggleAbsent(id: string) {

    setAbsentStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  }

  async function submitAttendance() {

    if (!selectedSubject) {

      alert("Select Subject");

      return;
    }

    for (const student of students) {

      const status =
        absentStudents.includes(student.id)
          ? "ABSENT"
          : "PRESENT";

      await fetch("/api/attendance", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          studentId: student.id,

          subjectId:
            selectedSubject,

          status,
        }),
      });
    }

    alert(
      "Attendance Submitted Successfully"
    );
  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">

          Attendance Management

        </h1>

      </div>

      <div className="bg-white rounded-3xl p-6 border">

        <div className="mb-6">

          <label className="block mb-2 font-medium">

            Select Subject

          </label>

          <select
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(
                e.target.value
              )
            }
            className="border rounded-xl p-3 w-full"
          >

            <option value="">
              Select Subject
            </option>

            {subjects.map((subject) => (

              <option
                key={subject.id}
                value={subject.id}
              >

                {subject.name}

              </option>
            ))}

          </select>

        </div>

        <button
          onClick={submitAttendance}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl mb-6"
        >

          Submit Attendance

        </button>

        <div className="space-y-3">

          {students.map((student) => {

            const isAbsent =
              absentStudents.includes(
                student.id
              );

            return (

              <div
                key={student.id}
                className="flex justify-between border rounded-xl p-4"
              >

                <span>

                  {student.name}

                </span>

                <button
                  onClick={() =>
                    toggleAbsent(
                      student.id
                    )
                  }
                  className={`px-4 py-2 rounded-lg text-white ${
                    isAbsent
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >

                  {isAbsent
                    ? "Absent"
                    : "Present"}

                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}