"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect, useRef } from "react";

export interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Scroll lerp (linear interpolation) factor. Lower = smoother. Default 0.1 */
  lerp?: number;
  /** Scroll duration in seconds. Default 1.2 */
  duration?: number;
  /** Scroll direction. Default "vertical" */
  orientation?: "vertical" | "horizontal";
  /** Enable touch gestures on mobile. Default true */
  gestureOrientation?: "vertical" | "horizontal" | "both";
  /** Smoothness on touch devices. Default 0.075 */
  touchMultiplier?: number;
}

export function SmoothScrollProvider({
  children,
  lerp = 0.1,
  duration = 1.2,
  orientation = "vertical",
  gestureOrientation = "vertical",
  touchMultiplier = 0.075,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp,
      duration,
      orientation,
      gestureOrientation,
      touchMultiplier,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lerp, duration, orientation, gestureOrientation, touchMultiplier]);

  return <>{children}</>;
}
