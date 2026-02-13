import { errorResponse, notFoundResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        prefecture: true,
        departments: {
          orderBy: { name: "asc" },
        },
        metrics: {
          orderBy: { year: "desc" },
        },
      },
    });

    if (!university) {
      return notFoundResponse("大学");
    }

    return jsonResponse({ data: university });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
