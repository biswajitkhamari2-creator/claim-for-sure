import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, Loader2, Send, Sparkles, Package, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/rewards")({
  component: RewardsPage,
  head: () => ({ meta: [{ title: "Rewards — ClaimForSure" }] }),
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  issued: "bg-green-100 text-green-800",
};

const APP_STATUS_STYLES: Record<string, string> = {
  not_eligible: "bg-muted text-muted-foreground",
  under_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
};

const APP_STATUS_LABEL: Record<string, string> = {
  not_eligible: "Not Eligible",
  under_review: "Under Review",
  approved: "Approved",
  shipped: "Shipped",
  delivered: "Delivered",
};

function RewardsPage() {
  const [config, setConfig] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [policyRef, setPolicyRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const [{ data: cfg }, { data: r }] = await Promise.all([
      supabase.from("rewards_config" as any).select("*").limit(1).maybeSingle(),
      supabase.from("rewards" as any).select("*").eq("user_id", user?.id ?? "").order("created_at", { ascending: false }),
    ]);
    setConfig(cfg);
    setRewards((r as any) ?? []);
    setLoading(false);
  }

  async function requestReward(e: React.FormEvent) {
    e.preventDefault();
    if (!config?.enabled) return;
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("rewards" as any).insert({
      user_id: user!.id,
      policy_reference: policyRef.trim(),
      reward_type: config.reward_type,
      reward_value: config.reward_value,
      currency: config.currency,
      status: "pending",
      eligibility_snapshot: config.eligibility_rules,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Reward request submitted for review");
    setPolicyRef("");
    load();
  }

  if (loading) {
    return <DashboardShell><div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></DashboardShell>;
  }

  const enabled = !!config?.enabled;
  const appreciationEnabled = !!config?.appreciation_enabled;
  const appreciationEntries = rewards.filter((r: any) => r.program_type === "appreciation");
  const rewardRequests = rewards.filter((r: any) => (r.program_type ?? "request") === "request");

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">Rewards</h1>
      </div>

      {appreciationEnabled && (
        <section className="mb-6 rounded-xl border border-[oklch(0.82_0.14_80)]/40 bg-gradient-to-br from-[oklch(0.98_0.02_80)] to-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.82_0.14_80)]/20 text-[oklch(0.3_0.1_70)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-lg font-bold">Customer Appreciation</h2>
                <span className="rounded-full bg-[oklch(0.82_0.14_80)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.2_0.05_265)]">Surprise Gift</span>
              </div>
              {appreciationEntries.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No appreciation gift on record yet. Eligibility, selection, and availability are determined solely by ClaimForSure.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {appreciationEntries.map((r: any) => {
                    const s = (r.shipping_status as string) || "under_review";
                    return (
                      <div key={r.id} className="rounded-lg border border-border bg-white/80 p-3 text-sm backdrop-blur">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium">{r.gift_type || "Appreciation gift"}</div>
                            {s === "shipped" && (r.courier || r.awb) && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Package className="h-3.5 w-3.5" />
                                {r.courier || "Courier"}{r.awb ? ` · AWB ${r.awb}` : ""}
                              </div>
                            )}
                            {s === "delivered" && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-green-700">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Delivered{r.delivered_at ? ` on ${new Date(r.delivered_at).toLocaleDateString("en-IN")}` : ""} — thank you for being with us!
                              </div>
                            )}
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${APP_STATUS_STYLES[s]}`}>{APP_STATUS_LABEL[s]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Any appreciation gift is entirely discretionary, subject to eligibility, availability, applicable laws, and our Terms &amp; Conditions. It is not guaranteed with the purchase of any insurance product.
              </p>
            </div>
          </div>
        </section>
      )}

      {!enabled ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium text-foreground">The Rewards Program is currently unavailable.</p>
          <p className="mt-2 text-sm text-muted-foreground">Please check back later. Existing reward records, if any, are shown below.</p>
        </div>
      ) : (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg font-bold">Request a reward</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Eligible policyholders may request a {config.reward_type.replace(/_/g, " ")} worth {config.currency} {Number(config.reward_value).toLocaleString("en-IN")}, subject to admin approval.
          </p>
          <form onSubmit={requestReward} className="mt-4 flex flex-col gap-3 md:flex-row">
            <input value={policyRef} onChange={(e) => setPolicyRef(e.target.value)} required
              placeholder="Policy number"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit request
            </button>
          </form>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-serif text-lg font-bold">My reward status</h2>
        </div>
        {rewardRequests.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No reward requests yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {rewardRequests.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-3 px-6 py-4 text-sm">
                <div>
                  <div className="font-medium capitalize">{r.reward_type.replace(/_/g, " ")} · {r.currency} {Number(r.reward_value).toLocaleString("en-IN")}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Policy: {r.policy_reference || "—"} · {new Date(r.created_at).toLocaleDateString("en-IN")}</div>
                  {r.rejection_reason && <div className="mt-1 text-xs text-red-700">Reason: {r.rejection_reason}</div>}
                  {r.issue_reference && <div className="mt-1 text-xs text-green-700">Issued: {r.issue_reference}</div>}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <strong>Disclaimer:</strong> {config?.disclaimer ?? "Rewards, if offered, are promotional, subject to applicable law, eligibility criteria, and Terms & Conditions. ClaimForSure reserves the right to modify or withdraw the program at any time."}
      </p>
    </DashboardShell>
  );
}
