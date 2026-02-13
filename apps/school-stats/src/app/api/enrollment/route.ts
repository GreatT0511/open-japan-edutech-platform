import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import type { Prisma } from "@ojetp/db";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const schoolLevel = searchParams.get("schoolLevel");

    const where: Prisma.SchoolStatWhereInput = {};

    if (schoolLevel) {
      where.schoolLevel = schoolLevel as Prisma.EnumSchoolLevelFilter["equals"];
    }

    const trends = await prisma.schoolStat.groupBy({
      by: ["year"],
      where,
      _sum: { studentCount: true },
      orderBy: { year: "asc" },
    });

    const data = trends.map((item) => ({
      year: item.year,
      studentCount: item._sum.studentCount ?? 0,
    }));

    return jsonResponse({ data });
  } catch (error) {
    console.error("GET /api/enrollment error:", error);
    return errorResponse("児童生徒数データの取得に失敗しました");
  }
}
