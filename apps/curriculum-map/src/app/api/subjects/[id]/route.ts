import { errorResponse, notFoundResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        guideline: {
          select: {
            id: true,
            version: true,
            schoolLevel: true,
            effectiveYear: true,
          },
        },
        contents: {
          orderBy: [{ grade: "asc" }, { area: "asc" }],
        },
      },
    });

    if (!subject) {
      return notFoundResponse("教科");
    }

    return jsonResponse({ data: subject });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
