"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  FadeIn                                                             */
/* ------------------------------------------------------------------ */

export interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, duration = 0.5, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  SlideUp                                                            */
/* ------------------------------------------------------------------ */

export interface SlideUpProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  offset?: number;
  className?: string;
}

export function SlideUp({
  children,
  duration = 0.5,
  delay = 0,
  offset = 40,
  className,
}: SlideUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StaggerContainer + StaggerItem                                     */
/* ------------------------------------------------------------------ */

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  const variants: Variants = {
    ...staggerContainerVariants,
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div className={className} variants={variants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}
