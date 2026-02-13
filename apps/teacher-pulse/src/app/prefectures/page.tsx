export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";

export default async function PrefecturesPage() {
  const stats = await prisma.teacherStat.findMany({
    include: { prefecture: true },
    orderBy: { prefecture: { code: "asc" } },
    distinct: ["prefectureId"],
    where: { year: 2024 },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">都道府県別教員データ</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="px-4 py-3 font-semibold">都道府県</th>
              <th className="px-4 py-3 font-semibold text-right">教員数</th>
              <th className="px-4 py-3 font-semibold text-right">平均年齢</th>
              <th className="px-4 py-3 font-semibold text-right">生徒教員比率</th>
              <th className="px-4 py-3 font-semibold text-right">女性比率</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">{stat.prefecture.name}</td>
                <td className="px-4 py-3 text-right">{stat.teacherCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{stat.avgAge?.toFixed(1) ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  {stat.pupilTeacherRatio?.toFixed(1) ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {stat.femaleRatio ? `${(stat.femaleRatio * 100).toFixed(1)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
