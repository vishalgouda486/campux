import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const facultyEmail = searchParams.get("facultyEmail");
    const semester = searchParams.get("semester");

    if (studentId) {
      const marks = await prisma.mark.findMany({
        where: {
          studentId,
        },
        include: {
          subject: true,
          student: true,
        },
        orderBy: {
          subject: {
            name: "asc",
          },
        },
      });

      return Response.json({
        success: true,
        marks,
      });
    }

    const subjectWhere =
      facultyEmail || semester
        ? {
            ...(facultyEmail
              ? {
                  faculty: {
                    email: facultyEmail,
                  },
                }
              : {}),
            ...(semester ? { semester: Number(semester) } : {}),
          }
        : undefined;

    const [subjects, students, marks] = await Promise.all([
      prisma.subject.findMany({
        where: subjectWhere,
        include: {
          faculty: true,
        },
        orderBy: [
          {
            semester: "asc",
          },
          {
            name: "asc",
          },
        ],
      }),
      prisma.student.findMany({
        where: semester ? { semester: Number(semester) } : undefined,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.mark.findMany({
        include: {
          student: true,
          subject: true,
        },
        orderBy: [
          {
            subject: {
              semester: "asc",
            },
          },
          {
            student: {
              name: "asc",
            },
          },
        ],
      }),
    ]);

    return Response.json({
      success: true,
      subjects,
      students,
      marks,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Unable to load marks.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "");
    const subjectId = String(body.subjectId || "");
    const internal = Number(body.internal || 0);
    const assignment = Number(body.assignment || 0);

    if (!studentId || !subjectId) {
      return Response.json(
        {
          success: false,
          message: "Student and subject are required.",
        },
        {
          status: 400,
        }
      );
    }

    const existing = await prisma.mark.findFirst({
      where: {
        studentId,
        subjectId,
      },
    });

    const mark = existing
      ? await prisma.mark.update({
          where: {
            id: existing.id,
          },
          data: {
            internal,
            assignment,
          },
        })
      : await prisma.mark.create({
          data: {
            studentId,
            subjectId,
            internal,
            assignment,
          },
        });

    return Response.json({
      success: true,
      mark,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Unable to save marks.",
      },
      {
        status: 500,
      }
    );
  }
}
