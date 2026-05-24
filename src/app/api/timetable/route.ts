import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const timetable =
      await prisma.timetable.findMany({

        include: {
          subject: true,
          faculty: true,
        },

        orderBy: [
          {
            semester: "asc",
          },
          {
            day: "asc",
          },
          {
            period: "asc",
          },
        ],
      });

    return Response.json({
      success: true,
      timetable,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      timetable: [],
    });
  }
}