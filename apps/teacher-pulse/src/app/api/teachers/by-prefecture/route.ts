import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
    const schoolLevel = searchParams.get("schoolLevel") ?? undefined;

    const where = {
      ...(year ? { year } : {}),
      ...(schoolLevel ? { schoolLevel: schoolLevel as never } : {}),
    };

    const data = await prisma.teacherStat.groupBy({
      by: ["prefectureId"],
      where,
      _sum: { teacherCount: true },
      _avg: {
        pupilTeacherRatio: true,
        femaleRatio: true,
        avgAge: true,
        nonRegularRatio: true,
      },
      orderBy: { _sum: { teacherCount: "desc" } },
    });

    // Resolve prefecture names
    const prefectureIds = data.map((d) => d.prefectureId);
    const prefectures = await prisma.prefecture.findMany({
      where: { id: { in: prefectureIds } },
    });
    const prefMap = new Map(prefectures.map((p) => [p.id, p]));

    const result = data.map((item) => ({
      prefecture: prefMap.get(item.prefectureId) ?? null,
      totalTeachers: item._sum.teacherCount ?? 0,
      avgPupilTeacherRatio: item._avg.pupilTeacherRatio
        ? Math.round(item._avg.pupilTeacherRatio * 100) / 100
        : null,
      avgFemaleRatio: item._avg.femaleRatio
        ? Math.round(item._avg.femaleRatio * 1000) / 1000
        : null,
      avgAge: item._avg.avgAge ? Math.round(item._avg.avgAge * 10) / 10 : null,
      avgNonRegularRatio: item._avg.nonRegularRatio
        ? Math.round(item._avg.nonRegularRatio * 1000) / 1000
        : null,
    }));

    return jsonResponse({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
