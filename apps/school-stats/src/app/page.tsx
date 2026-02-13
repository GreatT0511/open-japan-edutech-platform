export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { HeroSection, Stat } from "@ojetp/ui";
import { DashboardCharts } from "./page.client";

const schoolLevelLabels: Record<string, string> = {
  ELEMENTARY: "小学校",
  JUNIOR_HIGH: "中学校",
  HIGH_SCHOOL: "高等学校",
  SPECIAL_NEEDS: "特別支援学校",
  KINDERGARTEN: "幼稚園",
  COMBINED: "義務教育学校等",
};

export default async function DashboardPage() {
  // Total schools (sum of schoolCount across latest year)
  const latestYearResult = await prisma.schoolStat.findFirst({
    orderBy: { year: "desc" },
    select: { year: true },
  });
  const latestYear = latestYearResult?.year ?? 2024;

  const totalSchoolsAgg = await prisma.schoolStat.aggregate({
    where: { year: latestYear },
    _sum: { schoolCount: true },
  });
  const totalSchools = totalSchoolsAgg._sum.schoolCount ?? 0;

  // Total students
  const totalStudentsAgg = await prisma.schoolStat.aggregate({
    where: { year: latestYear },
    _sum: { studentCount: true },
  });
  const totalStudents = totalStudentsAgg._sum.studentCount ?? 0;

  // Average class size
  const avgClassSizeAgg = await prisma.schoolStat.aggregate({
    where: { year: latestYear, avgClassSize: { not: null } },
    _avg: { avgClassSize: true },
  });
  const avgClassSize = avgClassSizeAgg._avg.avgClassSize
    ? avgClassSizeAgg._avg.avgClassSize.toFixed(1)
    : "N/A";

  // Number of prefectures with data
  const prefecturesWithData = await prisma.schoolStat.findMany({
    where: { year: latestYear },
    select: { prefectureId: true },
    distinct: ["prefectureId"],
  });
  const prefectureCount = prefecturesWithData.length;

  // Schools by level for bar chart
  const schoolsByLevel = await prisma.schoolStat.groupBy({
    by: ["schoolLevel"],
    where: { year: latestYear },
    _sum: { schoolCount: true, studentCount: true },
  });

  const schoolsByLevelData = schoolsByLevel.map((item) => ({
    level: schoolLevelLabels[item.schoolLevel] ?? item.schoolLevel,
    schoolCount: item._sum.schoolCount ?? 0,
    studentCount: item._sum.studentCount ?? 0,
  }));

  // Student count trends by year for line chart
  const trendData = await prisma.schoolStat.groupBy({
    by: ["year"],
    _sum: { studentCount: true },
    orderBy: { year: "asc" },
  });

  const trendChartData = trendData.map((item) => ({
    year: item.year,
    studentCount: item._sum.studentCount ?? 0,
  }));

  return (
    <div>
      <HeroSection
        title="学校基本統計"
        subtitle="SchoolStats"
        description="都道府県別の学校数・児童生徒数・クラスサイズを地図とグラフで表示します"
        ctaText="都道府県別を見る"
        ctaHref="/prefectures"
      />

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="学校数（合計）" value={totalSchools.toLocaleString()} />
          <Stat label="児童生徒数（合計）" value={totalStudents.toLocaleString()} />
          <Stat label="平均クラスサイズ" value={avgClassSize} />
          <Stat label="データのある都道府県数" value={`${prefectureCount} 都道府県`} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <DashboardCharts schoolsByLevel={schoolsByLevelData} studentTrends={trendChartData} />
      </section>
    </div>
  );
}
