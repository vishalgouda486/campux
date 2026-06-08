import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Password@123", 10);

  // Faculty Upsert
  const faculty = await prisma.user.upsert({
    where: { email: "rohitdeshpande@campux.com" },
    update: { password: hashedPassword, role: "faculty" },
    create: {
      name: "Rohit Deshpande",
      email: "rohitdeshpande@campux.com",
      password: hashedPassword,
      role: "faculty",
    },
  });

  // Admin Upsert
  const admin = await prisma.user.upsert({
    where: { email: "admin@campux.com" },
    update: { password: hashedPassword, role: "admin" },
    create: {
      name: "System Admin",
      email: "admin@campux.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Created Faculty:", faculty.email);
  console.log("Created Admin:", admin.email);
}

main().finally(() => prisma.$disconnect());
