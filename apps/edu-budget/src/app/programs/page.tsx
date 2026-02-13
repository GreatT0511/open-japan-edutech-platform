export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Card, Stat } from "@ojetp/ui";

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

export default async function ProgramsPage() {
  const programs = await prisma.eduProgram.findMany({
    orderBy: [{ startYear: "desc" }, { name: "asc" }],
  });

  const totalPrograms = programs.length;
  const activePrograms = programs.filter((p) => !p.endYear).length;
  const totalBudget = programs.reduce((sum, p) => sum + (p.budgetBillions ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-neutral-900)]">主要施策</h1>
      <p className="mb-8 text-[var(--color-neutral-500)]">文科省の教育関連施策一覧</p>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Stat label="施策総数" value={`${totalPrograms}`} />
        <Stat label="進行中の施策" value={`${activePrograms}`} />
        <Stat label="予算規模合計" value={`${totalBudget.toLocaleString()} 億円`} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {programs.map((program) => (
          <Card key={program.id}>
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-bold text-[var(--color-neutral-900)]">{program.name}</h3>
              <span className="ml-2 shrink-0 rounded-full bg-[var(--color-primary-50)] px-3 py-1 text-xs font-medium text-[var(--color-primary-700)]">
                {categoryLabels[program.category] ?? program.category}
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-[var(--color-neutral-600)]">
              {program.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-neutral-500)]">
              <span>開始年: {program.startYear}年</span>
              {program.endYear && <span>終了年: {program.endYear}年</span>}
              {!program.endYear && (
                <span className="font-medium text-[var(--color-secondary-600)]">進行中</span>
              )}
              {program.budgetBillions && (
                <span>予算規模: {program.budgetBillions.toLocaleString()} 億円</span>
              )}
            </div>
            {program.url && (
              <a
                href={program.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-800)]"
              >
                詳細を見る →
              </a>
            )}
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="py-16 text-center text-[var(--color-neutral-400)]">
          施策データがありません
        </div>
      )}
    </div>
  );
}
