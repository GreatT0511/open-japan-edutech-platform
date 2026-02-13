import { errorResponse } from "@ojetp/api/error";
import { paginatedResponse, parsePagination } from "@ojetp/api/pagination";
import { jsonResponse } from "@ojetp/api/response";
import { serializeBigInt } from "@ojetp/api/serialize";
import type { Prisma } from "@ojetp/db";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit } = parsePagination(searchParams);

    const fiscalYear = searchParams.get("fiscalYear");
    const category = searchParams.get("category");

    const where: Prisma.EduBudgetWhereInput = {};

    if (fiscalYear) {
      where.fiscalYear = Number(fiscalYear);
    }

    if (category) {
      where.category = category as Prisma.EnumBudgetCategoryFilter["equals"];
    }

    const [data, total] = await Promise.all([
      prisma.eduBudget.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ fiscalYear: "desc" }, { category: "asc" }],
      }),
      prisma.eduBudget.count({ where }),
    ]);

    return jsonResponse(serializeBigInt(paginatedResponse(data, total, { page, limit })));
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return errorResponse("予算データの取得に失敗しました");
  }
}
