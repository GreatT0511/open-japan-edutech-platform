"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface SubjectSummary {
  id: string;
  name: string;
  gradeStart: number;
  gradeEnd: number;
  contentCount: number;
}

interface GuidelineMatrix {
  id: string;
  version: string;
  schoolLevel: string;
  effectiveYear: number;
  subjects: SubjectSummary[];
}

interface CurriculumMatrixClientProps {
  guidelines: GuidelineMatrix[];
}

const GRADE_LABELS: Record<number, string> = {
  1: "1年",
  2: "2年",
  3: "3年",
  4: "4年",
  5: "5年",
  6: "6年",
  7: "中1",
  8: "中2",
  9: "中3",
  10: "高1",
  11: "高2",
  12: "高3",
};

function intensityClass(count: number): string {
  if (count === 0) return "bg-[var(--color-neutral-100)]";
  if (count <= 3) return "bg-[var(--color-primary-100)]";
  if (count <= 6) return "bg-[var(--color-primary-200)]";
  if (count <= 10) return "bg-[var(--color-primary-300)]";
  return "bg-[var(--color-primary-400)]";
}

export function CurriculumMatrixClient({ guidelines }: CurriculumMatrixClientProps) {
  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string>(guidelines[0]?.id ?? "");

  const selected = guidelines.find((g) => g.id === selectedGuidelineId);

  if (guidelines.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white p-8 text-center text-[var(--color-neutral-500)]">
        マトリクスを表示するための指導要領データがありません
      </div>
    );
  }

  // Determine grade range from subjects
  const allGrades: number[] = [];
  if (selected) {
    for (const s of selected.subjects) {
      for (let g = s.gradeStart; g <= s.gradeEnd; g++) {
        if (!allGrades.includes(g)) allGrades.push(g);
      }
    }
  }
  allGrades.sort((a, b) => a - b);

  // Unique subject names
  const subjectNames = selected ? [...new Set(selected.subjects.map((s) => s.name))] : [];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
      {/* 指導要領セレクター */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label
          htmlFor="guideline-select"
          className="text-[var(--text-sm)] font-medium text-[var(--color-neutral-700)]"
        >
          指導要領を選択:
        </label>
        <select
          id="guideline-select"
          value={selectedGuidelineId}
          onChange={(e) => setSelectedGuidelineId(e.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--color-neutral-300)] px-3 py-2 text-[var(--text-sm)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-200)]"
        >
          {guidelines.map((g) => (
            <option key={g.id} value={g.id}>
              {g.version}（{g.schoolLevel}・{g.effectiveYear}年施行）
            </option>
          ))}
        </select>
      </div>

      {/* マトリクスグリッド */}
      {selected && allGrades.length > 0 && subjectNames.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-3 py-2 text-left text-[var(--text-xs)] font-semibold text-[var(--color-neutral-600)]">
                  教科
                </th>
                {allGrades.map((grade) => (
                  <th
                    key={grade}
                    className="border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-3 py-2 text-center text-[var(--text-xs)] font-semibold text-[var(--color-neutral-600)]"
                  >
                    {GRADE_LABELS[grade] ?? `${grade}年`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjectNames.map((name) => {
                const subject = selected.subjects.find((s) => s.name === name);
                return (
                  <tr key={name}>
                    <td className="border border-[var(--color-neutral-200)] px-3 py-2 text-[var(--text-sm)] font-medium text-[var(--color-neutral-800)]">
                      {name}
                    </td>
                    {allGrades.map((grade) => {
                      const isInRange =
                        subject && grade >= subject.gradeStart && grade <= subject.gradeEnd;
                      const count = isInRange ? subject.contentCount : 0;
                      return (
                        <td
                          key={grade}
                          className="border border-[var(--color-neutral-200)] p-1 text-center"
                        >
                          {isInRange ? (
                            <motion.div
                              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium ${intensityClass(count)}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              title={`${name} ${GRADE_LABELS[grade] ?? `${grade}年`}: ${count}項目`}
                            >
                              {count}
                            </motion.div>
                          ) : (
                            <div className="mx-auto h-10 w-10 rounded-[var(--radius-md)] bg-[var(--color-neutral-50)]" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-[var(--color-neutral-500)]">
          選択した指導要領に教科データがありません
        </p>
      )}

      {/* 凡例 */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-[var(--text-xs)] text-[var(--color-neutral-600)]">
        <span className="font-medium">内容項目数:</span>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded bg-[var(--color-neutral-100)]" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded bg-[var(--color-primary-100)]" />
          <span>1-3</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded bg-[var(--color-primary-200)]" />
          <span>4-6</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded bg-[var(--color-primary-300)]" />
          <span>7-10</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded bg-[var(--color-primary-400)]" />
          <span>11+</span>
        </div>
      </div>
    </div>
  );
}
