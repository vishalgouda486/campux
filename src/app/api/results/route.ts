import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const semester = searchParams.get("semester");

    const marks = await prisma.mark.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(semester
          ? {
              subject: {
                semester: Number(semester),
              },
            }
          : {}),
      },
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
          subject: {
            name: "asc",
          },
        },
      ],
    });

    const rows = marks.map((mark) => {
      const total = mark.internal1 + mark.internal2 + mark.internal3 + mark.assignment;

      return {
        id: mark.id,
        student: mark.student,
        subject: mark.subject,
        internal1: mark.internal1,
        internal2: mark.internal2,
        internal3: mark.internal3,
        assignment: mark.assignment,
        total,
        status: total >= 40 ? "PASS" : "NEEDS_IMPROVEMENT",
      };
    });

    const average =
      rows.length === 0
        ? 0
        : Math.round(
            (rows.reduce((sum, row) => sum + row.total, 0) / rows.length) * 100
          ) / 100;

    const passCount = rows.filter((row) => row.status === "PASS").length;

    return Response.json({
      success: true,
      rows,
      summary: {
        totalSubjects: rows.length,
        average,
        passCount,
        needsImprovement: rows.length - passCount,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        rows: [],
        summary: {
          totalSubjects: 0,
          average: 0,
          passCount: 0,
          needsImprovement: 0,
        },
      },
      {
        status: 500,
      }
    );
  }
}
