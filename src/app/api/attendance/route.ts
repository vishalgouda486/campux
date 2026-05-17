import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();

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