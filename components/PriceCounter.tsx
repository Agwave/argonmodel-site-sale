"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Rendered outside the animating element so the line never reflows. */
  prefix: string;
  /** The integer to count up to. */
  value: number;
  /** `value` with grouping separators — the resting text. */
  valueText: string;
  /** BCP 47 tag, e.g. "en-US". A string, because this is a client component. */
  localeTag: string;
  className?: string;
};

const DURATION_MS = 900;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * The hero figure.
 *
 * Server-renders the final number and only animates on the client, so the first
 * paint carries the real value whether or not JS arrives — LCP is never waiting
 * on an animation, and the no-JS page is identical. Visitors who ask for reduced
 * motion get the static number.
 */
export function PriceCounter({
  prefix,
  value,
  valueText,
  localeTag,
  className,
}: Props) {
  // null means "at rest" — render the server-supplied text.
  const [current, setCurrent] = useState<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (value <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();

    // No synchronous setState here: the first frame lands on ~0 anyway, so the
    // rewind happens on the first tick rather than in the effect body.
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      if (progress >= 1) {
        // Settle back onto the exact server-rendered string.
        setCurrent(null);
        frameRef.current = null;
        return;
      }
      setCurrent(Math.round(easeOutCubic(progress) * value));
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [value]);

  const animating = current !== null;

  return (
    <span className={className}>
      <span aria-hidden="true">{prefix}</span>
      <span
        // Tabular figures only while the digits are changing; at rest the
        // proportional figures read better at display sizes.
        className={animating ? "tabular-nums" : undefined}
      >
        {animating ? current.toLocaleString(localeTag) : valueText}
      </span>
    </span>
  );
}
