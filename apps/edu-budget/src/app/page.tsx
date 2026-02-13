export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { HeroSection, Stat } from "@ojetp/ui";
import { DashboardCharts } from "./page.client";

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

export default async function DashboardPage() {
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

  // Number of distinct categories
  const categories = await prisma.eduBudget.findMany({
    where: { fiscalYear: latestYear },
    select: { category: true },
    distinct: ["category"],
  });
  const categoryCount = categories.length;

  // Number of programs
  const programCount = await prisma.eduProgram.count();

  // OECD rank info - Japan's latest data
  const japanOecd = await prisma.oecdComparison.findFirst({
    where: { countryCode: "JPN" },
    orderBy: { year: "desc" },
  });

  // Budget by category (latest year)
  const budgetByCategory = await prisma.eduBudget.groupBy({
    by: ["category"],
    where: { fiscalYear: latestYear },
    _sum: { amount: true },
  });

  const byCategoryData = budgetByCategory.map((item) => ({
    category: categoryLabels[item.category] ?? item.category,
    amount: item._sum.amount ? Number(item._sum.amount) : 0,
  }));

  // Budget trends by year
  const trendData = await prisma.eduBudget.groupBy({
    by: ["fiscalYear"],
    _sum: { amount: true },
    orderBy: { fiscalYear: "asc" },
  });

  const trendChartData = trendData.map((item) => ({
    year: item.fiscalYear,
    amount: item._sum.amount ? Number(item._sum.amount) : 0,
  }));

  return (
    <div>
      <HeroSection
        title="教育予算の可視化"
        subtitle="EduBudget"
        description="文科省予算の推移を分野別に可視化。どこにお金が使われているかを一目で把握できます"
        ctaText="予算推移を見る"
        ctaHref="/trends"
      />

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={`${latestYear}年度 総予算`} value={`${totalBudget.toLocaleString()} 億円`} />
          <Stat label="予算カテゴリ数" value={`${categoryCount}`} />
          <Stat label="主要施策数" value={`${programCount}`} />
          <Stat
            label="教育費対GDP比（OECD）"
            value={
              japanOecd?.eduSpendingGdpPct ? `${japanOecd.eduSpendingGdpPct.toFixed(1)}%` : "N/A"
            }
            change={japanOecd ? `${japanOecd.year}年データ` : undefined}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <DashboardCharts budgetByCategory={byCategoryData} budgetTrends={trendChartData} />
      </section>
    </div>
  );
}
