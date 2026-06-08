import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalSubjects,
      attendanceRecords,
      marks,
      facultyLoads,
      semesterGroups,
      subjectGroups,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.faculty.count({
        where: {
          isTeaching: true,
        },
      }),
      prisma.subject.count(),
      prisma.attendanceRecord.findMany(),
      prisma.mark.findMany(),
      prisma.facultyLoad.findMany({
        include: {
          faculty: true,
        },
        orderBy: {
          totalClasses: "desc",
        },
      }),
      prisma.student.groupBy({
        by: ["semester"],
        _count: {
          id: true,
        },
        orderBy: {
          semester: "asc",
        },
      }),
      prisma.subject.groupBy({
        by: ["semester"],
        _count: {
          id: true,
        },
        orderBy: {
          semester: "asc",
        },
      }),
    ]);

    const present = attendanceRecords.filter(
      (record) => record.status === "PRESENT"
    ).length;
    const attendancePercentage =
      attendanceRecords.length === 0
        ? 0
        : Math.round((present / attendanceRecords.length) * 10000) / 100;
    const passCount = marks.filter(
      (mark) => mark.internal1 + mark.internal2 + mark.internal3 + mark.assignment >= 40
    ).length;
    const passPercentage =
      marks.length === 0 ? 0 : Math.round((passCount / marks.length) * 10000) / 100;

    const workload = facultyLoads.slice(0, 8).map((load) => ({
      faculty: load.faculty.name,
      day: load.day,
      totalClasses: load.totalClasses,
    }));

    return Response.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalSubjects,
        attendancePercentage,
        passPercentage,
      },
      semesterDistribution: semesterGroups.map((group) => ({
        semester: group.semester,
        count: group._count.id,
      })),
      subjectDistribution: subjectGroups.map((group) => ({
        semester: group.semester,
        count: group._count.id,
      })),
      workload,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
