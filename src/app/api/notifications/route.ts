import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");

    const notifications = await prisma.notification.findMany({
      where: audience
        ? {
            OR: [
              {
                audience,
              },
              {
                audience: "ALL",
              },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        notifications: [],
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const message = String(body.message || "").trim();
    const category = String(body.category || "ANNOUNCEMENT");
    const audience = String(body.audience || "ALL");

    if (!title || !message) {
      return Response.json(
        {
          success: false,
          message: "Title and message are required.",
        },
        {
          status: 400,
        }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        category,
        audience,
        createdBy: body.createdBy ? String(body.createdBy) : null,
      },
    });

    return Response.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Unable to create notification.",
      },
      {
        status: 500,
      }
    );
  }
}
