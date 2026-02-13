"use client";

import type { HTMLAttributes, ReactNode } from "react";

export type StatTrend = "up" | "down" | "neutral";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** 統計ラベル */
  label: string;
  /** 統計値 */
  value: ReactNode;
  /** 変化率・変化量のテキスト（例: "+12.5%"） */
  change?: string;
  /** 変化の方向 */
  trend?: StatTrend;
  className?: string;
}

const trendIcon: Record<StatTrend, ReactNode> = {
  up: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
        clipRule="evenodd"
      />
    </svg>
  ),
  down: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
        clipRule="evenodd"
      />
    </svg>
  ),
  neutral: null,
};

const trendColor: Record<StatTrend, string> = {
  up: "text-[var(--color-secondary-600)]",
  down: "text-[var(--color-danger-600)]",
  neutral: "text-[var(--color-neutral-500)]",
};

export function Stat({
  label,
  value,
  change,
  trend = "neutral",
  className = "",
  ...props
}: StatProps) {
  return (
    <div
      className={[
        "rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white p-5 shadow-[var(--shadow-sm)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p className="text-[var(--text-sm)] font-medium text-[var(--color-neutral-500)]">{label}</p>

      <p className="mt-1 text-[var(--text-3xl)] font-bold tracking-tight text-[var(--color-neutral-900)]">
        {value}
      </p>

      {change && (
        <div
          className={[
            "mt-2 flex items-center gap-1 text-[var(--text-sm)] font-medium",
            trendColor[trend],
          ].join(" ")}
        >
          {trendIcon[trend]}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
