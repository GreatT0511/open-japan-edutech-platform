"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface TermTooltipProps {
  /** The term being defined */
  term: string;
  /** Explanation text shown in the tooltip popup */
  explanation: string;
  /** Inline content that triggers the tooltip */
  children: ReactNode;
  /** Position of the tooltip. Default "top" */
  position?: "top" | "bottom";
}

export function TermTooltip({ term, explanation, children, position = "top" }: TermTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close on outside click / scroll
  useEffect(() => {
    if (!isOpen) return;

    function handleOutside(e: Event) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("scroll", () => setIsOpen(false), {
      passive: true,
    });
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("scroll", () => setIsOpen(false));
    };
  }, [isOpen]);

  const positionClasses =
    position === "top"
      ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
      : "top-full left-1/2 mt-2 -translate-x-1/2";

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: wrapper for hover/touch events
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onTouchStart={() => setIsOpen((prev) => !prev)}
    >
      <button
        type="button"
        className="cursor-help border-b border-dashed border-blue-400 text-blue-700 bg-transparent p-0 font-inherit text-inherit"
        aria-describedby={`tooltip-${term}`}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {children}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            id={`tooltip-${term}`}
            role="tooltip"
            className={`absolute z-50 w-64 rounded-lg bg-gray-900 px-4 py-3 text-sm leading-relaxed text-white shadow-xl ${positionClasses}`}
            initial={{ opacity: 0, y: position === "top" ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? 6 : -6 }}
            transition={{ duration: 0.15 }}
          >
            <span className="mb-1 block text-xs font-bold text-blue-300">{term}</span>
            {explanation}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
