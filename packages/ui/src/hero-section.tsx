"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  children?: ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  description,
  ctaText = "詳しく見る",
  ctaHref,
  onCtaClick,
  children,
}: HeroSectionProps) {
  const ctaElement = ctaHref ? (
    <motion.a
      href={ctaHref}
      className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {ctaText}
    </motion.a>
  ) : (
    <motion.button
      type="button"
      onClick={onCtaClick}
      className="inline-block cursor-pointer rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {ctaText}
    </motion.button>
  );

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        {subtitle && (
          <motion.p
            className="mb-4 text-sm font-medium tracking-widest text-blue-600 uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.h1
          className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {ctaElement}
        </motion.div>

        {children && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
