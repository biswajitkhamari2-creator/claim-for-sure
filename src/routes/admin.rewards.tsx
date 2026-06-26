import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, ArrowLeft, Save, CheckCircle2, XCircle, Gift, History, Sparkles, Package } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/rewards")({
  ssr: false,
  head: () => ({ meta: [{ title: "Rewards Program — Admin" }] }),
  component: AdminRewards,
});

type Config = {
  id: string;
  enabled: boolean;
  reward_type: string;
  reward_value: number;
  currency: string;
  eligibility_rules: Record<string, boolean | number>;
  disclaimer: string;
  appreciation_enabled?: boolean;
};

type Reward = {
  id: string;
  user_id: string;
  claim_id: string | null;
  policy_reference: string | null;
  reward_type: string;
  reward_value: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "issued";
  admin_notes: string | null;
  rejection_reason: string | null;
  issue_reference: string | null;
  created_at: string;
  program_type?: "request" | "appreciation";
  gift_type?: string | null;
  gift_value_inr?: number | null;
  shipping_status?: string | null;
  courier?: string | null;
  awb?: string | null;
  delivered_at?: string | null;
  admin_remarks?: string | null;
};

type Profile = { user_id: string; full_name: string | null; email: string | null; phone: string | null };

const APPRECIATION_STATUSES = ["not_eligible", "under_review", "approved", "shipped", "delivered"] as const;
type AppStatus = typeof APPRECIATION_STATUSES[number];

const APP_STATUS_STYLES: Record<string, string> = {
  not_eligible: "bg-muted text-muted-foreground",
  under_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  issued: "bg-green-100 text-green-800",
};

const REWARD_TYPES = [
  { value: "amazon_gift_card", label: "Amazon Gift Card" },
  { value: "cashback", label: "Cashback / Bank Transfer" },
  { value: "coupon", label: "Coupon Code" },
  { value: "wallet_credit", label: "Wallet / Service Credit" },
];

