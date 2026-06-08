import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

  const student = await prisma.student.findUnique({
    where: {
      email,
    },
  });

  return Response.json({
    student,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, department, semester } = body;

    if (!name || !email || !department || !semester) {
      return Response.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return Response.json({ success: false, message: "Email is already registered." });
    }

    const defaultPassword = "Password@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create User record
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "student",
      },
    });

    // Create Student record
    const student = await prisma.student.create({
      data: {
        name,
        email,
        department,
        semester: Number(semester),
      },
    });

    return Response.json({
      success: true,
      student,
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      success: false,
      message: error.message || "Failed to create student.",
    });
  }
}