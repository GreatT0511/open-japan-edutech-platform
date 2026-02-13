import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const universityId = searchParams.get("universityId") ?? undefined;
    const field = searchParams.get("field") ?? undefined;

    const where = {
      ...(universityId ? { universityId } : {}),
      ...(field ? { field } : {}),
    };

    const data = await prisma.department.findMany({
      where,
      include: {
        university: {
          select: { id: true, name: true, type: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
