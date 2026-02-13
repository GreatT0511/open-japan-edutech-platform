export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Card, HeroSection, Stat } from "@ojetp/ui";
import { CurriculumMatrixClient } from "./page.client";

export default async function DashboardPage() {
  const [guidelines, subjectCount, newContentCount, removedContentCount] = await Promise.all([
    prisma.curriculumGuideline.findMany({
      include: {
        subjects: {
          include: {
            _count: { select: { contents: true } },
          },
        },
      },
      orderBy: { effectiveYear: "desc" },
    }),
    prisma.subject.count(),
    prisma.subjectContent.count({ where: { isNew: true } }),
    prisma.subjectContent.count({ where: { isRemoved: true } }),
  ]);

  const guidelineCount = guidelines.length;

  // Build matrix data: for each guideline, collect unique subject names and grade ranges
  const matrixData = guidelines.map((g) => ({
    id: g.id,
    version: g.version,
    schoolLevel: g.schoolLevel,
    effectiveYear: g.effectiveYear,
    subjects: g.subjects.map((s) => ({
      id: s.id,
      name: s.name,
      gradeStart: s.gradeStart,
      gradeEnd: s.gradeEnd,
      contentCount: s._count.contents,
    })),
  }));

  return (
    <>
      <HeroSection
        title="学習指導要領の比較"
        subtitle="CurriculumMap"
        description="教科・学年ごとの学習内容を構造化し、改訂による変更点を可視化します"
        ctaText="教科一覧を見る"
        ctaHref="/subjects"
      />

      {/* 統計カード */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="指導要領数" value={guidelineCount} />
          <Stat label="教科数" value={subjectCount} />
          <Stat label="新設内容" value={newContentCount} trend="up" change="新しく追加された内容" />
          <Stat label="削除内容" value={removedContentCount} trend="down" change="削除された内容" />
        </div>
      </section>

      {/* 指導要領一覧 */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-[var(--text-2xl)] font-bold text-[var(--color-neutral-900)]">
          指導要領一覧
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guidelines.map((g) => (
            <Card key={g.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-neutral-900)]">
                    {g.version}
                  </h3>
                  <p className="mt-1 text-[var(--text-sm)] text-[var(--color-neutral-500)]">
                    施行年: {g.effectiveYear}年
                  </p>
                </div>
                <span className="rounded-[var(--radius-full)] bg-[var(--color-primary-100)] px-3 py-1 text-[var(--text-xs)] font-medium text-[var(--color-primary-700)]">
                  {g.schoolLevel}
                </span>
              </div>
              <p className="mt-3 text-[var(--text-sm)] text-[var(--color-neutral-600)]">
                教科数: {g.subjects.length}科目
              </p>
              <a
                href={`/guidelines?id=${g.id}`}
                className="mt-4 inline-block text-[var(--text-sm)] font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
              >
                詳細を見る →
              </a>
            </Card>
          ))}
          {guidelines.length === 0 && (
            <p className="col-span-full text-center text-[var(--color-neutral-500)]">
              指導要領データがまだ登録されていません
            </p>
          )}
        </div>
      </section>

      {/* 教科 x 学年マトリクス（クライアントコンポーネント） */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-[var(--text-2xl)] font-bold text-[var(--color-neutral-900)]">
          教科・学年マトリクス
        </h2>
        <CurriculumMatrixClient guidelines={matrixData} />
      </section>
    </>
  );
}
