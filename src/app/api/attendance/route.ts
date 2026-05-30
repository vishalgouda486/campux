import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  try {

    const { searchParams } =
      new URL(req.url);

    const studentId =
      searchParams.get("studentId");

    if (!studentId) {

      return Response.json({
        success: false,
      });
    }

    const records =
      await prisma.attendanceRecord.findMany({

        where: {
          studentId,
        },

        include: {
          subject: true,
        },
      });

    const total =
      records.length;

    const present =
      records.filter(
        (r) => r.status === "PRESENT"
      ).length;

    const percentage =
      total === 0
        ? 0
        : (
            (present / total) *
            100
          ).toFixed(2);

    return Response.json({

      success: true,

      total,

      present,

      absent:
        total - present,

      percentage,

      records,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
    });
  }
}

export async function POST(req: Request) {

  try {

    const body =
      await req.json();

    const {
      studentId,
      subjectId,
      status,
    } = body;

    await prisma.attendanceRecord.create({

      data: {

        studentId,

        subjectId,

        status,
      },
    });

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
    });
  }
}