import type { Dictionary } from "@/i18n/dictionaries";

export function PricingRationale({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {dict.rationale.heading}
            </h2>
            <p className="mt-3 text-muted-foreground text-pretty">
              {dict.rationale.lead}
            </p>
          </div>

          <div>
            <ul className="space-y-4">
              {dict.rationale.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1 shrink-0 rounded-full bg-data"
                  />
                  <span className="text-pretty">{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground text-pretty">
              {dict.rationale.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
