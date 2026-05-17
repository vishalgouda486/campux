import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {

  // Create Faculty
const faculty = await prisma.faculty.upsert({
  where: {
    email: "faculty@campux.com",
  },

  update: {},

  create: {
    name: "Prof. Ramesh",
    email: "faculty@campux.com",
    department: "CSE",
  },
});

  // Create Subject
  const subject = await prisma.subject.create({
    data: {
      name: "Operating Systems",
      facultyId: faculty.id,
    },
  });

  // Create Student
const student = await prisma.student.upsert({
  where: {
    email: "student@campux.com",
  },

  update: {},

  create: {
    name: "Vishal Patil",
    email: "student@campux.com",
    department: "CSE",
    semester: 6,
  },
});

  // Attendance
  await prisma.attendance.create({
    data: {
      studentId: student.id,
      subjectId: subject.id,
      percentage: 92,
    },
  });

  // Marks
  await prisma.mark.create({
    data: {
      studentId: student.id,
      subjectId: subject.id,
      internal: 86,
      assignment: 91,
    },
  });

    // Timetable Entry
  await prisma.timetable.create({
    data: {
      day: "Monday",

      startTime: "9:00 AM",
      endTime: "10:00 AM",

      classroom: "Room 204",

      semester: 6,
      department: "CSE",

      subjectId: subject.id,
      facultyId: faculty.id,
    },
  });

  console.log("Database Seeded Successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });