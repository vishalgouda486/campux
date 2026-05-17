import { prisma } from "@/lib/prisma";

export async function GET() {

  const timetable = await prisma.timetable.findMany({
    include: {
      subject: true,
      faculty: true,
    },
  });

  return Response.json({
    timetable,
  });
}