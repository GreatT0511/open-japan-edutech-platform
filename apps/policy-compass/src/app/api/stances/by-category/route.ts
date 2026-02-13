import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");

    if (!category) {
      return errorResponse("category パラメータが必要です", 400);
    }

    const stances = await prisma.eduPolicyStance.findMany({
      where: { category: category as never },
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
      orderBy: [{ party: { name: "asc" } }, { year: "desc" }],
    });

    // Group by party
    const grouped: Record<
      string,
      {
        party: { id: string; name: string; shortName: string; color: string };
        stances: typeof stances;
      }
    > = {};

    for (const stance of stances) {
      const partyId = stance.partyId;
      if (!grouped[partyId]) {
        grouped[partyId] = {
          party: stance.party,
          stances: [],
        };
      }
      grouped[partyId].stances.push(stance);
    }

    return jsonResponse({
      data: stances,
      grouped: Object.values(grouped),
      category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message);
  }
}
