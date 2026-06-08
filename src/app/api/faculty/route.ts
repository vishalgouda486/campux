import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const faculty = await prisma.faculty.findUnique({
        where: { email },
      });
      return Response.json({
        success: true,
        faculty,
      });
    }

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
    console.error(error);
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

    if (!name || !email || !department) {
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
        role: "faculty",
      },
    });

    // Create Faculty record
    const faculty = await prisma.faculty.create({
      data: {
        name,
        email,
        department,
        designation,
        specialization,
        isTeaching: Boolean(isTeaching),
      },
    });

    return Response.json({
      success: true,
      faculty,
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      success: false,
      message: error.message || "Failed to create faculty.",
    });
  }
}