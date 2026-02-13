import { errorResponse } from "@ojetp/api/error";
import { jsonResponse } from "@ojetp/api/response";
import { prisma } from "@ojetp/db";

export async function GET() {
  try {
    // Latest fiscal year
    const latestBudget = await prisma.eduBudget.findFirst({
      orderBy: { fiscalYear: "desc" },
      select: { fiscalYear: true },
    });
    const latestYear = latestBudget?.fiscalYear ?? 2024;

    // Total budget for latest year
    const totalBudgetAgg = await prisma.eduBudget.aggregate({
      where: { fiscalYear: latestYear },
      _sum: { amount: true },
    });
    const totalBudget = totalBudgetAgg._sum.amount ? Number(totalBudgetAgg._sum.amount) : 0;

    // Distinct categories count
    const categories = await prisma.eduBudget.findMany({
      where: { fiscalYear: latestYear },
      select: { category: true },
      distinct: ["category"],
    });

    // Total programs
    const programCount = await prisma.eduProgram.count();

    // OECD data for Japan
    const japanOecd = await prisma.oecdComparison.findFirst({
      where: { countryCode: "JPN" },
      orderBy: { year: "desc" },
    });

    // Total OECD countries
    const oecdCountries = await prisma.oecdComparison.findMany({
      select: { countryCode: true },
      distinct: ["countryCode"],
    });

    return jsonResponse({
      latestYear,
      totalBudget,
      categoryCount: categories.length,
      programCount,
      oecdCountryCount: oecdCountries.length,
      japanEduSpendingGdpPct: japanOecd?.eduSpendingGdpPct ?? null,
      japanOecdYear: japanOecd?.year ?? null,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return errorResponse("統計サマリーの取得に失敗しました");
  }
}
