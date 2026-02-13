export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Stat } from "@ojetp/ui";
import { TrendCharts } from "./page.client";

const categoryLabels: Record<string, string> = {
  ELEMENTARY_SECONDARY: "初等中等教育",
  HIGHER_EDUCATION: "高等教育",
  SCIENCE_TECHNOLOGY: "科学技術",
  SPORTS: "スポーツ",
  CULTURE: "文化",
  SCHOLARSHIP: "奨学金・学生支援",
  FACILITY: "施設整備",
  LIFELONG_LEARNING: "生涯学習",
  OTHER: "その他",
};

export default async function TrendsPage() {
  // Overall budget trends
  const overallTrends = await prisma.eduBudget.groupBy({
    by: ["fiscalYear"],
    _sum: { amount: true },
    orderBy: { fiscalYear: "asc" },
  });

  const overallData = overallTrends.map((item) => ({
    year: item.fiscalYear,
    amount: item._sum.amount ? Number(item._sum.amount) : 0,
  }));

  // Trends by category
  const byCategoryTrends = await prisma.eduBudget.groupBy({
    by: ["fiscalYear", "category"],
    _sum: { amount: true },
    orderBy: { fiscalYear: "asc" },
  });

  // Pivot data
  const yearMap = new Map<number, Record<string, number>>();
  for (const item of byCategoryTrends) {
    if (!yearMap.has(item.fiscalYear)) {
      yearMap.set(item.fiscalYear, { year: item.fiscalYear } as unknown as Record<string, number>);
    }
    const row = yearMap.get(item.fiscalYear)!;
    row[item.category] = item._sum.amount ? Number(item._sum.amount) : 0;
  }
  const byCategoryData = Array.from(yearMap.values()).sort(
    (a, b) => (a.year as number) - (b.year as number),
  );

  // Summary
  const latestYear = overallData[overallData.length - 1];
  const previousYear = overallData.length >= 2 ? overallData[overallData.length - 2] : null;
  const changeAmount = latestYear && previousYear ? latestYear.amount - previousYear.amount : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-neutral-900)]">予算推移</h1>
      <p className="mb-8 text-[var(--color-neutral-500)]">文科省予算の年次推移を分野別に確認</p>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Stat
          label="最新年度 総予算"
          value={latestYear ? `${latestYear.amount.toLocaleString()} 億円` : "N/A"}
          change={latestYear ? `${latestYear.year}年度` : undefined}
        />
        <Stat
          label="前年比増減"
          value={
            changeAmount !== null
              ? `${changeAmount >= 0 ? "+" : ""}${changeAmount.toLocaleString()} 億円`
              : "N/A"
          }
          trend={
            changeAmount !== null
              ? changeAmount > 0
                ? "up"
                : changeAmount < 0
                  ? "down"
                  : "neutral"
              : "neutral"
          }
        />
        <Stat label="データ年数" value={`${overallData.length} 年分`} />
      </div>

      <TrendCharts
        overallTrends={overallData}
        byCategoryTrends={byCategoryData}
        categoryLabels={categoryLabels}
      />
    </div>
  );
}
