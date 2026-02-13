"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)] shadow-sm",
  secondary:
    "bg-[var(--color-secondary-600)] text-white hover:bg-[var(--color-secondary-700)] active:bg-[var(--color-secondary-800)] shadow-sm",
  outline:
    "border border-[var(--color-primary-600)] text-[var(--color-primary-600)] bg-transparent hover:bg-[var(--color-primary-50)] active:bg-[var(--color-primary-100)]",
  ghost:
    "text-[var(--color-neutral-600)] bg-transparent hover:bg-[var(--color-neutral-100)] active:bg-[var(--color-neutral-200)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[var(--text-sm)] rounded-[var(--radius-md)]",
  md: "px-4 py-2 text-[var(--text-base)] rounded-[var(--radius-md)]",
  lg: "px-6 py-3 text-[var(--text-lg)] rounded-[var(--radius-lg)]",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)] focus-visible:ring-offset-2",
        variantStyles[variant],
        sizeStyles[size],
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
