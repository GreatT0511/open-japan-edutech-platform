"use client";

import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** 幅 — Tailwind のクラスまたは CSS 値 */
  width?: string;
  /** 高さ — Tailwind のクラスまたは CSS 値 */
  height?: string;
  /** 円形にする */
  circle?: boolean;
  className?: string;
}

export function Skeleton({
  width,
  height,
  circle = false,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse bg-[var(--color-neutral-200)]",
        circle ? "rounded-full" : "rounded-[var(--radius-md)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: width ?? "100%",
        height: height ?? "1rem",
        ...style,
      }}
      {...props}
    />
  );
}
