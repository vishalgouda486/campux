"use client";

import { useEffect, useMemo, useState } from "react";

type Subject = {
  id: string;
  name: string;
  semester: number;
};

type Student = {
  id: string;
  name: string;
  semester: number;
};

type Mark = {
  id: string;
  studentId: string;
  subjectId: string;
  internal1: number;
  internal2: number;
  internal3: number;
  assignment: number;
};

export default function FacultyMarksPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [savingStudent, setSavingStudent] = useState("");

  async function loadData() {
    const facultyEmail = localStorage.getItem("campux-email") || "";
    const res = await fetch(`/api/marks?facultyEmail=${facultyEmail}`);
    const data = await res.json();

    setSubjects(data.subjects || []);
    setStudents(data.students || []);
    setMarks(data.marks || []);

    if (!selectedSubject && data.subjects?.[0]?.id) {
      setSelectedSubject(data.subjects[0].id);
    }
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

  function getMark(studentId: string) {
    return marks.find(
      (mark) => mark.studentId === studentId && mark.subjectId === selectedSubject
    );
  }

  async function saveMark(
    studentId: string,
    internal1: number,
    internal2: number,
    internal3: number,
    assignment: number
  ) {
    setSavingStudent(studentId);

    await fetch("/api/marks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        subjectId: selectedSubject,
        internal1,
        internal2,
        internal3,
        assignment,
      }),
    });

    await loadData();
    setSavingStudent("");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Marks Management</h1>
          <p className="text-gray-500 mt-2">
            Enter marks for assigned BCA subjects. Internal 1, 2, and 3 are max 40 marks each.
          </p>
        </div>

        <select
          value={selectedSubject}
          onChange={(event) => setSelectedSubject(event.target.value)}
          className="border rounded-2xl px-4 py-3 bg-white min-w-72"
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              Sem {subject.semester} - {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1.4fr_100px_100px_100px_120px_120px] gap-4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
          <div>Student</div>
          <div className="text-center">Int 1 (Max 40)</div>
          <div className="text-center">Int 2 (Max 40)</div>
          <div className="text-center">Int 3 (Max 40)</div>
          <div className="text-center">Assignment</div>
          <div className="text-center">Action</div>
        </div>

        <div className="divide-y">
          {semesterStudents.map((student) => {
            const existing = getMark(student.id);

            return (
              <MarksRow
                key={`${student.id}-${existing?.internal1 || 0}-${existing?.internal2 || 0}-${existing?.internal3 || 0}-${existing?.assignment || 0}`}
                student={student}
                existing={existing}
                isSaving={savingStudent === student.id}
                onSave={saveMark}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MarksRow({
  student,
  existing,
  isSaving,
  onSave,
}: {
  student: Student;
  existing?: Mark;
  isSaving: boolean;
  onSave: (
    studentId: string,
    internal1: number,
    internal2: number,
    internal3: number,
    assignment: number
  ) => void;
}) {
  const [internal1, setInternal1] = useState(existing?.internal1 || 0);
  const [internal2, setInternal2] = useState(existing?.internal2 || 0);
  const [internal3, setInternal3] = useState(existing?.internal3 || 0);
  const [assignment, setAssignment] = useState(existing?.assignment || 0);

  return (
    <div className="grid grid-cols-[1.4fr_100px_100px_100px_120px_120px] gap-4 px-6 py-4 items-center">
      <div>
        <p className="font-semibold text-gray-900">{student.name}</p>
        <p className="text-sm text-gray-500">Semester {student.semester}</p>
      </div>

      <input
        type="number"
        value={internal1}
        min={0}
        max={40}
        onChange={(event) => setInternal1(Number(event.target.value))}
        className="border rounded-xl px-3 py-2 w-full text-center"
        placeholder="I1"
      />

      <input
        type="number"
        value={internal2}
        min={0}
        max={40}
        onChange={(event) => setInternal2(Number(event.target.value))}
        className="border rounded-xl px-3 py-2 w-full text-center"
        placeholder="I2"
      />

      <input
        type="number"
        value={internal3}
        min={0}
        max={40}
        onChange={(event) => setInternal3(Number(event.target.value))}
        className="border rounded-xl px-3 py-2 w-full text-center"
        placeholder="I3"
      />

      <input
        type="number"
        value={assignment}
        min={0}
        max={50}
        onChange={(event) => setAssignment(Number(event.target.value))}
        className="border rounded-xl px-3 py-2 w-full text-center"
        placeholder="Assg"
      />

      <button
        onClick={() => onSave(student.id, internal1, internal2, internal3, assignment)}
        disabled={isSaving}
        className="bg-blue-600 text-white rounded-xl px-4 py-2 disabled:opacity-60 w-full hover:bg-blue-700 transition"
      >
        {isSaving ? "Saving" : "Save"}
      </button>
    </div>
  );
}
