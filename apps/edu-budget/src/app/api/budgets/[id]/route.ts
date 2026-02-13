import { errorResponse, notFoundResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { serializeBigInt } from "@ojetp/api/serialize";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const budget = await prisma.eduBudget.findUnique({
      where: { id },
    });

    if (!budget) {
      return notFoundResponse("予算データ");
    }

    return jsonResponse(serializeBigInt(budget));
  } catch (error) {
    console.error("GET /api/budgets/[id] error:", error);
    return errorResponse("予算データの取得に失敗しました");
  }
}
