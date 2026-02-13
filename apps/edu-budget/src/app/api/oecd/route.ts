import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import type { Prisma } from "@ojetp/db";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const year = searchParams.get("year");
    const country = searchParams.get("country");

    const where: Prisma.OecdComparisonWhereInput = {};

    if (year) {
      where.year = Number(year);
    }

    if (country) {
      where.countryCode = country;
    }

    const data = await prisma.oecdComparison.findMany({
      where,
      orderBy: [{ year: "desc" }, { country: "asc" }],
    });

    return jsonResponse({ data });
  } catch (error) {
    console.error("GET /api/oecd error:", error);
    return errorResponse("OECD比較データの取得に失敗しました");
  }
}
