import { ChevronDown } from "lucide-react";
import { askingPrice } from "@/config/pricing";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Native <details>/<summary> rather than an accordion primitive: keyboard
 * accessible, styleable, and completely free of JavaScript. Every answer is in
 * the DOM whether or not the disclosure is open, so it stays crawlable.
 */
export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.faq.heading}
        </h2>

        <div className="mt-8 border-t border-border">
          {dict.faq.items.map((item) => (
            <details key={item.id} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium marker:content-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {item.q}
                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                {/* Derived from the same union the hero renders, so the answer
                    can never contradict the price shown above. */}
                {item.id === "firmness"
                  ? dict.faq.firmnessAnswers[askingPrice.mode]
                  : item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
