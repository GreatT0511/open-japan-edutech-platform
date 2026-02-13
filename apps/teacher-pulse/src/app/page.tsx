export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { HeroSection, Stat } from "@ojetp/ui";
import { DashboardCharts } from "./page.client";

export default async function DashboardPage() {
  const [teacherStats, workloadData, recruitmentData] = await Promise.all([
    prisma.teacherStat.aggregate({
      _sum: { teacherCount: true },
      _avg: { pupilTeacherRatio: true },
    }),
    prisma.teacherWorkload.aggregate({
      _avg: { weeklyHoursTotal: true },
    }),
    prisma.teacherRecruitment.aggregate({
      _avg: { ratio: true },
    }),
  ]);

  const totalTeachers = teacherStats._sum.teacherCount ?? 0;
  const avgPupilTeacherRatio = teacherStats._avg.pupilTeacherRatio ?? 0;
  const avgWeeklyHours = workloadData._avg.weeklyHoursTotal ?? 0;
  const avgRecruitmentRatio = recruitmentData._avg.ratio ?? 0;

  // Data for charts: teachers by school level
  const teachersByLevel = await prisma.teacherStat.groupBy({
    by: ["schoolLevel"],
    _sum: { teacherCount: true },
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

  const teachersByLevelChart = teachersByLevel.map((item) => ({
    name: schoolLevelLabels[item.schoolLevel] ?? item.schoolLevel,
    value: item._sum.teacherCount ?? 0,
  }));

  // Recruitment ratio trends
  const recruitmentTrends = await prisma.teacherRecruitment.groupBy({
    by: ["year"],
    _avg: { ratio: true },
    orderBy: { year: "asc" },
  });

  const recruitmentTrendsChart = recruitmentTrends.map((item) => ({
    year: item.year,
    ratio: item._avg.ratio ? Math.round(item._avg.ratio * 100) / 100 : 0,
  }));

  return (
    <>
      <HeroSection
        title="教員データ"
        subtitle="TeacherPulse"
        description="教員の労働環境・人数推移・年齢構成等を可視化します"
      />

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="教員総数" value={totalTeachers.toLocaleString("ja-JP")} />
          <Stat label="平均生徒教員比率" value={avgPupilTeacherRatio.toFixed(1)} />
          <Stat label="平均週間勤務時間" value={`${avgWeeklyHours.toFixed(1)}h`} />
          <Stat label="平均採用倍率" value={`${avgRecruitmentRatio.toFixed(1)}倍`} />
        </div>

        <DashboardCharts
          teachersByLevel={teachersByLevelChart}
          recruitmentTrends={recruitmentTrendsChart}
        />
      </section>
    </>
  );
}
