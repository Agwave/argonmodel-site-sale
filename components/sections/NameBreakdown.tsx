import type { Dictionary } from "@/i18n/dictionaries";

export function NameBreakdown({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.name.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
          {dict.name.lead}
        </p>

        {/* 2×2 — the four cards read as a sequence: the news, then what each
            half of the name means, then what the two say together. */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {dict.name.cards.map((card, index) => (
            <div
              key={card.title}
              className="rounded-xl border border-border bg-card/50 p-6"
            >
              <span className="font-mono text-xs text-data-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Deliberately smaller than the hero figure: the page has exactly one
            hero number, and this strip must not compete with it. */}
        <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-6 font-mono text-sm text-muted-foreground tabular-nums">
          {dict.name.stats.map((stat, index) => (
            <li key={stat} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
              )}
              {stat}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
