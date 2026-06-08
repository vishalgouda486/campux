import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log("Cleaning old data...");

  await prisma.timetable.deleteMany();
  await prisma.facultyLoad.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.classroom.deleteMany();
  
  // Clean up faculty and student user credentials, leaving admin intact
  await prisma.user.deleteMany({
    where: {
      role: {
        in: ["faculty", "student"],
      },
    },
  });

  const defaultPassword = "Password@123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  console.log("Creating classrooms...");
  // Classrooms 1 to 12
  for (let i = 1; i <= 12; i++) {
    await prisma.classroom.create({
      data: {
        roomNumber: `Room ${i}`,
        isLab: false,
      },
    });
  }
  // Labs 1 to 4
  for (let i = 1; i <= 4; i++) {
    await prisma.classroom.create({
      data: {
        roomNumber: `Lab ${i}`,
        isLab: true,
      },
    });
  }

  console.log("Creating faculty members and user logins...");
  const facultiesData = [
    {
      name: "Rohit Deshpande",
      email: "rohitdeshpande@campux.com",
      designation: "Coordinator",
      specialization: "Computer applications, Data Science and Artificial Intelligence",
      isTeaching: true
    },
    {
      name: "Swarali Shridhar Joshi",
      email: "swaralijoshi@campux.com",
      designation: "Professor",
      specialization: "Data Science",
      isTeaching: true
    },
    {
      name: "Laxmi Hiremath",
      email: "laxmihiremath@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Pallavi Mudhol",
      email: "pallavimudhol@campux.com",
      designation: "Professor",
      specialization: "Software Engineering and Testing, Artificial Intelligence & Machine Learning",
      isTeaching: true
    },
    {
      name: "Nikita Dalawayi",
      email: "nikitadalawayi@campux.com",
      designation: "Professor",
      specialization: "Computer Applications, Android, Data Science",
      isTeaching: true
    },
    {
      name: "Anupama Kawale",
      email: "anupamakawale@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Vikram Marali",
      email: "vikrammarali@campux.com",
      designation: "Professor",
      specialization: "Data analysis, Agile methodology and Project management",
      isTeaching: true
    },
    {
      name: "Shreyas Mardolkar",
      email: "shreyasmardolkar@campux.com",
      designation: "Professor",
      specialization: "Cloud Computing",
      isTeaching: true
    },
    {
      name: "Pranati Karoli",
      email: "pranatikaroli@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Nisha Amble",
      email: "nishaamble@campux.com",
      designation: "Professor",
      specialization: "Mathematics",
      isTeaching: true
    },
    {
      name: "Ritesh Undale",
      email: "riteshundale@campux.com",
      designation: "Professor",
      specialization: "VLSI designs and Embedded systems",
      isTeaching: true
    },
    {
      name: "Mahesh Kulkarni",
      email: "maheshkulkarni@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Ms. Panchami Ankolekar",
      email: "panchamiankolekar@campux.com",
      designation: "Professor",
      specialization: "Communication, Soft skills and Personality development",
      isTeaching: true
    },
    {
      name: "Pratibha Gudadari",
      email: "pratibhagudadari@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Priyanka Patil",
      email: "priyankapatil@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Nivedita Gaonkar",
      email: "niveditagaonkar@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Bhagyashree Gundakalle",
      email: "bhagyashreegundakalle@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Jyoti Salgudi",
      email: "jyotisalgudi@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Pramod Ambannavar",
      email: "pramodambannavar@campux.com",
      designation: "Professor",
      specialization: "Java, Full stack development",
      isTeaching: true
    },
    {
      name: "Megha Sooranagi",
      email: "meghasooranagi@campux.com",
      designation: "Professor",
      specialization: "Mathematics",
      isTeaching: true
    },
    {
      name: "Rajeshwari Toragallamath",
      email: "rajeshwaritoragallamath@campux.com",
      designation: "Professor",
      specialization: "Computer Applications",
      isTeaching: true
    },
    {
      name: "Arvindsanjay Hanji",
      email: "arvind@campux.com",
      designation: "Librarian",
      specialization: "Library",
      isTeaching: false
    },
    {
      name: "Shripad Devadhar",
      email: "shripad@campux.com",
      designation: "Lab Instructor",
      specialization: "Hardware and Networking, Advanced Excel and AI tools",
      isTeaching: true
    },
    {
      name: "Ritika Umeshkumar",
      email: "ritika@campux.com",
      designation: "Lab Instructor",
      specialization: "Hardware and Networking",
      isTeaching: false
    }
  ];

  // Map to store created faculty IDs for subject linkage
  const facultyEmailToId = new Map<string, string>();

  for (const f of facultiesData) {
    // Create Faculty profile
    const createdFaculty = await prisma.faculty.create({
      data: {
        name: f.name,
        email: f.email,
        department: "BCA",
        designation: f.designation,
        specialization: f.specialization,
        isTeaching: f.isTeaching,
      },
    });

    facultyEmailToId.set(f.email, createdFaculty.id);

    // Create User login account
    await prisma.user.create({
      data: {
        name: f.name,
        email: f.email,
        password: hashedPassword,
        role: "faculty",
      },
    });
  }

  console.log("Creating subjects mapped to specific faculty members...");
  const subjectsData = [
    // SEM 1
    { name: "Kannada", code: "25CA102", semester: 1, type: "THEORY", weeklyHours: 3, facultyEmail: "rajeshwaritoragallamath@campux.com" },
    { name: "Hindi", code: "25CA103", semester: 1, type: "THEORY", weeklyHours: 3, facultyEmail: "jyotisalgudi@campux.com" },
    { name: "English", code: "25CA101", semester: 1, type: "THEORY", weeklyHours: 3, facultyEmail: "panchamiankolekar@campux.com" },
    { name: "C Programming", code: "25CA104", semester: 1, type: "THEORY", weeklyHours: 4, facultyEmail: "pratibhagudadari@campux.com" },
    { name: "C Programming Lab", code: "25CA105", semester: 1, type: "LAB", weeklyHours: 4, facultyEmail: "pratibhagudadari@campux.com" },
    { name: "Web Technology", code: "25CA106", semester: 1, type: "THEORY", weeklyHours: 4, facultyEmail: "maheshkulkarni@campux.com" },
    { name: "Web Technology Lab", code: "25CA107", semester: 1, type: "LAB", weeklyHours: 4, facultyEmail: "maheshkulkarni@campux.com" },
    { name: "Mathematics", code: "25CA108", semester: 1, type: "THEORY", weeklyHours: 4, facultyEmail: "nishaamble@campux.com" },
    { name: "Constitutional Values- I", code: "25CA109", semester: 1, type: "THEORY", weeklyHours: 2, facultyEmail: "anupamakawale@campux.com" },

    // SEM 2
    { name: "Kannada", code: "25CA202", semester: 2, type: "THEORY", weeklyHours: 3, facultyEmail: "rajeshwaritoragallamath@campux.com" },
    { name: "Hindi", code: "25CA203", semester: 2, type: "THEORY", weeklyHours: 3, facultyEmail: "jyotisalgudi@campux.com" },
    { name: "English", code: "25CA201", semester: 2, type: "THEORY", weeklyHours: 3, facultyEmail: "panchamiankolekar@campux.com" },
    { name: "Data Structures using C", code: "25CA204", semester: 2, type: "THEORY", weeklyHours: 4, facultyEmail: "priyankapatil@campux.com" },
    { name: "Data Structures using C Lab", code: "25CA205", semester: 2, type: "LAB", weeklyHours: 4, facultyEmail: "priyankapatil@campux.com" },
    { name: "Database Management Systems", code: "25CA206", semester: 2, type: "THEORY", weeklyHours: 4, facultyEmail: "niveditagaonkar@campux.com" },
    { name: "Database Management Systems Lab", code: "25CA207", semester: 2, type: "LAB", weeklyHours: 4, facultyEmail: "niveditagaonkar@campux.com" },
    { name: "Operating System", code: "25CA208", semester: 2, type: "THEORY", weeklyHours: 4, facultyEmail: "laxmihiremath@campux.com" },
    { name: "Advanced Excel and AI Tools", code: "25CA209", semester: 2, type: "LAB", weeklyHours: 2, facultyEmail: "shripad@campux.com" },

    // SEM 3
    { name: "Kannada", code: "25CA302", semester: 3, type: "THEORY", weeklyHours: 3, facultyEmail: "laxmihiremath@campux.com" },
    { name: "Hindi", code: "25CA303", semester: 3, type: "THEORY", weeklyHours: 3, facultyEmail: "pranatikaroli@campux.com" },
    { name: "English", code: "25CA301", semester: 3, type: "THEORY", weeklyHours: 3, facultyEmail: "anupamakawale@campux.com" },
    { name: "Java Programming", code: "25CA304", semester: 3, type: "THEORY", weeklyHours: 4, facultyEmail: "pramodambannavar@campux.com" },
    { name: "Java Programming Lab", code: "25CA305", semester: 3, type: "LAB", weeklyHours: 4, facultyEmail: "pramodambannavar@campux.com" },
    { name: "Python Programming", code: "25CA306", semester: 3, type: "THEORY", weeklyHours: 4, facultyEmail: "bhagyashreegundakalle@campux.com" },
    { name: "Python Programming Lab", code: "25CA307", semester: 3, type: "LAB", weeklyHours: 4, facultyEmail: "bhagyashreegundakalle@campux.com" },
    { name: "DAA", code: "25CA308", semester: 3, type: "THEORY", weeklyHours: 4, facultyEmail: "jyotisalgudi@campux.com" },
    { name: "EVS", code: "25CA309", semester: 3, type: "THEORY", weeklyHours: 2, facultyEmail: "anupamakawale@campux.com" },

    // SEM 4
    { name: "Kannada", code: "25CA402", semester: 4, type: "THEORY", weeklyHours: 3, facultyEmail: "laxmihiremath@campux.com" },
    { name: "Hindi", code: "25CA403", semester: 4, type: "THEORY", weeklyHours: 3, facultyEmail: "pranatikaroli@campux.com" },
    { name: "English", code: "25CA401", semester: 4, type: "THEORY", weeklyHours: 3, facultyEmail: "anupamakawale@campux.com" },
    { name: "Advanced Java", code: "25CA404", semester: 4, type: "THEORY", weeklyHours: 4, facultyEmail: "pramodambannavar@campux.com" },
    { name: "Advanced Java Lab", code: "25CA405", semester: 4, type: "LAB", weeklyHours: 4, facultyEmail: "pramodambannavar@campux.com" },
    { name: "Software Engineering and Testing", code: "25CA406", semester: 4, type: "THEORY", weeklyHours: 4, facultyEmail: "pallavimudhol@campux.com" },
    { name: "Software Engineering and Testing Lab", code: "25CA407", semester: 4, type: "LAB", weeklyHours: 4, facultyEmail: "pallavimudhol@campux.com" },
    { name: "Computer Networks", code: "25CA408", semester: 4, type: "THEORY", weeklyHours: 4, facultyEmail: "riteshundale@campux.com" },
    { name: "Power BI", code: "25CA409", semester: 4, type: "LAB", weeklyHours: 2, facultyEmail: "vikrammarali@campux.com" },

    // SEM 5
    { name: "Android Programming", code: "24CA501", semester: 5, type: "THEORY", weeklyHours: 4, facultyEmail: "nikitadalawayi@campux.com" },
    { name: "Android Programming Lab", code: "24CA502", semester: 5, type: "LAB", weeklyHours: 4, facultyEmail: "nikitadalawayi@campux.com" },
    { name: "Data Science using R", code: "24CA503", semester: 5, type: "THEORY", weeklyHours: 4, facultyEmail: "swaralijoshi@campux.com" },
    { name: "Data Science using R Lab", code: "24CA504", semester: 5, type: "LAB", weeklyHours: 4, facultyEmail: "swaralijoshi@campux.com" },
    { name: "AI Part I", code: "24CA505", semester: 5, type: "THEORY", weeklyHours: 4, facultyEmail: "rohitdeshpande@campux.com" },
    { name: "Cyber Security", code: "24CA506", semester: 5, type: "THEORY", weeklyHours: 4, facultyEmail: "shreyasmardolkar@campux.com" },
    { name: "Digital Marketing", code: "24CA507", semester: 5, type: "THEORY", weeklyHours: 4, facultyEmail: "pratibhagudadari@campux.com" },
    { name: "Internship", code: "24CA508", semester: 5, type: "LAB", weeklyHours: 2, facultyEmail: "vikrammarali@campux.com" },

    // SEM 6
    { name: "AI Part II", code: "24CA601", semester: 6, type: "THEORY", weeklyHours: 4, facultyEmail: "rohitdeshpande@campux.com" },
    { name: "AI Lab", code: "24CA602", semester: 6, type: "LAB", weeklyHours: 4, facultyEmail: "rohitdeshpande@campux.com" },
    { name: "Big Data", code: "24CA603", semester: 6, type: "THEORY", weeklyHours: 4, facultyEmail: "swaralijoshi@campux.com" },
    { name: "Big Data Lab", code: "24CA604", semester: 6, type: "LAB", weeklyHours: 4, facultyEmail: "swaralijoshi@campux.com" },
    { name: "Cryptography", code: "24CA605", semester: 6, type: "THEORY", weeklyHours: 4, facultyEmail: "shreyasmardolkar@campux.com" },
    { name: "Blockchain", code: "24CA606", semester: 6, type: "THEORY", weeklyHours: 4, facultyEmail: "pranatikaroli@campux.com" },
    { name: "Project Work", code: "24CA606", semester: 6, type: "LAB", weeklyHours: 4, facultyEmail: "vikrammarali@campux.com" }
  ];

  for (const s of subjectsData) {
    const fid = facultyEmailToId.get(s.facultyEmail);
    if (!fid) {
      console.warn(`Warning: Faculty ID not found for email ${s.facultyEmail}`);
    }

    await prisma.subject.create({
      data: {
        name: s.name,
        code: s.code,
        semester: s.semester,
        type: s.type,
        weeklyHours: s.weeklyHours,
        facultyId: fid || null,
      },
    });
  }

  console.log("Creating students and user logins...");
  for (let sem = 1; sem <= 6; sem++) {
    for (let i = 1; i <= 20; i++) {
      const email = `bca${sem}student${i}@campux.com`;
      const name = `BCA${sem} Student ${i}`;
      
      await prisma.student.create({
        data: {
          name,
          email,
          department: "BCA",
          semester: sem,
        },
      });

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "student",
        },
      });
    }
  }

  // Explicitly add active testing students
  const activeStudents = [
    { name: "Prathamesh", email: "prathamesh@campux.com", sem: 1 },
    { name: "Vishalgouda", email: "vishalgouda486@gmail.com", sem: 6 },
    { name: "Prathmesh", email: "prathmeshsomanath20@gmail.com", sem: 1 },
    { name: "bhushan", email: "bhusuan@gmail.com", sem: 1 },
    { name: "bhushan", email: "bhushan@gmail.com", sem: 1 }
  ];

  for (const s of activeStudents) {
    const exists = await prisma.student.findUnique({ where: { email: s.email } });
    if (!exists) {
      await prisma.student.create({
        data: {
          name: s.name,
          email: s.email,
          department: "BCA",
          semester: s.sem,
        },
      });
    }

    const userExists = await prisma.user.findUnique({ where: { email: s.email } });
    if (!userExists) {
      await prisma.user.create({
        data: {
          name: s.name,
          email: s.email,
          password: hashedPassword,
          role: "student",
        },
      });
    }
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });