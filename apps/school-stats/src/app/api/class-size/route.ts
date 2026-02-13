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

    const stats = await prisma.schoolStat.findMany({
      where: {
        year: targetYear,
        avgClassSize: { not: null },
      },
      include: { prefecture: true },
      orderBy: { avgClassSize: "desc" },
    });

    const data = stats.map((item) => ({
      prefectureCode: item.prefecture.code,
      prefectureName: item.prefecture.name,
      schoolLevel: item.schoolLevel,
      avgClassSize: item.avgClassSize,
      classCount: item.classCount,
      studentCount: item.studentCount,
    }));

    return jsonResponse({ data, year: targetYear });
  } catch (error) {
    console.error("GET /api/class-size error:", error);
    return errorResponse("クラスサイズデータの取得に失敗しました");
  }
}
