import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const guidelineId = searchParams.get("guidelineId");
    const schoolLevel = searchParams.get("schoolLevel");

    const where: Record<string, unknown> = {};

    if (guidelineId) {
      where.guidelineId = guidelineId;
    }

    if (schoolLevel) {
      where.guideline = { schoolLevel };
    }

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        guideline: {
          select: {
            id: true,
            version: true,
            schoolLevel: true,
            effectiveYear: true,
          },
        },
        _count: {
          select: { contents: true },
        },
      },
      orderBy: [{ guideline: { effectiveYear: "desc" } }, { name: "asc" }],
    });

    const data = subjects.map((s) => ({
      id: s.id,
      guidelineId: s.guidelineId,
      name: s.name,
      gradeStart: s.gradeStart,
      gradeEnd: s.gradeEnd,
      objectives: s.objectives,
      contentCount: s._count.contents,
      guideline: s.guideline,
    }));

    return jsonResponse({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
