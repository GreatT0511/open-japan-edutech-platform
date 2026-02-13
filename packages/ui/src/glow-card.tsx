"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface GlowCardProps {
  children: ReactNode;
  /** Glow color in CSS format. Default "rgba(59, 130, 246, 0.5)" (blue) */
  glowColor?: string;
  /** Glow spread radius in px. Default 20 */
  glowSpread?: number;
  className?: string;
}

export function GlowCard({
  children,
  glowColor = "rgba(59, 130, 246, 0.5)",
  glowSpread = 20,
  className = "",
}: GlowCardProps) {
  return (
    <motion.div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
      initial={{
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{
        boxShadow: `0 0 ${glowSpread}px ${glowSpread / 2}px ${glowColor}`,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
