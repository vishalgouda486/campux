import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      email,
      password,
    } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {

      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {

      return Response.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },

      "campux-secret"
    );

    return Response.json({
      success: true,
      token,
      role: user.role,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
    });
  }
}