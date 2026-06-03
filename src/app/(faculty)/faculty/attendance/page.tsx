"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  id: string;
  name: string;
  semester: number;
};

type Subject = {
  id: string;
  name: string;
  semester: number;
};

export default function FacultyAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [absentStudents, setAbsentStudents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const facultyEmail = localStorage.getItem("campux-email") || "";
    const subjectsRes = await fetch(`/api/marks?facultyEmail=${facultyEmail}`);
    const subjectsData = await subjectsRes.json();
    const availableSubjects = subjectsData.subjects || [];

    setSubjects(availableSubjects);

    if (!selectedSubject && availableSubjects[0]?.id) {
      setSelectedSubject(availableSubjects[0].id);
    }

    const studentsRes = await fetch("/api/student/list");
    const studentsData = await studentsRes.json();

    setStudents(studentsData.students || []);
  }

  useEffect(() => {
    async function loadInitialData() {
      await loadData();
    }

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = subjects.find((subject) => subject.id === selectedSubject);
  const semesterStudents = useMemo(
    () =>
      selected
        ? students.filter((student) => student.semester === selected.semester)
        : [],
    [selected, students]
  );

  function toggleAbsent(id: string) {
    setAbsentStudents((prev) =>
      prev.includes(id) ? prev.filter((studentId) => studentId !== id) : [...prev, id]
    );
  }

  async function submitAttendance() {
    if (!selectedSubject) return;

    setIsSubmitting(true);

    await Promise.all(
      semesterStudents.map((student) =>
        fetch("/api/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: student.id,
            subjectId: selectedSubject,
            status: absentStudents.includes(student.id) ? "ABSENT" : "PRESENT",
          }),
        })
      )
    );

    setAbsentStudents([]);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-500 mt-2">
            Mark attendance only for students in the selected subject semester.
          </p>
        </div>

        <select
          value={selectedSubject}
          onChange={(event) => {
            setSelectedSubject(event.target.value);
            setAbsentStudents([]);
          }}
          className="border rounded-2xl px-4 py-3 bg-white min-w-72"
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              Sem {subject.semester} - {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selected?.name || "Select a subject"}
            </h2>
            <p className="text-gray-500 mt-1">
              {semesterStudents.length} students loaded
            </p>
          </div>

          <button
            onClick={submitAttendance}
            disabled={isSubmitting || !selectedSubject}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl disabled:opacity-60"
          >
            {isSubmitting ? "Submitting" : "Submit Attendance"}
          </button>
        </div>

        <div className="space-y-3">
          {semesterStudents.map((student) => {
            const isAbsent = absentStudents.includes(student.id);

            return (
              <div
                key={student.id}
                className="flex justify-between border border-gray-100 rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">
                    Semester {student.semester}
                  </p>
                </div>

                <button
                  onClick={() => toggleAbsent(student.id)}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isAbsent ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {isAbsent ? "Absent" : "Present"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
