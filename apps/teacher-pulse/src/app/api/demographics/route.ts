import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";

export async function GET() {
  try {
    const data = await prisma.teacherStat.groupBy({
      by: ["schoolLevel"],
      _avg: {
        avgAge: true,
        femaleRatio: true,
        nonRegularRatio: true,
      },
      _sum: {
        teacherCount: true,
      },
      orderBy: { _sum: { teacherCount: "desc" } },
    });

    const schoolLevelLabels: Record<string, string> = {
      ELEMENTARY: "小学校",
      JUNIOR_HIGH: "中学校",
      HIGH_SCHOOL: "高等学校",
      SPECIAL_NEEDS: "特別支援学校",
      KINDERGARTEN: "幼稚園",
      COMBINED: "義務教育学校",
    };

    const result = data.map((item) => ({
      schoolLevel: item.schoolLevel,
      schoolLevelLabel: schoolLevelLabels[item.schoolLevel] ?? item.schoolLevel,
      totalTeachers: item._sum.teacherCount ?? 0,
      avgAge: item._avg.avgAge ? Math.round(item._avg.avgAge * 10) / 10 : null,
      femaleRatio: item._avg.femaleRatio ? Math.round(item._avg.femaleRatio * 1000) / 1000 : null,
      nonRegularRatio: item._avg.nonRegularRatio
        ? Math.round(item._avg.nonRegularRatio * 1000) / 1000
        : null,
    }));

    return jsonResponse({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message);
  }
}
