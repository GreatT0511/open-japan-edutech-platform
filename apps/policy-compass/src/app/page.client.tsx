"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface PartyInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  stanceCount: number;
}

interface PolicyOverviewClientProps {
  parties: PartyInfo[];
}

const CATEGORY_LABELS: Record<string, string> = {
  TEACHER_POLICY: "教員政策",
  TUITION_SUPPORT: "学費・就学支援",
  ICT_EDUCATION: "ICT・デジタル教育",
  TRUANCY_SUPPORT: "不登校対策",
  SPECIAL_NEEDS: "特別支援教育",
  EARLY_CHILDHOOD: "幼児教育",
  HIGHER_EDUCATION_REFORM: "大学改革",
  CURRICULUM: "カリキュラム・学力",
  SCHOOL_SAFETY: "学校安全",
  INTERNATIONAL: "国際教育・英語",
  LIFELONG_LEARNING: "生涯学習",
  EDUCATION_FINANCE: "教育財政",
};

interface StanceData {
  id: string;
  partyId: string;
  category: string;
  stance: string;
  detail: string | null;
  year: number | null;
  party: {
    id: string;
    name: string;
    shortName: string;
    color: string;
  };
}

export function PolicyOverviewClient({ parties }: PolicyOverviewClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [stances, setStances] = useState<StanceData[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = Object.entries(CATEGORY_LABELS);

  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);
    fetch(`/api/stances/by-category?category=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setStances(data.data ?? []);
      })
      .catch(() => {
        setStances([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory]);

  if (parties.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white p-8 text-center text-[var(--color-neutral-500)]">
        比較を表示するための政党データがありません
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 政党カード一覧 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {parties.map((party, index) => (
          <motion.div
            key={party.id}
            className="flex flex-col items-center rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white p-4 text-center shadow-[var(--shadow-sm)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div
              className="mb-2 h-10 w-10 rounded-[var(--radius-full)]"
              style={{ backgroundColor: party.color }}
            />
            <p className="text-[var(--text-sm)] font-semibold text-[var(--color-neutral-800)]">
              {party.shortName}
            </p>
            <p className="mt-1 text-[var(--text-xs)] text-[var(--color-neutral-500)]">
              {party.stanceCount}件のスタンス
            </p>
          </motion.div>
        ))}
      </div>

      {/* 分野選択 */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
        <label
          htmlFor="category-select"
          className="mb-3 block text-[var(--text-sm)] font-medium text-[var(--color-neutral-700)]"
        >
          政策分野を選択して比較:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[var(--color-neutral-300)] px-3 py-2 text-[var(--text-sm)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)]"
        >
          <option value="">-- 分野を選択 --</option>
          {categories.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {/* 結果表示 */}
        {selectedCategory && (
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-[var(--radius-full)] border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)]" />
                <span className="ml-3 text-[var(--text-sm)] text-[var(--color-neutral-500)]">
                  読み込み中...
                </span>
              </div>
            ) : stances.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {stances.map((stance, index) => (
                  <motion.div
                    key={stance.id}
                    className="rounded-[var(--radius-md)] border p-4"
                    style={{ borderLeftColor: stance.party.color, borderLeftWidth: "4px" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-[var(--radius-full)]"
                        style={{ backgroundColor: stance.party.color }}
                      />
                      <span className="text-[var(--text-sm)] font-semibold text-[var(--color-neutral-800)]">
                        {stance.party.shortName}
                      </span>
                      {stance.year && (
                        <span className="text-[var(--text-xs)] text-[var(--color-neutral-400)]">
                          ({stance.year}年)
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--text-sm)] text-[var(--color-neutral-700)]">
                      {stance.stance}
                    </p>
                    {stance.detail && (
                      <p className="mt-2 text-[var(--text-xs)] text-[var(--color-neutral-500)]">
                        {stance.detail}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-[var(--text-sm)] text-[var(--color-neutral-500)]">
                この分野のスタンスデータはまだ登録されていません
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
