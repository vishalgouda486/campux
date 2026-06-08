type FacultyInput = {
  id: string;
  name: string;
};

type SubjectInput = {
  id: string;
  name: string;
  semester: number;
  type: string;
  weeklyHours: number;
  facultyId: string | null;
};

type RoomInput = {
  roomNumber: string;
  isLab: boolean;
};

export type TimetableSlot = {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  classroom: string;
  roomType: "CLASSROOM" | "LAB";
  semester: number;
  department: string;
  subjectId: string;
  facultyId: string;
};

export type TimetableValidation = {
  scheduledSlots: number;
  facultyClashes: string[];
  roomClashes: string[];
  semesterClashes: string[];
  overloads: string[];
  unscheduled: string[];
};

// Monday to Saturday classes
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [
  { period: 1, startTime: "9:30 AM", endTime: "10:30 AM" },
  { period: 2, startTime: "11:00 AM", endTime: "12:00 PM" },
  { period: 3, startTime: "12:00 PM", endTime: "1:00 PM" },
  { period: 4, startTime: "2:00 PM", endTime: "3:00 PM" },
  { period: 5, startTime: "3:00 PM", endTime: "4:00 PM" },
  { period: 6, startTime: "4:00 PM", endTime: "5:00 PM" },
];

const LAB_START_PERIODS = [2, 4, 5];
const MAX_FACULTY_CLASSES_PER_DAY = 4;

function key(...parts: Array<string | number>) {
  return parts.join("::");
}

function createValidation(slots: TimetableSlot[], unscheduled: string[]) {
  const facultyPeriod = new Map<string, string>();
  const roomPeriod = new Map<string, string>();
  const semesterPeriod = new Map<string, string>();
  const facultyDayLoad = new Map<string, number>();
  const validation: TimetableValidation = {
    scheduledSlots: slots.length,
    facultyClashes: [],
    roomClashes: [],
    semesterClashes: [],
    overloads: [],
    unscheduled,
  };

  for (const slot of slots) {
    const facultySlotKey = key(slot.facultyId, slot.day, slot.period);
    const roomSlotKey = key(slot.classroom, slot.day, slot.period);
    const semesterSlotKey = key(slot.semester, slot.day, slot.period);
    const loadKey = key(slot.facultyId, slot.day);

    if (facultyPeriod.has(facultySlotKey)) {
      validation.facultyClashes.push(
        `${slot.day} period ${slot.period}: faculty clash for ${slot.facultyId}`
      );
    }

    if (roomPeriod.has(roomSlotKey)) {
      validation.roomClashes.push(
        `${slot.day} period ${slot.period}: room clash for ${slot.classroom}`
      );
    }

    if (semesterPeriod.has(semesterSlotKey)) {
      validation.semesterClashes.push(
        `${slot.day} period ${slot.period}: semester ${slot.semester} has multiple classes`
      );
    }

    facultyPeriod.set(facultySlotKey, slot.subjectId);
    roomPeriod.set(roomSlotKey, slot.subjectId);
    semesterPeriod.set(semesterSlotKey, slot.subjectId);
    facultyDayLoad.set(loadKey, (facultyDayLoad.get(loadKey) || 0) + 1);
  }

  for (const [loadKey, total] of facultyDayLoad) {
    if (total > MAX_FACULTY_CLASSES_PER_DAY) {
      validation.overloads.push(`${loadKey}: ${total} classes`);
    }
  }

  return validation;
}

function getLeastLoadedFaculty(
  faculty: FacultyInput[],
  facultyDayLoad: Map<string, number>,
  facultyWeeklyLoad: Map<string, number>,
  day: string,
  period: number,
  busyFaculty: Set<string>,
  preferredFacultyId?: string | null
) {
  const candidates = faculty
    .filter((item) => {
      // STRICT ALLOTMENT: If a specific faculty member is assigned, ONLY consider them.
      if (preferredFacultyId && item.id !== preferredFacultyId) {
        return false;
      }

      const load = facultyDayLoad.get(key(item.id, day)) || 0;
      return (
        !busyFaculty.has(key(item.id, day, period)) &&
        load < MAX_FACULTY_CLASSES_PER_DAY
      );
    })
    .sort((a, b) => {
      const aDaily = facultyDayLoad.get(key(a.id, day)) || 0;
      const bDaily = facultyDayLoad.get(key(b.id, day)) || 0;

      if (aDaily !== bDaily) return aDaily - bDaily;

      const aWeekly = facultyWeeklyLoad.get(a.id) || 0;
      const bWeekly = facultyWeeklyLoad.get(b.id) || 0;

      return aWeekly - bWeekly || a.name.localeCompare(b.name);
    });

  return candidates[0];
}

