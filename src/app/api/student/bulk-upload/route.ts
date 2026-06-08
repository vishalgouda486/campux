import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { students } = body;

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload: students list is required." },
        { status: 400 }
      );
    }

    const defaultPassword = "Password@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    let successCount = 0;
    let skippedCount = 0;

    // Create user and student records sequentially
    for (const s of students) {
      const { name, email, department, semester } = s;

      if (!name || !email || !department || !semester) {
        skippedCount += 1;
        continue;
      }

      const cleanEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existingUser) {
        skippedCount += 1;
        continue;
      }

      // Create login account
      await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
          role: "student",
        },
      });

      // Create student record
      await prisma.student.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          department: department.trim(),
          semester: Number(semester),
        },
      });

      successCount += 1;
    }

    return NextResponse.json({
      success: true,
      message: `Bulk registration completed. Successfully registered: ${successCount}, Skipped/Duplicates: ${skippedCount}.`,
      summary: {
        successCount,
        skippedCount,
      },
    });
  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process bulk upload." },
      { status: 500 }
    );
  }
}
