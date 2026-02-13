"use client";

import { animate, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export interface AnimatedCounterProps {
  /** カウント先の目標値 */
  target: number;
  /** アニメーション時間（秒） */
  duration?: number;
  /** 小数点以下の桁数 */
  decimals?: number;
  /** 数値のフォーマット関数（省略時はロケール形式） */
  formatValue?: (value: number) => string;
  /** ビューポートに入ったときのみアニメーション開始 */
  animateOnView?: boolean;
  className?: string;
}

function defaultFormat(value: number, decimals: number): string {
  return value.toLocaleString("ja-JP", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function AnimatedCounter({
  target,
  duration = 1.5,
  decimals = 0,
  formatValue,
  animateOnView = true,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  const display = useTransform(motionValue, (latest) =>
    formatValue ? formatValue(latest) : defaultFormat(latest, decimals),
  );

  useEffect(() => {
    if (hasAnimated.current) return;

    const shouldStart = animateOnView ? isInView : true;
    if (!shouldStart) return;

    hasAnimated.current = true;

    const controls = animate(motionValue, target, {
      duration,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [isInView, animateOnView, target, duration, motionValue]);

  // Subscribe to display changes and update the DOM directly
  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
    return unsubscribe;
  }, [display]);

  return (
    <span
      ref={ref}
      className={["tabular-nums font-bold text-[var(--color-neutral-900)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {formatValue ? formatValue(0) : defaultFormat(0, decimals)}
    </span>
  );
}
