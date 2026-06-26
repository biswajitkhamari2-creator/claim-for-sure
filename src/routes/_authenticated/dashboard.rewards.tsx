import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, Loader2, Send } from "lucide-react";
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

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">Rewards</h1>
      </div>

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
        {rewards.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No reward requests yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {rewards.map(r => (
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
