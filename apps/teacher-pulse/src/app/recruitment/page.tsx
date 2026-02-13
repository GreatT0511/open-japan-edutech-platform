export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { RecruitmentCharts } from "./page.client";

export default async function RecruitmentPage() {
  const data = await prisma.teacherRecruitment.findMany({
    orderBy: [{ year: "asc" }, { schoolLevel: "asc" }],
    where: { prefectureId: null },
  });

  const chartData = data.map((d) => ({
    year: d.year,
    schoolLevel: d.schoolLevel,
    applicants: d.applicants,
    hires: d.hires,
    ratio: d.ratio,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">教員採用倍率</h1>
      <p className="mb-8 text-gray-600">
        教員採用試験の倍率推移です。近年、特に小学校で倍率低下が深刻化しています。
      </p>
      <RecruitmentCharts data={chartData} />
    </main>
  );
}
