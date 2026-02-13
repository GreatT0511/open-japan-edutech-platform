import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const partyIdsParam = searchParams.get("partyIds");
    const category = searchParams.get("category");

    if (!partyIdsParam) {
      return errorResponse("partyIds パラメータが必要です（カンマ区切り）", 400);
    }

    const partyIds = partyIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (partyIds.length < 2) {
      return errorResponse("比較には2つ以上の政党IDが必要です", 400);
    }

    const where: Record<string, unknown> = {
      partyId: { in: partyIds },
    };

    if (category) {
      where.category = category;
    }

    const [parties, stances] = await Promise.all([
      prisma.party.findMany({
        where: { id: { in: partyIds } },
        select: {
          id: true,
          name: true,
          shortName: true,
          color: true,
        },
        orderBy: { name: "asc" },
      }),
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
        orderBy: [{ category: "asc" }, { party: { name: "asc" } }],
      }),
    ]);

    // Group stances by category, then by party
    const byCategory: Record<
      string,
      Record<
        string,
        Array<{
          id: string;
          stance: string;
          detail: string | null;
          source: string | null;
          year: number | null;
        }>
      >
    > = {};

    for (const stance of stances) {
      const cat = stance.category;
      if (!byCategory[cat]) {
        byCategory[cat] = {};
      }
      if (!byCategory[cat][stance.partyId]) {
        byCategory[cat][stance.partyId] = [];
      }
      byCategory[cat][stance.partyId].push({
        id: stance.id,
        stance: stance.stance,
        detail: stance.detail,
        source: stance.source,
        year: stance.year,
      });
    }

    // Build comparison structure
    const comparison = Object.entries(byCategory).map(([categoryKey, partyStances]) => ({
      category: categoryKey,
      parties: parties.map((party) => ({
        ...party,
        stances: partyStances[party.id] ?? [],
      })),
    }));

    return jsonResponse({
      data: {
        parties,
        comparison,
        filters: {
          partyIds,
          category: category ?? null,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
