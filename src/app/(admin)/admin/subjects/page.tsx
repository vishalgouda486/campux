"use client";

import { useEffect, useState } from "react";

export default function SubjectPage() {

  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);

  async function loadData() {

    const res = await fetch("/api/subjects");

    const data = await res.json();

    setSubjects(data.subjects || []);
    setFaculty(data.faculty || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function assignFaculty(
    subjectId: string,
    facultyId: string
  ) {

    await fetch("/api/subjects", {

      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        subjectId,
        facultyId,
      }),
    });

    loadData();
  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Faculty Subject Mapping
        </h1>

        <p className="text-gray-500 mt-2">
          Assign faculty to BCA subjects.
        </p>

      </div>

      <div className="space-y-4">

        {subjects.map((subject) => (

          <div
            key={subject.id}
            className="bg-white border rounded-3xl p-6"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-xl font-bold">
                  {subject.name}
                </h2>

                <p className="text-gray-500">
                  Semester {subject.semester}
                </p>

                <p className="text-gray-500">
                  {subject.type}
                </p>

              </div>

              <div className="w-full lg:w-80">

                <select
                  value={subject.facultyId || ""}
                  className="border rounded-xl p-3 w-full"
                  onChange={(e) =>
                    assignFaculty(
                      subject.id,
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Faculty
                  </option>

                  {faculty.map((f) => (

                    <option
                      key={f.id}
                      value={f.id}
                    >
                      {f.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}