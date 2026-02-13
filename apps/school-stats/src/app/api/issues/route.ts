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

    const issueType = searchParams.get("issueType");
    const year = searchParams.get("year");

    const where: Prisma.SchoolIssueWhereInput = {};

    if (issueType) {
      where.issueType = issueType as Prisma.EnumIssueTypeFilter["equals"];
    }

    if (year) {
      where.year = Number(year);
    }

    const [data, total] = await Promise.all([
      prisma.schoolIssue.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ year: "desc" }, { issueType: "asc" }],
      }),
      prisma.schoolIssue.count({ where }),
    ]);

    return jsonResponse(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return errorResponse("課題データの取得に失敗しました");
  }
}
