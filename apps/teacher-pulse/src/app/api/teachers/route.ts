import { errorResponse } from "@ojetp/api/error";
import { paginatedResponse, parsePagination } from "@ojetp/api/pagination";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit } = parsePagination(searchParams);

    const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
    const schoolLevel = searchParams.get("schoolLevel") ?? undefined;

    const where = {
      ...(year ? { year } : {}),
      ...(schoolLevel ? { schoolLevel: schoolLevel as never } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.teacherStat.findMany({
        where,
        include: { prefecture: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ year: "desc" }, { teacherCount: "desc" }],
      }),
      prisma.teacherStat.count({ where }),
    ]);

    return jsonResponse(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
