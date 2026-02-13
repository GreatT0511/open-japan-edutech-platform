import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const guidelines = await prisma.curriculumGuideline.findMany({
      include: {
        _count: {
          select: { subjects: true },
        },
      },
      orderBy: { effectiveYear: "desc" },
    });

    const data = guidelines.map((g) => ({
      id: g.id,
      version: g.version,
      schoolLevel: g.schoolLevel,
      effectiveYear: g.effectiveYear,
      subjectCount: g._count.subjects,
    }));

    return jsonResponse({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
