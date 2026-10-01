import { ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * This section does double duty: it reassures the buyer and it protects the
 * seller, because "escrow only, no other payment method" is the strongest
 * anti-fraud signal a private seller can publish.
 */
export function TransferProcess({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.transfer.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
          {dict.transfer.lead}
        </p>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {dict.transfer.steps.map((step, index) => (
            <li key={step.title} className="bg-card p-6">
              <span className="font-mono text-xs text-data-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-3">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-data-ink"
              aria-hidden="true"
            />
            {dict.transfer.feeNote}
          </p>
          <p className="text-sm text-ink-muted">{dict.transfer.noPaymentNote}</p>
        </div>
      </div>
    </section>
  );
}
