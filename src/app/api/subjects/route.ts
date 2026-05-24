import { prisma } from "@/lib/prisma";

export async function GET() {

  const subjects = await prisma.subject.findMany({

    include: {
      faculty: true,
    },

    orderBy: {
      semester: "asc",
    },
  });

  const faculty = await prisma.faculty.findMany({

    where: {
      isTeaching: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  return Response.json({
    subjects,
    faculty,
  });
}

export async function POST(req: Request) {

  const body = await req.json();

  const {
    name,
    semester,
    type,
    weeklyHours,
  } = body;

  await prisma.subject.create({

    data: {
      name,
      semester,
      type,
      weeklyHours,
    },
  });

  return Response.json({
    success: true,
  });
}

export async function PATCH(req: Request) {

  const body = await req.json();

  const {
    subjectId,
    facultyId,
  } = body;

  await prisma.subject.update({

    where: {
      id: subjectId,
    },

    data: {
      facultyId,
    },
  });

  return Response.json({
    success: true,
  });
}