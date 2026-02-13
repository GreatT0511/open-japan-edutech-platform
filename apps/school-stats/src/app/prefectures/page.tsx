export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Stat } from "@ojetp/ui";
import { PrefectureCharts } from "./page.client";

export default async function PrefecturesPage() {
  const latestYearResult = await prisma.schoolStat.findFirst({
    orderBy: { year: "desc" },
    select: { year: true },
  });
  const latestYear = latestYearResult?.year ?? 2024;

  const stats = await prisma.schoolStat.groupBy({
    by: ["prefectureId"],
    where: { year: latestYear },
    _sum: { schoolCount: true, studentCount: true },
  });

  const prefectures = await prisma.prefecture.findMany();
  const prefMap = new Map(prefectures.map((p) => [p.id, p]));

  const byPrefecture = stats
    .map((item) => {
      const pref = prefMap.get(item.prefectureId);
      return {
        prefectureCode: pref?.code ?? "",
        prefectureName: pref?.name ?? "",
        totalSchools: item._sum.schoolCount ?? 0,
        totalStudents: item._sum.studentCount ?? 0,
      };
    })
    .sort((a, b) => a.prefectureCode.localeCompare(b.prefectureCode));

  const totalPrefectures = byPrefecture.length;
  const maxSchoolsPref = byPrefecture.reduce(
    (max, p) => (p.totalSchools > max.totalSchools ? p : max),
    byPrefecture[0] ?? { prefectureName: "N/A", totalSchools: 0 },
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-neutral-900)]">都道府県別データ</h1>
      <p className="mb-8 text-[var(--color-neutral-500)]">{latestYear}年度の都道府県別学校統計</p>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Stat label="対象都道府県数" value={`${totalPrefectures}`} />
        <Stat
          label="最多学校数"
          value={maxSchoolsPref.prefectureName}
          change={`${maxSchoolsPref.totalSchools.toLocaleString()} 校`}
        />
        <Stat label="対象年度" value={`${latestYear}年`} />
      </div>

      <PrefectureCharts data={byPrefecture} />
    </div>
  );
}
