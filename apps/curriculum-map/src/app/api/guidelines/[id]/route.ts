import { errorResponse, notFoundResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const guideline = await prisma.curriculumGuideline.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            _count: { select: { contents: true } },
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!guideline) {
      return notFoundResponse("指導要領");
    }

    const data = {
      id: guideline.id,
      version: guideline.version,
      schoolLevel: guideline.schoolLevel,
      effectiveYear: guideline.effectiveYear,
      subjects: guideline.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        gradeStart: s.gradeStart,
        gradeEnd: s.gradeEnd,
        objectives: s.objectives,
        contentCount: s._count.contents,
      })),
    };

    return jsonResponse({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
