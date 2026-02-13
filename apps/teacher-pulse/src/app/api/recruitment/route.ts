import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
    const schoolLevel = searchParams.get("schoolLevel") ?? undefined;

    const where = {
      ...(year ? { year } : {}),
      ...(schoolLevel ? { schoolLevel: schoolLevel as never } : {}),
    };

    const data = await prisma.teacherRecruitment.findMany({
      where,
      orderBy: [{ year: "desc" }, { schoolLevel: "asc" }],
    });

    return jsonResponse({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
