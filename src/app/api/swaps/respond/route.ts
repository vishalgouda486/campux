import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { swapRequestId, action } = body;

    if (!swapRequestId || !action) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId },
    });

    if (!swapRequest) {
      return NextResponse.json({ success: false, message: "Swap request not found" }, { status: 404 });
    }

    if (swapRequest.status !== "PENDING") {
      return NextResponse.json({ success: false, message: "Swap request is already resolved" }, { status: 400 });
    }

    if (action === "REJECT") {
      await prisma.swapRequest.update({
        where: { id: swapRequestId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Swap request rejected successfully" });
    }

    if (action === "APPROVE") {
      const slotA = await prisma.timetable.findUnique({
        where: { id: swapRequest.requesterSlotId },
      });
      const slotB = await prisma.timetable.findUnique({
        where: { id: swapRequest.targetSlotId },
      });

      if (!slotA || !slotB) {
        return NextResponse.json({ success: false, message: "One or both timetable slots not found" }, { status: 404 });
      }

      await prisma.$transaction([
        prisma.timetable.update({
          where: { id: slotA.id },
          data: {
            day: slotB.day,
            period: slotB.period,
            startTime: slotB.startTime,
            endTime: slotB.endTime,
            classroom: slotB.classroom,
            roomType: slotB.roomType,
            semester: slotB.semester,
            department: slotB.department,
          },
        }),
        prisma.timetable.update({
          where: { id: slotB.id },
          data: {
            day: slotA.day,
            period: slotA.period,
            startTime: slotA.startTime,
            endTime: slotA.endTime,
            classroom: slotA.classroom,
            roomType: slotA.roomType,
            semester: slotA.semester,
            department: slotA.department,
          },
        }),
        prisma.swapRequest.update({
          where: { id: swapRequestId },
          data: { status: "APPROVED" },
        }),
      ]);

      return NextResponse.json({ success: true, message: "Swap request approved and timetable updated successfully" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
