"use client";

import type { HTMLAttributes, ReactNode } from "react";

export type BadgeColor = "primary" | "secondary" | "accent" | "danger" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}

const colorStyles: Record<BadgeColor, string> = {
  primary:
    "bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border-[var(--color-primary-200)]",
  secondary:
    "bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)] border-[var(--color-secondary-200)]",
  accent:
    "bg-[var(--color-accent-100)] text-[var(--color-accent-700)] border-[var(--color-accent-200)]",
  danger:
    "bg-[var(--color-danger-100)] text-[var(--color-danger-700)] border-[var(--color-danger-200)]",
  neutral:
    "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border-[var(--color-neutral-200)]",
};

export function Badge({ color = "primary", children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[var(--text-xs)] font-medium leading-none",
        colorStyles[color],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
