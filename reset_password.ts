import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.updateMany({
    where: { email: "vishalgouda486@gmail.com" },
    data: { password: hashedPassword },
  });
  console.log(`Updated ${user.count} users.`);
}

main().finally(() => prisma.$disconnect());
