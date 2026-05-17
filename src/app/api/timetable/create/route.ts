import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      day,
      startTime,
      endTime,
      classroom,
      semester,
      department,
      subjectId,
      facultyId,
    } = body;

    await prisma.timetable.create({
      data: {
        day,
        startTime,
        endTime,
        classroom,
        semester,
        department,
        subjectId,
        facultyId,
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