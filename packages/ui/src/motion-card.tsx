"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface MotionCardProps {
  children: ReactNode;
  className?: string;
  scaleOnHover?: number;
  onClick?: () => void;
}

export function MotionCard({
  children,
  className = "",
  scaleOnHover = 1.03,
  onClick,
}: MotionCardProps) {
  return (
    <motion.div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
      whileHover={{
        scale: scaleOnHover,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
