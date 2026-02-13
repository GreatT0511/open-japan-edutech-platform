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

    const category = searchParams.get("category");

    const where: Prisma.EduProgramWhereInput = {};

    if (category) {
      where.category = category as Prisma.EnumBudgetCategoryFilter["equals"];
    }

    const [data, total] = await Promise.all([
      prisma.eduProgram.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ startYear: "desc" }, { name: "asc" }],
      }),
      prisma.eduProgram.count({ where }),
    ]);

    return jsonResponse(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    console.error("GET /api/programs error:", error);
    return errorResponse("施策データの取得に失敗しました");
  }
}
