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

  return Response.json({
    student: {
      name: user.name,
      department: "CSE",
      semester: 6,
    },
  });
}