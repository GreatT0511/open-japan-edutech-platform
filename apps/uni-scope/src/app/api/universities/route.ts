import { errorResponse } from "@ojetp/api/error";
import { paginatedResponse, parsePagination } from "@ojetp/api/pagination";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit } = parsePagination(searchParams);

    const type = searchParams.get("type") ?? undefined;
    const prefectureCode = searchParams.get("prefectureCode") ?? undefined;

    const where = {
      ...(type ? { type: type as never } : {}),
      ...(prefectureCode ? { prefecture: { code: prefectureCode } } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.university.findMany({
        where,
        include: { prefecture: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.university.count({ where }),
    ]);

    return jsonResponse(paginatedResponse(data, total, { page, limit }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
