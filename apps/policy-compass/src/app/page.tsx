export const dynamic = "force-dynamic";

import { prisma } from "@ojetp/db";
import { Card, HeroSection, Stat } from "@ojetp/ui";
import { PolicyOverviewClient } from "./page.client";

export default async function DashboardPage() {
  const [parties, stanceCount, categoryStances] = await Promise.all([
    prisma.party.findMany({
      include: {
        _count: { select: { stances: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.eduPolicyStance.count(),
    prisma.eduPolicyStance.groupBy({
      by: ["category"],
      _count: { id: true },
    }),
  ]);

  const partyCount = parties.length;
  const categoryCount = categoryStances.length;

  // Prepare client data
  const partyData = parties.map((p) => ({
    id: p.id,
    name: p.name,
    shortName: p.shortName,
    color: p.color,
    stanceCount: p._count.stances,
  }));

  return (
    <>
      <HeroSection
        title="政党別教育政策スタンス"
        subtitle="PolicyCompass"
        description="各政党の教育政策を分野別に比較。選挙前の判断材料として活用できます"
        ctaText="政党一覧を見る"
        ctaHref="/parties"
      />

      {/* 統計カード */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat label="政党数" value={partyCount} />
          <Stat label="政策分野数" value={categoryCount} />
          <Stat label="スタンス総数" value={stanceCount} />
        </div>
      </section>

      {/* 政党一覧 */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-[var(--text-2xl)] font-bold text-[var(--color-neutral-900)]">
          政党一覧
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parties.map((p) => (
            <Card key={p.id}>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-4 w-4 shrink-0 rounded-[var(--radius-full)]"
                  style={{ backgroundColor: p.color }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-neutral-900)]">
                    {p.name}
                  </h3>
                  <span className="text-[var(--text-sm)] text-[var(--color-neutral-500)]">
                    {p.shortName}
                  </span>
                </div>
                <span
                  className="shrink-0 rounded-[var(--radius-full)] px-3 py-1 text-[var(--text-xs)] font-medium text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p._count.stances}件
                </span>
              </div>
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[var(--text-xs)] text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]"
                >
                  公式サイト →
                </a>
              )}
            </Card>
          ))}
          {parties.length === 0 && (
            <p className="col-span-full text-center text-[var(--color-neutral-500)]">
              政党データがまだ登録されていません
            </p>
          )}
        </div>
      </section>

      {/* 政党スタンス比較概要（クライアントコンポーネント） */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-[var(--text-2xl)] font-bold text-[var(--color-neutral-900)]">
          政策スタンス概要
        </h2>
        <PolicyOverviewClient parties={partyData} />
      </section>
    </>
  );
}
