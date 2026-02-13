import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const year = searchParams.get("year");

    // Get the latest year if not specified
    let targetYear: number;
    if (year) {
      targetYear = Number(year);
    } else {
      const latest = await prisma.schoolStat.findFirst({
        orderBy: { year: "desc" },
        select: { year: true },
      });
      targetYear = latest?.year ?? 2024;
    }

    const stats = await prisma.schoolStat.groupBy({
      by: ["prefectureId"],
      where: { year: targetYear },
      _sum: {
        schoolCount: true,
        studentCount: true,
      },
    });

    // Fetch prefecture info
    const prefectures = await prisma.prefecture.findMany();
    const prefMap = new Map(prefectures.map((p) => [p.id, p]));

    const result = stats.map((item) => {
      const pref = prefMap.get(item.prefectureId);
      return {
        prefectureCode: pref?.code ?? "",
        prefectureName: pref?.name ?? "",
        totalSchools: item._sum.schoolCount ?? 0,
        totalStudents: item._sum.studentCount ?? 0,
      };
    });

    // Sort by prefecture code
    result.sort((a, b) => a.prefectureCode.localeCompare(b.prefectureCode));

    return jsonResponse({ data: result, year: targetYear });
  } catch (error) {
    console.error("GET /api/schools/by-prefecture error:", error);
    return errorResponse("都道府県別データの取得に失敗しました");
  }
}
