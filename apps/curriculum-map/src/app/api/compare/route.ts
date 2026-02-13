import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const guidelineId1 = searchParams.get("guidelineId1");
    const guidelineId2 = searchParams.get("guidelineId2");
    const subjectName = searchParams.get("subjectName");

    if (!guidelineId1 || !guidelineId2) {
      return errorResponse("guidelineId1 と guidelineId2 パラメータが必要です", 400);
    }

    // Build where clauses for both guidelines
    const where1: Record<string, unknown> = { guidelineId: guidelineId1 };
    const where2: Record<string, unknown> = { guidelineId: guidelineId2 };

    if (subjectName) {
      where1.name = subjectName;
      where2.name = subjectName;
    }

    const [guideline1, guideline2, subjects1, subjects2] = await Promise.all([
      prisma.curriculumGuideline.findUnique({
        where: { id: guidelineId1 },
        select: { id: true, version: true, schoolLevel: true, effectiveYear: true },
      }),
      prisma.curriculumGuideline.findUnique({
        where: { id: guidelineId2 },
        select: { id: true, version: true, schoolLevel: true, effectiveYear: true },
      }),
      prisma.subject.findMany({
        where: where1,
        include: {
          contents: {
            orderBy: [{ grade: "asc" }, { area: "asc" }],
          },
        },
      }),
      prisma.subject.findMany({
        where: where2,
        include: {
          contents: {
            orderBy: [{ grade: "asc" }, { area: "asc" }],
          },
        },
      }),
    ]);

    // Find new content (in guideline2 but marked as new)
    const allContents2 = subjects2.flatMap((s) => s.contents);
    const newContent = allContents2.filter((c) => c.isNew);

    // Find removed content (in guideline1 but marked as removed, or in guideline2 marked removed)
    const allContents1 = subjects1.flatMap((s) => s.contents);
    const removedContent = [
      ...allContents1.filter((c) => c.isRemoved),
      ...allContents2.filter((c) => c.isRemoved),
    ];

    // Deduplicate removed content by id
    const seenIds = new Set<string>();
    const uniqueRemoved = removedContent.filter((c) => {
      if (seenIds.has(c.id)) return false;
      seenIds.add(c.id);
      return true;
    });

    return jsonResponse({
      data: {
        guideline1,
        guideline2,
        subjects1: subjects1.map((s) => ({
          id: s.id,
          name: s.name,
          gradeStart: s.gradeStart,
          gradeEnd: s.gradeEnd,
          contentCount: s.contents.length,
        })),
        subjects2: subjects2.map((s) => ({
          id: s.id,
          name: s.name,
          gradeStart: s.gradeStart,
          gradeEnd: s.gradeEnd,
          contentCount: s.contents.length,
        })),
        newContent: newContent.map((c) => ({
          id: c.id,
          subjectId: c.subjectId,
          grade: c.grade,
          area: c.area,
          description: c.description,
        })),
        removedContent: uniqueRemoved.map((c) => ({
          id: c.id,
          subjectId: c.subjectId,
          grade: c.grade,
          area: c.area,
          description: c.description,
        })),
        summary: {
          newCount: newContent.length,
          removedCount: uniqueRemoved.length,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
