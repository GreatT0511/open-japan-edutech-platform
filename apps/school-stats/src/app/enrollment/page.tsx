export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Stat } from "@ojetp/ui";
import { EnrollmentCharts } from "./page.client";

const schoolLevelLabels: Record<string, string> = {
  ELEMENTARY: "小学校",
  JUNIOR_HIGH: "中学校",
  HIGH_SCHOOL: "高等学校",
  SPECIAL_NEEDS: "特別支援学校",
  KINDERGARTEN: "幼稚園",
  COMBINED: "義務教育学校等",
};

export default async function EnrollmentPage() {
  // Overall trends
  const overallTrends = await prisma.schoolStat.groupBy({
    by: ["year"],
    _sum: { studentCount: true },
    orderBy: { year: "asc" },
  });

  const overallData = overallTrends.map((item) => ({
    year: item.year,
    studentCount: item._sum.studentCount ?? 0,
  }));

  // Trends by school level
  const byLevelTrends = await prisma.schoolStat.groupBy({
    by: ["year", "schoolLevel"],
    _sum: { studentCount: true },
    orderBy: { year: "asc" },
  });

  // Pivot: { year, ELEMENTARY, JUNIOR_HIGH, ... }
  const yearMap = new Map<number, Record<string, number>>();
  for (const item of byLevelTrends) {
    if (!yearMap.has(item.year)) {
      yearMap.set(item.year, { year: item.year } as unknown as Record<string, number>);
    }
    const row = yearMap.get(item.year)!;
    row[item.schoolLevel] = item._sum.studentCount ?? 0;
  }
  const byLevelData = Array.from(yearMap.values()).sort(
    (a, b) => (a.year as number) - (b.year as number),
  );

  // Summary stats
  const latestYear = overallData[overallData.length - 1];
  const previousYear = overallData.length >= 2 ? overallData[overallData.length - 2] : null;
  const changeRate =
    latestYear && previousYear
      ? (
          ((latestYear.studentCount - previousYear.studentCount) / previousYear.studentCount) *
          100
        ).toFixed(2)
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-neutral-900)]">児童生徒数の推移</h1>
      <p className="mb-8 text-[var(--color-neutral-500)]">年度別の児童生徒数を学校種別ごとに表示</p>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Stat
          label="最新年度 児童生徒数"
          value={latestYear ? latestYear.studentCount.toLocaleString() : "N/A"}
          change={latestYear ? `${latestYear.year}年度` : undefined}
        />
        <Stat
          label="前年比"
          value={changeRate ? `${changeRate}%` : "N/A"}
          trend={
            changeRate
              ? Number(changeRate) > 0
                ? "up"
                : Number(changeRate) < 0
                  ? "down"
                  : "neutral"
              : "neutral"
          }
        />
        <Stat label="データ年数" value={`${overallData.length} 年分`} />
      </div>

      <EnrollmentCharts
        overallTrends={overallData}
        byLevelTrends={byLevelData}
        levelLabels={schoolLevelLabels}
      />
    </div>
  );
}
