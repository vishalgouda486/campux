import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email parameter required" }, { status: 400 });
    }

    const sent = await prisma.swapRequest.findMany({
      where: { requesterEmail: email },
      orderBy: { createdAt: "desc" },
    });

    const received = await prisma.swapRequest.findMany({
      where: { targetFacultyEmail: email },
      orderBy: { createdAt: "desc" },
    });

    const allSlotIds = new Set<string>();
    [...sent, ...received].forEach(s => {
      allSlotIds.add(s.requesterSlotId);
      allSlotIds.add(s.targetSlotId);
    });

    const slots = await prisma.timetable.findMany({
      where: { id: { in: Array.from(allSlotIds) } },
      include: {
        subject: true,
        faculty: true,
      },
    });

    const slotMap = new Map(slots.map(s => [s.id, s]));

    const formatSwap = (s: any) => {
      const reqSlot = slotMap.get(s.requesterSlotId);
      const tarSlot = slotMap.get(s.targetSlotId);
      return {
        id: s.id,
        status: s.status,
        createdAt: s.createdAt,
        requesterEmail: s.requesterEmail,
        targetFacultyEmail: s.targetFacultyEmail,
        requesterSlot: reqSlot ? {
          id: reqSlot.id,
          day: reqSlot.day,
          period: reqSlot.period,
          startTime: reqSlot.startTime,
          endTime: reqSlot.endTime,
          subjectName: reqSlot.subject.name,
          semester: reqSlot.semester,
          classroom: reqSlot.classroom,
          facultyName: reqSlot.faculty.name,
        } : null,
        targetSlot: tarSlot ? {
          id: tarSlot.id,
          day: tarSlot.day,
          period: tarSlot.period,
          startTime: tarSlot.startTime,
          endTime: tarSlot.endTime,
          subjectName: tarSlot.subject.name,
          semester: tarSlot.semester,
          classroom: tarSlot.classroom,
          facultyName: tarSlot.faculty.name,
        } : null,
      };
    };

    return NextResponse.json({
      success: true,
      sent: sent.map(formatSwap),
      received: received.map(formatSwap),
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterEmail, requesterSlotId, targetFacultyEmail, targetSlotId } = body;

    if (!requesterEmail || !requesterSlotId || !targetFacultyEmail || !targetSlotId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.swapRequest.create({
      data: {
        requesterEmail,
        requesterSlotId,
        targetFacultyEmail,
        targetSlotId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, swap: created });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
