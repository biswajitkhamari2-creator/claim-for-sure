import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground font-bold">C</span>
            <span className="font-serif text-lg font-semibold tracking-tight">ClaimForSure</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/refund" className="hover:text-foreground">Refund</Link>
            <Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          </nav>
          <a href="tel:+919439572073" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Call +91 94395 72073
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[oklch(0.2_0.05_265)] py-14 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">{title}</h1>
          {updated && <p className="mt-3 text-sm text-white/70">Last updated: {updated}</p>}
        </div>
      </section>

      {/* Content */}
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
            <div className="space-y-8 leading-relaxed text-muted-foreground">{children}</div>
          </article>
          <ContactBox />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ClaimForSure. Claims-assistance service — not an insurer.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/refund" className="hover:text-foreground">Refund</Link>
            <Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-2xl font-bold text-foreground">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-2">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <H2>{title}</H2>
      {children}
    </section>
  );
}

export function Callout({ tone = "warning", children }: { tone?: "warning" | "danger" | "info"; children: ReactNode }) {
  const styles =
    tone === "danger"
      ? "border-red-300 bg-red-50 text-red-900"
      : tone === "info"
        ? "border-blue-300 bg-blue-50 text-blue-900"
        : "border-amber-300 bg-amber-50 text-amber-900";
  return <div className={`rounded-lg border-2 p-4 ${styles}`}>{children}</div>;
}

function ContactBox() {
  return (
    <div className="mt-8 rounded-xl border border-border bg-muted/40 p-6">
      <p className="font-semibold text-foreground">Claim For Sure</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Email: <a className="text-primary hover:underline" href="mailto:support@claimforsure.in">support@claimforsure.in</a>
      </p>
      <p className="text-sm text-muted-foreground">
        Phone: <a className="text-primary hover:underline" href="tel:+919439572073">+91 94395 72073</a> ·{" "}
        <a className="text-primary hover:underline" href="tel:+919438463174">+91 94384 63174</a>
      </p>
      <p className="mt-2 text-xs text-primary">🎯 Connect directly to our Claim Fighter — No Bot! 🤝</p>
    </div>
  );
}
