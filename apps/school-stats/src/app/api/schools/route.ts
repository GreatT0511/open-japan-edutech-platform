import { errorResponse } from "@ojetp/api/error";
import { paginatedResponse, parsePagination } from "@ojetp/api/pagination";
import { jsonResponse } from "@ojetp/api/response";
import type { Prisma } from "@ojetp/db";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit } = parsePagination(searchParams);

    const year = searchParams.get("year");
    const schoolLevel = searchParams.get("schoolLevel");
    const prefectureCode = searchParams.get("prefectureCode");

    const where: Prisma.SchoolStatWhereInput = {};

    if (year) {
      where.year = Number(year);
    }

    if (schoolLevel) {
      where.schoolLevel = schoolLevel as Prisma.EnumSchoolLevelFilter["equals"];
    }

    if (prefectureCode) {
      where.prefecture = { code: prefectureCode };
    }

    const [data, total] = await Promise.all([
      prisma.schoolStat.findMany({
        where,
        include: { prefecture: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ year: "desc" }, { schoolLevel: "asc" }],
      }),
      prisma.schoolStat.count({ where }),
    ]);

    return jsonResponse(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    console.error("GET /api/schools error:", error);
    return errorResponse("学校統計データの取得に失敗しました");
  }
}
