import { errorResponse } from "@ojetp/api/error";
import { paginatedResponse, parsePagination } from "@ojetp/api/pagination";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const partyId = searchParams.get("partyId");
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const { page, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};

    if (partyId) {
      where.partyId = partyId;
    }

    if (category) {
      where.category = category;
    }

    if (year) {
      where.year = Number(year);
    }

    const [stances, total] = await Promise.all([
      prisma.eduPolicyStance.findMany({
        where,
        include: {
          party: {
            select: {
              id: true,
              name: true,
              shortName: true,
              color: true,
            },
          },
        },
        orderBy: [{ party: { name: "asc" } }, { category: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.eduPolicyStance.count({ where }),
    ]);

    return jsonResponse(paginatedResponse(stances, total, { page, limit }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
