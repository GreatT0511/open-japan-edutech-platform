export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Stat } from "@ojetp/ui";
import { OecdCharts } from "./page.client";

export default async function OecdPage() {
  // Get latest year of OECD data
  const latestOecd = await prisma.oecdComparison.findFirst({
    orderBy: { year: "desc" },
    select: { year: true },
  });
  const latestYear = latestOecd?.year ?? 2022;

  // Latest year data for all countries
  const latestData = await prisma.oecdComparison.findMany({
    where: { year: latestYear },
    orderBy: { eduSpendingGdpPct: "desc" },
  });

  // Japan's position
  const japanData = latestData.find((d) => d.countryCode === "JPN");
  const japanRank = latestData.findIndex((d) => d.countryCode === "JPN") + 1;

  // OECD average
  const validPcts = latestData
    .map((d) => d.eduSpendingGdpPct)
    .filter((v): v is number => v !== null);
  const oecdAvg =
    validPcts.length > 0
      ? (validPcts.reduce((a, b) => a + b, 0) / validPcts.length).toFixed(1)
      : "N/A";

  // Japan's trend over years
  const japanTrend = await prisma.oecdComparison.findMany({
    where: { countryCode: "JPN" },
    orderBy: { year: "asc" },
  });

  const japanTrendData = japanTrend.map((item) => ({
    year: item.year,
    eduSpendingGdpPct: item.eduSpendingGdpPct,
    publicSpendingPct: item.publicSpendingPct,
  }));

  // Comparison bar chart data
  const comparisonData = latestData.map((item) => ({
    country: item.country,
    countryCode: item.countryCode,
    eduSpendingGdpPct: item.eduSpendingGdpPct,
    publicSpendingPct: item.publicSpendingPct,
    primaryPupilTeacher: item.primaryPupilTeacher,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-neutral-900)]">国際比較（OECD）</h1>
      <p className="mb-8 text-[var(--color-neutral-500)]">
        OECD諸国との教育支出比較（{latestYear}年データ）
      </p>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="日本の教育費対GDP比"
          value={
            japanData?.eduSpendingGdpPct ? `${japanData.eduSpendingGdpPct.toFixed(1)}%` : "N/A"
          }
        />
        <Stat
          label="OECD内順位"
          value={japanRank > 0 ? `${japanRank} / ${latestData.length}` : "N/A"}
        />
        <Stat label="OECD平均" value={`${oecdAvg}%`} />
        <Stat label="比較対象国数" value={`${latestData.length} か国`} />
      </div>

      <OecdCharts comparisonData={comparisonData} japanTrend={japanTrendData} />
    </div>
  );
}
