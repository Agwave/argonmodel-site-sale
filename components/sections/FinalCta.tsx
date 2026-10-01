import { CopyEmailButton } from "@/components/CopyEmailButton";
import { MailtoLink } from "@/components/cta";
import { contactEmail } from "@/lib/env";
import type { Dictionary } from "@/i18n/dictionaries";

export function FinalCta({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        <div className="rounded-2xl border border-border bg-card/50 p-8 sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.finalCta.heading}
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
            {dict.finalCta.body}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MailtoLink email={contactEmail} subject={dict.hero.mailSubject}>
              {dict.finalCta.ctaPrimary}
            </MailtoLink>
            <CopyEmailButton
              email={contactEmail}
              label={dict.finalCta.ctaSecondary}
              copiedLabel={dict.hero.copied}
            />
          </div>

          <p className="mt-6 font-mono text-xs text-ink-muted">
            {dict.finalCta.note}
          </p>
        </div>
      </div>
    </section>
  );
}
