import { errorResponse, notFoundResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const program = await prisma.eduProgram.findUnique({
      where: { id },
    });

    if (!program) {
      return notFoundResponse("施策データ");
    }

    return jsonResponse(program);
  } catch (error) {
    console.error("GET /api/programs/[id] error:", error);
    return errorResponse("施策データの取得に失敗しました");
  }
}
