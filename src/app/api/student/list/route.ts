import { prisma } from "@/lib/prisma";

export async function GET() {

  const students =
    await prisma.student.findMany({

      orderBy: {
        name: "asc",
      },
    });

  return Response.json({
    students,
  });
}