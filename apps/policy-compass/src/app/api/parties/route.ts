import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const parties = await prisma.party.findMany({
      include: {
        _count: {
          select: { stances: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const data = parties.map((p) => ({
      id: p.id,
      name: p.name,
      shortName: p.shortName,
      color: p.color,
      website: p.website,
      stanceCount: p._count.stances,
    }));

    return jsonResponse({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
