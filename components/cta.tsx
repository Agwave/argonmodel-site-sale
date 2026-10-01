import { cn } from "@/lib/utils";

/**
 * Call-to-action styling shared by the mailto links and the copy button.
 *
 * These are plain links and buttons rather than `components/ui/button`, because
 * that component is a Base UI primitive and pulls a client bundle in with it —
 * pure overhead for what is ultimately an `<a href="mailto:…">`.
 */
type Variant = "primary" | "secondary";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
  secondary: "border border-border text-foreground hover:bg-muted",
};

export function ctaClass(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    VARIANTS[variant],
    className,
  );
}

export function mailtoHref(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function MailtoLink({
  email,
  subject,
  variant = "primary",
  className,
  children,
}: {
  email: string;
  subject: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={mailtoHref(email, subject)} className={ctaClass(variant, className)}>
      {children}
    </a>
  );
}
