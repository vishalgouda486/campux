import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {

  console.log("Cleaning old data...");

  await prisma.timetable.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.classroom.deleteMany();

  console.log("Creating classrooms...");

  for (let i = 1; i <= 12; i++) {

    await prisma.classroom.create({
      data: {
        roomNumber: `Room ${i}`,
        isLab: false,
      },
    });
  }

  for (let i = 1; i <= 4; i++) {

    await prisma.classroom.create({
      data: {
        roomNumber: `Lab ${i}`,
        isLab: true,
      },
    });
  }

  console.log("Creating faculty...");

  const facultyNames = [

    "Rohit Deshpande",
    "Swarali Joshi",
    "Pallavi Mudhol",
    "Nikita Dalawayi",
    "Vikram Marali",
    "Shreyas Marolkar",
    "Nisha Amble",
    "Ritesh Undale",
    "Panchami Ankolekar",
    "Pratibha Gudadari",
    "Nivedita Gaonkar",
    "Bhagyashree Gundakalle",
    "Laxmi Hiremath",
    "Anupama Kawale",
    "Pranati Karoli",
    "Mahesh Kulkarni",
    "Jyoti Salgudi",
    "Pramod Ambannavar",
    "Megha Sooranagi",
    "Rajeshwari Toragallamath",
    "Priyanka Patil",

  ];

  for (const name of facultyNames) {

    await prisma.faculty.create({

      data: {

        name,

        email:
          name
            .toLowerCase()
            .replace(/\s/g, "") + "@campux.com",

        department: "BCA",

        designation: "Faculty",

        specialization: "BCA",

        isTeaching: true,
      },
    });
  }

  await prisma.faculty.create({

    data: {

      name: "Arvindsanjay Hanji",

      email: "arvind@campux.com",

      department: "BCA",

      designation: "Librarian",

      specialization: "Library",

      isTeaching: false,
    },
  });

  await prisma.faculty.create({

    data: {

      name: "Shripad Devadhar",

      email: "shripad@campux.com",

      department: "BCA",

      designation: "Lab Instructor",

      specialization: "Lab",

      isTeaching: false,
    },
  });

  await prisma.faculty.create({

    data: {

      name: "Ritika Umeshkumar",

      email: "ritika@campux.com",

      department: "BCA",

      designation: "Lab Instructor",

      specialization: "Lab",

      isTeaching: false,
    },
  });

  const firstFaculty = await prisma.faculty.findFirst({
    where: {
      isTeaching: true,
    },
  });

  if (!firstFaculty) return;

  console.log("Creating subjects...");

  const subjects = [

    // SEM 1
    ["C Programming",1,"THEORY",4],
    ["Web Technology",1,"THEORY",4],
    ["Mathematics",1,"THEORY",4],
    ["English",1,"THEORY",3],
    ["Constitutional Values",1,"THEORY",2],
    ["C Programming Lab",1,"LAB",2],
    ["Web Technology Lab",1,"LAB",2],

    // SEM 2
    ["Data Structures",2,"THEORY",4],
    ["DBMS",2,"THEORY",4],
    ["Operating Systems",2,"THEORY",4],
    ["English",2,"THEORY",3],
    ["Advanced Excel & AI Tools",2,"THEORY",2],
    ["Data Structures Lab",2,"LAB",2],
    ["DBMS Lab",2,"LAB",2],

    // SEM 3
    ["Java Programming",3,"THEORY",4],
    ["Python Programming",3,"THEORY",4],
    ["DAA",3,"THEORY",4],
    ["English",3,"THEORY",3],
    ["EVS",3,"THEORY",2],
    ["Java Lab",3,"LAB",2],
    ["Python Lab",3,"LAB",2],

    // SEM 4
    ["Advanced Java",4,"THEORY",4],
    ["Software Engineering",4,"THEORY",4],
    ["Computer Networks",4,"THEORY",4],
    ["English",4,"THEORY",3],
    ["Power BI",4,"THEORY",2],
    ["Advanced Java Lab",4,"LAB",2],
    ["Software Engineering Lab",4,"LAB",2],

    // SEM 5
    ["Android Programming",5,"THEORY",4],
    ["Data Science using R",5,"THEORY",4],
    ["AI Part I",5,"THEORY",4],
    ["Cyber Security",5,"THEORY",3],
    ["Digital Marketing",5,"THEORY",2],
    ["Android Lab",5,"LAB",2],
    ["Data Science Lab",5,"LAB",2],

    // SEM 6
    ["AI Part II",6,"THEORY",4],
    ["Big Data",6,"THEORY",4],
    ["Cryptography",6,"THEORY",4],
    ["Blockchain",6,"THEORY",3],
    ["Project Work",6,"THEORY",2],
    ["AI Lab",6,"LAB",2],
    ["Big Data Lab",6,"LAB",2],

  ];

  for (const s of subjects) {

    await prisma.subject.create({

      data: {

        name: s[0] as string,

        semester: s[1] as number,

        type: s[2] as string,

        weeklyHours: s[3] as number,

        facultyId: firstFaculty.id,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });