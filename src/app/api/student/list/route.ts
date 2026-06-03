import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const semester = searchParams.get("semester");

  const students =
    await prisma.student.findMany({

      where: semester
        ? {
            semester: Number(semester),
          }
        : undefined,

      orderBy: {
        name: "asc",
      },
    });

  return Response.json({
    students,
  });
}
