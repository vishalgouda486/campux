import { prisma } from "@/lib/prisma";

export async function POST() {

  try {

    await prisma.timetable.deleteMany();

    await prisma.facultyLoad.deleteMany();

    const subjects = await prisma.subject.findMany({
      include: {
        faculty: true,
      },
    });

    const DAYS = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const PERIODS = [
      { period: 1, start: "9:30 AM", end: "10:30 AM" },
      { period: 2, start: "11:00 AM", end: "12:00 PM" },
      { period: 3, start: "12:00 PM", end: "1:00 PM" },
      { period: 4, start: "2:00 PM", end: "3:00 PM" },
      { period: 5, start: "3:00 PM", end: "4:00 PM" },
      { period: 6, start: "4:00 PM", end: "5:00 PM" },
    ];

    const facultyLoads = new Map<string, number>();

    for (let semester = 1; semester <= 6; semester++) {

      const room = `Room ${semester}`;

      const semSubjects = subjects.filter(
        (s) => s.semester === semester
      );

      let dayIndex = 0;
      let periodIndex = 0;

      for (const subject of semSubjects) {

        const facultyId = subject.facultyId!;

        // LAB SUBJECTS
        if (subject.type === "LAB") {

          const day = DAYS[dayIndex];

          const loadKey =
            `${facultyId}-${day}`;

          const currentLoad =
            facultyLoads.get(loadKey) || 0;

          if (currentLoad < 4) {

            if (
              periodIndex >= PERIODS.length - 1
            ) {

              periodIndex = 0;

              dayIndex++;

              if (dayIndex >= DAYS.length) {
                dayIndex = 0;
              }
            }

            const slot1 =
              PERIODS[periodIndex];

            const slot2 =
              PERIODS[periodIndex + 1];

            await prisma.timetable.create({

              data: {

                day,

                period: slot1.period,

                startTime: slot1.start,

                endTime: slot1.end,

                classroom: `Lab ${
                  (semester % 4) + 1
                }`,

                roomType: "LAB",

                semester,

                department: "BCA",

                subjectId: subject.id,

                facultyId,
              },
            });

            await prisma.timetable.create({

              data: {

                day,

                period: slot2.period,

                startTime: slot2.start,

                endTime: slot2.end,

                classroom: `Lab ${
                  (semester % 4) + 1
                }`,

                roomType: "LAB",

                semester,

                department: "BCA",

                subjectId: subject.id,

                facultyId,
              },
            });

            facultyLoads.set(
              loadKey,
              currentLoad + 2
            );

            periodIndex += 2;
          }

          continue;
        }

        // THEORY SUBJECTS
        for (
          let h = 0;
          h < subject.weeklyHours;
          h++
        ) {

          const day =
            DAYS[dayIndex];

          const loadKey =
            `${facultyId}-${day}`;

          const currentLoad =
            facultyLoads.get(loadKey) || 0;

          if (currentLoad >= 4) {

            dayIndex++;

            if (dayIndex >= DAYS.length) {
              dayIndex = 0;
            }

            continue;
          }

          const slot =
            PERIODS[periodIndex];

          await prisma.timetable.create({

            data: {

              day,

              period: slot.period,

              startTime: slot.start,

              endTime: slot.end,

              classroom: room,

              roomType: "CLASSROOM",

              semester,

              department: "BCA",

              subjectId: subject.id,

              facultyId,
            },
          });

          facultyLoads.set(
            loadKey,
            currentLoad + 1
          );

          periodIndex++;

          if (
            periodIndex >= PERIODS.length
          ) {

            periodIndex = 0;

            dayIndex++;

            if (
              dayIndex >= DAYS.length
            ) {

              dayIndex = 0;
            }
          }
        }
      }
    }

    for (const [key, total] of facultyLoads) {

      const [facultyId, day] =
        key.split("-");

      await prisma.facultyLoad.create({

        data: {

          facultyId,

          day,

          totalClasses: total,
        },
      });
    }

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
    });
  }
}