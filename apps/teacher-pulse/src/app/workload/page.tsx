export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { WorkloadCharts } from "./page.client";

export default async function WorkloadPage() {
  const workloads = await prisma.teacherWorkload.findMany({
    orderBy: [{ year: "asc" }, { schoolLevel: "asc" }],
  });

  const chartData = workloads.map((w) => ({
    year: w.year,
    schoolLevel: w.schoolLevel,
    total: w.weeklyHoursTotal,
    teaching: w.weeklyHoursTeaching,
    admin: w.weeklyHoursAdmin,
    source: w.source,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">教員の勤務時間</h1>
      <p className="mb-8 text-gray-600">
        TALIS調査等に基づく教員の週間勤務時間データです。日本の教員は国際的に見ても長時間労働が指摘されています。
      </p>
      <WorkloadCharts data={chartData} />
    </main>
  );
}
