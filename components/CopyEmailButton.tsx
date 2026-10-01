"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  email: string;
  label: string;
  copiedLabel: string;
  variant?: "primary" | "secondary";
};

/**
 * Clipboard writes only work in a secure context. If the API is missing or the
 * write is rejected, this silently stays put — the address is also rendered as
 * selectable text next to the button, so nothing is gated behind this control.
 */
export function CopyEmailButton({
  email,
  label,
  copiedLabel,
  variant = "secondary",
}: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }

    setCopied(true);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2_000);
  }, [email]);

  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/85"
      : "border border-border text-foreground hover:bg-muted";

  return (
    <button
      type="button"
      onClick={handleCopy}
      // The label swap is a visual change only; announce it politely instead of
      // re-reading the whole button.
      aria-live="polite"
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${styles}`}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
