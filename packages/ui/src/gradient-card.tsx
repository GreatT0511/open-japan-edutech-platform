"use client";

import type { ReactNode } from "react";

export interface GradientCardProps {
  title?: string;
  children: ReactNode;
  /** Tailwind "from-*" color class, e.g. "from-blue-500". Default "from-blue-500" */
  gradientFrom?: string;
  /** Tailwind "to-*" color class, e.g. "to-green-500". Default "to-green-400" */
  gradientTo?: string;
  className?: string;
}

export function GradientCard({
  title,
  children,
  gradientFrom = "from-blue-500",
  gradientTo = "to-green-400",
  className = "",
}: GradientCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-[1px] shadow-lg ${className}`}
    >
      <div className="rounded-[11px] bg-white p-6">
        {title && <h3 className="mb-3 text-lg font-bold text-gray-900">{title}</h3>}
        <div className="text-gray-700">{children}</div>
      </div>
    </div>
  );
}
