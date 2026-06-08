import { buildTimetable } from "@/lib/timetable-engine";
import { prisma } from "@/lib/prisma";

const ACTIVITY_SUBJECTS = [
  "Movie Screening",
  "Student Activity",
];

async function ensureActivitySubjects() {
  const teachingFaculty = await prisma.faculty.findMany({
    where: {
      isTeaching: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (teachingFaculty.length === 0) {
    throw new Error("At least one teaching faculty member is required.");
  }

  const subjects = [];
  let activityIndex = 0;

  for (let semester = 1; semester <= 6; semester += 1) {
    for (const activityName of ACTIVITY_SUBJECTS) {
      const existing = await prisma.subject.findFirst({
        where: {
          name: activityName,
          semester,
          type: "ACTIVITY",
        },
      });

      if (existing) {
        subjects.push(existing);
        continue;
      }

      const created = await prisma.subject.create({
        data: {
          name: activityName,
          semester,
          type: "ACTIVITY",
          weeklyHours: 1,
          facultyId: teachingFaculty[activityIndex % teachingFaculty.length].id,
        },
      });

      subjects.push(created);
      activityIndex += 1;
    }
  }

  return subjects;
}

export async function POST() {
  try {
    await ensureActivitySubjects();

    const [subjects, faculty, rooms] = await Promise.all([
      prisma.subject.findMany({
        where: {
          OR: [
            {
              facultyId: null,
            },
            {
              faculty: {
                isTeaching: true,
              },
            },
          ],
        },
        orderBy: [
          {
            semester: "asc",
          },
          {
            type: "asc",
          },
          {
            name: "asc",
          },
        ],
      }),
      prisma.faculty.findMany({
        where: {
          isTeaching: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.classroom.findMany({
        orderBy: {
          roomNumber: "asc",
        },
      }),
    ]);

    if (faculty.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Create at least one teaching faculty before generating.",
        },
        {
          status: 400,
        }
      );
    }

    if (rooms.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Create classrooms and labs before generating.",
        },
        {
          status: 400,
        }
      );
    }

    const result = buildTimetable({
      subjects,
      faculty,
      rooms,
    });

    await prisma.timetable.deleteMany();
    await prisma.facultyLoad.deleteMany();

    if (result.slots.length > 0) {
      await prisma.timetable.createMany({
        data: result.slots,
      });
    }

    if (result.loads.length > 0) {
      await prisma.facultyLoad.createMany({
        data: result.loads,
      });
    }

    return Response.json({
      success: result.validation.unscheduled.length === 0,
      message:
        result.validation.unscheduled.length === 0
          ? "Smart timetable generated successfully."
          : "Timetable generated with unscheduled items.",
      validation: result.validation,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate timetable.",
      },
      {
        status: 500,
      }
    );
  }
}