export function buildTimetable(input: {
  subjects: SubjectInput[];
  faculty: FacultyInput[];
  rooms: RoomInput[];
}) {
  const classroomNames = input.rooms
    .filter((room) => !room.isLab)
    .map((room) => room.roomNumber);
  const labNames = input.rooms
    .filter((room) => room.isLab)
    .map((room) => room.roomNumber);
  const slots: TimetableSlot[] = [];
  const unscheduled: string[] = [];
  const busyFaculty = new Set<string>();
  const busyRooms = new Set<string>();
  const busySemesters = new Set<string>();
  const facultyDayLoad = new Map<string, number>();
  const facultyWeeklyLoad = new Map<string, number>();

  function reserve(slot: TimetableSlot) {
    slots.push(slot);
    busyFaculty.add(key(slot.facultyId, slot.day, slot.period));
    busyRooms.add(key(slot.classroom, slot.day, slot.period));
    busySemesters.add(key(slot.semester, slot.day, slot.period));
    facultyDayLoad.set(
      key(slot.facultyId, slot.day),
      (facultyDayLoad.get(key(slot.facultyId, slot.day)) || 0) + 1
    );
    facultyWeeklyLoad.set(
      slot.facultyId,
      (facultyWeeklyLoad.get(slot.facultyId) || 0) + 1
    );
  }

  function scheduleTheory(subject: SubjectInput) {
    let placed = 0;
    const roomName =
      classroomNames[(subject.semester - 1) % Math.max(classroomNames.length, 1)];

    for (const day of DAYS) {
      for (const period of PERIODS) {
        if (placed >= subject.weeklyHours) return;
        if (busySemesters.has(key(subject.semester, day, period.period))) {
          continue;
        }
        if (busyRooms.has(key(roomName, day, period.period))) {
          continue;
        }

        const faculty = getLeastLoadedFaculty(
          input.faculty,
          facultyDayLoad,
          facultyWeeklyLoad,
          day,
          period.period,
          busyFaculty,
          subject.facultyId
        );

        if (!faculty) continue;

        reserve({
          day,
          period: period.period,
          startTime: period.startTime,
          endTime: period.endTime,
          classroom: roomName,
          roomType: "CLASSROOM",
          semester: subject.semester,
          department: "BCA",
          subjectId: subject.id,
          facultyId: faculty.id,
        });

        placed += 1;
      }
    }

    if (placed < subject.weeklyHours) {
      unscheduled.push(
        `${subject.name} semester ${subject.semester}: ${subject.weeklyHours - placed} hour(s)`
      );
    }
  }

  function scheduleLab(subject: SubjectInput) {
    let placedBlocks = 0;
    const requiredBlocks = Math.ceil(subject.weeklyHours / 2);

    for (const day of DAYS) {
      for (const startPeriod of LAB_START_PERIODS) {
        if (placedBlocks >= requiredBlocks) return;

        const first = PERIODS.find((period) => period.period === startPeriod);
        const second = PERIODS.find((period) => period.period === startPeriod + 1);

        if (!first || !second) continue;
        if (
          busySemesters.has(key(subject.semester, day, first.period)) ||
          busySemesters.has(key(subject.semester, day, second.period))
        ) {
          continue;
        }

        const labName = labNames.find(
          (lab) =>
            !busyRooms.has(key(lab, day, first.period)) &&
            !busyRooms.has(key(lab, day, second.period))
        );

        if (!labName) continue;

        const faculty = getLeastLoadedFaculty(
          input.faculty,
          facultyDayLoad,
          facultyWeeklyLoad,
          day,
          first.period,
          busyFaculty,
          subject.facultyId
        );

        if (
          !faculty ||
          busyFaculty.has(key(faculty.id, day, second.period)) ||
          (facultyDayLoad.get(key(faculty.id, day)) || 0) >
            MAX_FACULTY_CLASSES_PER_DAY - 2
        ) {
          continue;
        }

        reserve({
          day,
          period: first.period,
          startTime: first.startTime,
          endTime: first.endTime,
          classroom: labName,
          roomType: "LAB",
          semester: subject.semester,
          department: "BCA",
          subjectId: subject.id,
          facultyId: faculty.id,
        });
        reserve({
          day,
          period: second.period,
          startTime: second.startTime,
          endTime: second.endTime,
          classroom: labName,
          roomType: "LAB",
          semester: subject.semester,
          department: "BCA",
          subjectId: subject.id,
          facultyId: faculty.id,
        });

        placedBlocks += 1;
      }
    }

    if (placedBlocks < requiredBlocks) {
      unscheduled.push(
        `${subject.name} semester ${subject.semester}: ${
          (requiredBlocks - placedBlocks) * 2
        } lab hour(s)`
      );
    }
  }

  for (let semester = 1; semester <= 6; semester += 1) {
    const semesterSubjects = input.subjects
      .filter((subject) => subject.semester === semester)
      .sort((a, b) => {
        if (a.type === b.type) return b.weeklyHours - a.weeklyHours;
        return a.type === "LAB" ? -1 : 1;
      });

    for (const subject of semesterSubjects) {
      if (subject.type === "LAB") {
        scheduleLab(subject);
      } else {
        scheduleTheory(subject);
      }
    }
  }

  const loads = Array.from(facultyDayLoad.entries()).map(([loadKey, total]) => {
    const [facultyId, day] = loadKey.split("::");

    return {
      facultyId,
      day,
      totalClasses: total,
    };
  });

  return {
    slots,
    loads,
    validation: createValidation(slots, unscheduled),
  };
}
