import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FilePlus2, FileText, User, ArrowRight, ShieldCheck, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";
import { NoticesBanner } from "@/components/NoticesBanner";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
  head: () => ({ meta: [{ title: "Dashboard — ClaimForSure" }] }),
});

function DashboardHome() {
  const [name, setName] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", uid).maybeSingle();
      setName(profile?.full_name || u.user?.email?.split("@")[0] || "there");
      const { count: c } = await supabase.from("claims").select("*", { count: "exact", head: true }).eq("user_id", uid);
      setCount(c ?? 0);
    })();
  }, []);

  const cards = [
    { to: "/dashboard/claims/new", icon: FilePlus2, title: "Submit a new claim", desc: "Start a fresh claim with our advisors." },
    { to: "/dashboard/claims", icon: FileText, title: "My Claims", desc: count === null ? "Track status & documents." : `${count} claim${count === 1 ? "" : "s"} on file.` },
    { to: "/dashboard/profile", icon: User, title: "Profile & Settings", desc: "Update your name, mobile, and photo." },
    { to: "/dashboard/rewards", icon: Gift, title: "Rewards", desc: "Check eligibility and request rewards." },
  ];

  return (
    <DashboardShell>
      <section className="rounded-2xl border border-border bg-gradient-to-br from-[oklch(0.2_0.05_265)] to-[oklch(0.3_0.08_265)] p-8 text-white shadow-lg">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
          <ShieldCheck className="h-4 w-4" /> Verified account
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Welcome, {name}</h1>
        <p className="mt-2 max-w-xl text-sm text-white/80">Manage your insurance claims securely. Our advisors are one step away.</p>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-xl border border-border bg-card p-6 transition hover:shadow-md">
            <c.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold text-foreground">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
