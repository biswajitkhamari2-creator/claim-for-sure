import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logoAsset from "@/assets/claim-for-sure-logo.png.asset.json";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.2_0.05_265)] text-white">
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[oklch(0.78_0.14_78)]/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[oklch(0.5_0.15_265)]/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="Claim For Sure" className="h-9 w-9 rounded-md object-cover" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold tracking-tight text-white">Claim For Sure</span>
            <span className="text-[10px] uppercase tracking-wider text-white/60">by Sidheswar Enterprises</span>
          </span>
        </Link>

        <div className="my-auto py-10">
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl">
            <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-white/70">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-5 text-center text-sm text-white/75">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export const inputCx = "w-full rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[oklch(0.78_0.14_78)] focus:bg-white/15";
export const btnPrimary = "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[oklch(0.78_0.14_78)] px-4 py-2.5 text-sm font-semibold text-[oklch(0.2_0.05_265)] shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
export const btnGhost = "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10";
