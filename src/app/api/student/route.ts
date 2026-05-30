import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");

  if (!email) {

    return Response.json({
      student: null,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {

    return Response.json({
      student: null,
    });
  }

  const student =
  await prisma.student.findUnique({
      where: {
        email,
      },
    });

  return Response.json({
    student,
  });
}