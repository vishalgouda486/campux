import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const faculty = await prisma.faculty.findMany({

      orderBy: {
        name: "asc",
      },
    });

    return Response.json({
      success: true,
      faculty,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      faculty: [],
    });
  }
}

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      name,
      email,
      department,
      designation,
      specialization,
      isTeaching,
    } = body;

    await prisma.faculty.create({

      data: {
        name,
        email,
        department,
        designation,
        specialization,
        isTeaching,
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