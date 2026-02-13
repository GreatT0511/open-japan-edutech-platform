export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Stat } from "@ojetp/ui";
import { IssueCharts } from "./page.client";

const issueTypeLabels: Record<string, string> = {
  TRUANCY: "不登校",
  BULLYING: "いじめ認知件数",
  VIOLENCE: "暴力行為",
  DROPOUT: "中途退学",
};

export default async function IssuesPage() {
  // Get trends by issue type and year
  const issueData = await prisma.schoolIssue.groupBy({
    by: ["year", "issueType"],
    _sum: { count: true },
    orderBy: { year: "asc" },
  });

  // Pivot data: { year, TRUANCY, BULLYING, ... }
  const yearMap = new Map<number, Record<string, number>>();
  for (const item of issueData) {
    if (!yearMap.has(item.year)) {
      yearMap.set(item.year, { year: item.year } as unknown as Record<string, number>);
    }
    const row = yearMap.get(item.year)!;
    row[item.issueType] = item._sum.count ?? 0;
  }
  const trendData = Array.from(yearMap.values()).sort(
    (a, b) => (a.year as number) - (b.year as number),
  );

  // Latest year summary
  const latestYearResult = await prisma.schoolIssue.findFirst({
    orderBy: { year: "desc" },
    select: { year: true },
  });
  const latestYear = latestYearResult?.year ?? 2024;

  const latestSummary = await prisma.schoolIssue.groupBy({
    by: ["issueType"],
    where: { year: latestYear },
    _sum: { count: true },
  });

  const summaryMap = new Map(latestSummary.map((item) => [item.issueType, item._sum.count ?? 0]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-neutral-900)]">課題データ</h1>
      <p className="mb-8 text-[var(--color-neutral-500)]">
        不登校・いじめ・暴力行為・中途退学の推移データ
      </p>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="不登校"
          value={(summaryMap.get("TRUANCY") ?? 0).toLocaleString()}
          change={`${latestYear}年度`}
        />
        <Stat
          label="いじめ認知件数"
          value={(summaryMap.get("BULLYING") ?? 0).toLocaleString()}
          change={`${latestYear}年度`}
        />
        <Stat
          label="暴力行為"
          value={(summaryMap.get("VIOLENCE") ?? 0).toLocaleString()}
          change={`${latestYear}年度`}
        />
        <Stat
          label="中途退学"
          value={(summaryMap.get("DROPOUT") ?? 0).toLocaleString()}
          change={`${latestYear}年度`}
        />
      </div>

      <IssueCharts trendData={trendData} issueTypeLabels={issueTypeLabels} />
    </div>
  );
}
