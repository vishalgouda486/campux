import { prisma } from "./prisma";

export async function getRole(email: string) {

  const userRole = await prisma.userRole.findUnique({
    where: {
      email,
    },
  });

  if (!userRole) {
    return "student";
  }

  return userRole.role;
}