function AdminRewards() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"requests" | "appreciation" | "audit">("requests");

  // appreciation entry form
  const [appForm, setAppForm] = useState({
    user_id: "",
    status: "under_review" as AppStatus,
    gift_type: "",
    gift_value_inr: 0,
    courier: "",
    awb: "",
    admin_remarks: "",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/admin/login" }); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) { navigate({ to: "/admin/login" }); return; }
      setChecking(false);
      load();
    })();
  }, [navigate]);

  async function load() {
    const [{ data: cfg }, { data: r }, { data: a }, { data: p }] = await Promise.all([
      supabase.from("rewards_config" as any).select("*").limit(1).maybeSingle(),
      supabase.from("rewards" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("rewards_audit_log" as any).select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("profiles" as any).select("user_id,full_name,email,phone").order("created_at", { ascending: false }).limit(500),
    ]);
    if (cfg) setConfig(cfg as any);
    setRewards((r as any) ?? []);
    setAudit((a as any) ?? []);
    setProfiles((p as any) ?? []);
  }

  async function saveConfig() {
    if (!config) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const before = { ...config };
    const { error } = await supabase.from("rewards_config" as any).update({
      enabled: config.enabled,
      reward_type: config.reward_type,
      reward_value: config.reward_value,
      currency: config.currency,
      eligibility_rules: config.eligibility_rules,
      disclaimer: config.disclaimer,
      appreciation_enabled: !!config.appreciation_enabled,
      updated_by: user?.id,
    }).eq("id", config.id);
    if (error) { toast.error(error.message); setSaving(false); return; }
    await supabase.from("rewards_audit_log" as any).insert({
      config_id: config.id, actor_id: user?.id, action: "config_updated",
      before_state: before, after_state: config,
    });
    toast.success("Rewards configuration saved");
    setSaving(false);
    load();
  }

  async function decide(reward: Reward, action: "approved" | "rejected" | "issued") {
    const notes = action === "rejected" ? prompt("Reason for rejection?") || "" : "";
    const issueRef = action === "issued" ? prompt("Issue reference (gift card code, payout ID, etc.)") || "" : "";
    const { data: { user } } = await supabase.auth.getUser();
    const patch: any = { status: action, decided_by: user?.id, decided_at: new Date().toISOString() };
    if (action === "rejected") patch.rejection_reason = notes;
    if (action === "issued") { patch.issue_reference = issueRef; patch.issued_at = new Date().toISOString(); }
    const { error } = await supabase.from("rewards" as any).update(patch).eq("id", reward.id);
    if (error) { toast.error(error.message); return; }
    await supabase.from("rewards_audit_log" as any).insert({
      reward_id: reward.id, actor_id: user?.id, action,
      before_state: reward, after_state: { ...reward, ...patch }, notes,
    });
    toast.success(`Reward ${action}`);
    load();
  }

  async function createAppreciation() {
    if (!appForm.user_id) { toast.error("Pick a customer"); return; }
    if (!appForm.gift_type.trim()) { toast.error("Gift type is required"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const payload: any = {
      user_id: appForm.user_id,
      program_type: "appreciation",
      reward_type: "appreciation_gift",
      reward_value: appForm.gift_value_inr,
      currency: "INR",
      status: appForm.status === "approved" || appForm.status === "shipped" || appForm.status === "delivered" ? "approved" : "pending",
      gift_type: appForm.gift_type.trim(),
      gift_value_inr: appForm.gift_value_inr,
      shipping_status: appForm.status,
      courier: appForm.courier.trim() || null,
      awb: appForm.awb.trim() || null,
      admin_remarks: appForm.admin_remarks.trim() || null,
      delivered_at: appForm.status === "delivered" ? new Date().toISOString() : null,
      decided_by: user?.id,
      decided_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("rewards" as any).insert(payload).select().single();
    if (error) { toast.error(error.message); return; }
    await supabase.from("rewards_audit_log" as any).insert({
      reward_id: (data as any)?.id, actor_id: user?.id, action: "appreciation_created",
      after_state: payload,
    });
    toast.success("Appreciation entry created");
    setAppForm({ user_id: "", status: "under_review", gift_type: "", gift_value_inr: 0, courier: "", awb: "", admin_remarks: "" });
    load();
  }

  async function updateAppreciation(r: Reward, patch: Partial<Reward>) {
    const { data: { user } } = await supabase.auth.getUser();
    const fullPatch: any = { ...patch };
    if (patch.shipping_status === "delivered" && !r.delivered_at) fullPatch.delivered_at = new Date().toISOString();
    const { error } = await supabase.from("rewards" as any).update(fullPatch).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    await supabase.from("rewards_audit_log" as any).insert({
      reward_id: r.id, actor_id: user?.id, action: "appreciation_updated",
      before_state: r, after_state: { ...r, ...fullPatch },
    });
    toast.success("Updated");
    load();
  }

  const stats = useMemo(() => ({
    total: rewards.length,
    pending: rewards.filter(r => r.status === "pending").length,
    issued: rewards.filter(r => r.status === "issued").length,
  }), [rewards]);

  if (checking || !config) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-[oklch(0.2_0.05_265)] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[oklch(0.82_0.14_80)]" />
            <span className="font-serif text-lg font-semibold">Rewards Program</span>
          </div>
          <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Master toggle */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold">Program status</h2>
              <p className="mt-1 text-sm text-muted-foreground">Disabling hides the program from customers and blocks new requests. Existing records are preserved for audit.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="h-5 w-5" />
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.enabled ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                {config.enabled ? "ENABLED" : "DISABLED"}
              </span>
            </label>
          </div>
        </section>

        {/* Appreciation master toggle */}
        <section className="rounded-xl border border-[oklch(0.82_0.14_80)]/40 bg-[oklch(0.98_0.02_80)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-[oklch(0.3_0.1_70)]">
                <Sparkles className="h-5 w-5" /> Customer Appreciation Program
              </h2>
              <p className="mt-1 text-sm text-[oklch(0.4_0.07_70)]">
                Shows the homepage section and customer dashboard widget. Discretionary, post-purchase gratitude only — never advertised as a purchase incentive.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={!!config.appreciation_enabled}
                onChange={(e) => setConfig({ ...config, appreciation_enabled: e.target.checked })}
                className="h-5 w-5" />
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.appreciation_enabled ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                {config.appreciation_enabled ? "ENABLED" : "DISABLED"}
              </span>
            </label>
          </div>
        </section>

        {/* Reward config */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold">Reward configuration</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Reward type</label>
              <select value={config.reward_type} onChange={(e) => setConfig({ ...config, reward_type: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {REWARD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Reward value</label>
              <input type="number" min={0} value={config.reward_value}
                onChange={(e) => setConfig({ ...config, reward_value: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Currency</label>
              <input value={config.currency} onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Eligibility rules</label>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {Object.entries(config.eligibility_rules).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  {typeof val === "boolean" ? (
                    <input type="checkbox" checked={val}
                      onChange={(e) => setConfig({ ...config, eligibility_rules: { ...config.eligibility_rules, [key]: e.target.checked } })} />
                  ) : (
                    <input type="number" value={val as number}
                      onChange={(e) => setConfig({ ...config, eligibility_rules: { ...config.eligibility_rules, [key]: Number(e.target.value) } })}
                      className="w-20 rounded border border-border bg-background px-2 py-1 text-right" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer-facing disclaimer</label>
            <textarea value={config.disclaimer} rows={3}
              onChange={(e) => setConfig({ ...config, disclaimer: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>

          <button onClick={saveConfig} disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save configuration
          </button>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Total requests" value={stats.total} />
          <Stat label="Pending approval" value={stats.pending} />
          <Stat label="Issued" value={stats.issued} />
        </div>

        {/* Tabs */}
        <section className="rounded-xl border border-border bg-card">
          <div className="flex border-b border-border">
            {[
              { k: "requests", label: "Reward requests", icon: Gift },
              { k: "appreciation", label: "Appreciation", icon: Sparkles },
              { k: "audit", label: "Audit log", icon: History },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium ${tab === t.k ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}>
                <t.icon className="mr-1.5 inline h-4 w-4" />{t.label}
              </button>
            ))}
          </div>

          {tab === "requests" ? (
            (() => {
              const list = rewards.filter(r => (r.program_type ?? "request") === "request");
              return list.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">No reward requests yet.</p>
              ) : (
                <div className="divide-y divide-border">
                  {list.map(r => (
                    <div key={r.id} className="p-4 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-xs text-muted-foreground">user: {r.user_id.slice(0, 8)}… · policy: {r.policy_reference || "—"}</div>
                          <div className="mt-1 font-medium">{REWARD_TYPES.find(t => t.value === r.reward_type)?.label ?? r.reward_type} · {r.currency} {Number(r.reward_value).toLocaleString("en-IN")}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</div>
                          {r.rejection_reason && <div className="mt-1 text-xs text-red-700">Rejected: {r.rejection_reason}</div>}
                          {r.issue_reference && <div className="mt-1 text-xs text-green-700">Issued ref: {r.issue_reference}</div>}
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                      </div>
                      {r.status === "pending" && (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => decide(r, "approved")} className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button onClick={() => decide(r, "rejected")} className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      )}
                      {r.status === "approved" && (
                        <button onClick={() => decide(r, "issued")} className="mt-3 inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white">
                          <Gift className="h-3.5 w-3.5" /> Mark as issued
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          ) : tab === "appreciation" ? (
            <div className="space-y-6 p-6">
              {/* Create form */}
              <div className="rounded-lg border border-border bg-background p-4">
                <h3 className="flex items-center gap-2 font-semibold"><Package className="h-4 w-4" /> Create appreciation entry</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Customer</span>
                    <select value={appForm.user_id}
                      onChange={(e) => setAppForm({ ...appForm, user_id: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="">— Select customer —</option>
                      {profiles.map(p => (
                        <option key={p.user_id} value={p.user_id}>
                          {p.full_name || "(no name)"} · {p.email || p.phone || p.user_id.slice(0, 8)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <select value={appForm.status}
                      onChange={(e) => setAppForm({ ...appForm, status: e.target.value as AppStatus })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      {APPRECIATION_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Gift type</span>
                    <input value={appForm.gift_type}
                      onChange={(e) => setAppForm({ ...appForm, gift_type: e.target.value })}
                      placeholder="e.g. Diwali hamper, Branded mug"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Gift value (₹)</span>
                    <input type="number" min={0} value={appForm.gift_value_inr}
                      onChange={(e) => setAppForm({ ...appForm, gift_value_inr: Number(e.target.value) })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Courier</span>
                    <input value={appForm.courier}
                      onChange={(e) => setAppForm({ ...appForm, courier: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted-foreground">AWB / Tracking</span>
                    <input value={appForm.awb}
                      onChange={(e) => setAppForm({ ...appForm, awb: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </label>
                  <label className="md:col-span-2 block">
                    <span className="text-xs text-muted-foreground">Internal remarks</span>
                    <textarea rows={2} value={appForm.admin_remarks}
                      onChange={(e) => setAppForm({ ...appForm, admin_remarks: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </label>
                </div>
                <button onClick={createAppreciation}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  <Sparkles className="h-4 w-4" /> Create entry
                </button>
              </div>

              {/* Existing entries */}
              {(() => {
                const list = rewards.filter(r => r.program_type === "appreciation");
                if (list.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">No appreciation entries yet.</p>;
                return (
                  <div className="divide-y divide-border rounded-lg border border-border">
                    {list.map(r => {
                      const status = (r.shipping_status as AppStatus) || "under_review";
                      const profile = profiles.find(p => p.user_id === r.user_id);
                      return (
                        <div key={r.id} className="p-4 text-sm">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium">{profile?.full_name || "Customer"} · {profile?.email || profile?.phone || r.user_id.slice(0, 8)}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {r.gift_type || "—"} · ₹{Number(r.gift_value_inr || 0).toLocaleString("en-IN")}
                                {r.courier && ` · ${r.courier}`}{r.awb && ` · AWB ${r.awb}`}
                              </div>
                              {r.admin_remarks && <div className="mt-1 text-xs italic text-muted-foreground">Note: {r.admin_remarks}</div>}
                              <div className="mt-1 text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</div>
                            </div>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${APP_STATUS_STYLES[status]}`}>{status.replace(/_/g, " ")}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <select value={status}
                              onChange={(e) => updateAppreciation(r, { shipping_status: e.target.value as any })}
                              className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                              {APPRECIATION_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          ) : (
            audit.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No audit entries yet.</p>
            ) : (
              <div className="divide-y divide-border text-sm">
                {audit.map(a => (
                  <div key={a.id} className="p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{a.action}</span>
                      <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">actor: {a.actor_id?.slice(0, 8) ?? "system"}… {a.notes && `· ${a.notes}`}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-2xl font-bold">{value}</div>
    </div>
  );
}
