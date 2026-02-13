import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";

export async function GET() {
  try {
    const prefectures = await prisma.prefecture.findMany({
      orderBy: { code: "asc" },
    });

    return jsonResponse({ data: prefectures });
  } catch (error) {
    console.error("GET /api/prefectures error:", error);
    return errorResponse("都道府県データの取得に失敗しました");
  }
}
