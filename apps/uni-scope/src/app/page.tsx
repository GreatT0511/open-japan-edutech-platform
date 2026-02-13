export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { HeroSection, Stat } from "@ojetp/ui";
import { DashboardCharts } from "./page.client";

export default async function DashboardPage() {
  const [totalCount, nationalCount, publicCount, privateCount, avgEmployment] = await Promise.all([
    prisma.university.count(),
    prisma.university.count({ where: { type: "NATIONAL" } }),
    prisma.university.count({ where: { type: "PUBLIC" } }),
    prisma.university.count({ where: { type: "PRIVATE" } }),
    prisma.uniMetric.aggregate({
      _avg: { employmentRate: true },
    }),
  ]);

  const avgEmploymentRate = avgEmployment._avg.employmentRate ?? 0;

  // University type distribution for pie chart
  const typeDistribution = [
    { name: "国立", value: nationalCount },
    { name: "公立", value: publicCount },
    { name: "私立", value: privateCount },
  ];

  // Tuition comparison by type
  const tuitionByType = await prisma.uniMetric.groupBy({
    by: ["universityId"],
    _avg: { tuitionAnnual: true },
  });

  // Get university types for each metric group
  const universityIds = tuitionByType.map((t) => t.universityId);
  const universities = await prisma.university.findMany({
    where: { id: { in: universityIds } },
    select: { id: true, type: true },
  });
  const uniTypeMap = new Map(universities.map((u) => [u.id, u.type]));

  const tuitionAggregated: Record<string, { sum: number; count: number }> = {};
  for (const item of tuitionByType) {
    if (item._avg.tuitionAnnual == null) continue;
    const type = uniTypeMap.get(item.universityId);
    if (!type) continue;
    if (!tuitionAggregated[type]) {
      tuitionAggregated[type] = { sum: 0, count: 0 };
    }
    tuitionAggregated[type].sum += item._avg.tuitionAnnual;
    tuitionAggregated[type].count += 1;
  }

  const typeLabels: Record<string, string> = {
    NATIONAL: "国立",
    PUBLIC: "公立",
    PRIVATE: "私立",
  };

  const tuitionComparison = Object.entries(tuitionAggregated).map(([type, { sum, count }]) => ({
    name: typeLabels[type] ?? type,
    tuition: Math.round(sum / count),
  }));

  return (
    <>
      <HeroSection
        title="大学データ"
        subtitle="UniScope"
        description="大学の基本情報・入学定員・就職率等を比較できます"
      />

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="大学総数" value={totalCount.toLocaleString("ja-JP")} />
          <Stat label="国立大学" value={nationalCount.toLocaleString("ja-JP")} />
          <Stat label="公立大学" value={publicCount.toLocaleString("ja-JP")} />
          <Stat label="平均就職率" value={`${avgEmploymentRate.toFixed(1)}%`} />
        </div>

        <DashboardCharts
          typeDistribution={typeDistribution}
          tuitionComparison={tuitionComparison}
        />
      </section>
    </>
  );
}
