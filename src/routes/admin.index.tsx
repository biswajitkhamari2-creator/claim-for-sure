import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  Shield, LogOut, Search, Loader2, FileText, Clock, CheckCircle2,
  IndianRupee, RefreshCw, Eye, Mail, Phone, MapPin, X,
} from "lucide-react";
import { toast } from "sonner";

type Claim = Tables<"claims">;

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Dashboard — ClaimForSure" }] }),
  component: AdminDashboard,
});

const STATUSES = ["pending", "in-review", "legal", "resolved", "rejected"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-review": "bg-blue-100 text-blue-800",
  legal: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Claim | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/admin/login" }); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); return; }
      setChecking(false);
      fetchClaims();
    })();
  }, [navigate]);

  async function fetchClaims() {
    setLoading(true);
    const { data, error } = await supabase.from("claims").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setClaims(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("claims").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  const filtered = useMemo(() => {
    return claims.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.claim_id.toLowerCase().includes(q) ||
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.insurance_company.toLowerCase().includes(q)
      );
    });
  }, [claims, search, statusFilter]);

  const stats = useMemo(() => {
    const total = claims.length;
    const pending = claims.filter((c) => c.status === "pending").length;
    const resolved = claims.filter((c) => c.status === "resolved").length;
    const amount = claims.reduce((sum, c) => sum + Number(c.claim_amount || 0), 0);
    return { total, pending, resolved, amount };
  }, [claims]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-[oklch(0.2_0.05_265)] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[oklch(0.82_0.14_80)]" />
            <span className="font-serif text-lg font-semibold">ClaimForSure Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/admin/rewards" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
              Rewards
            </Link>
            <button onClick={fetchClaims} className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-md bg-[oklch(0.82_0.14_80)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.2_0.05_265)]">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={<FileText className="h-4 w-4" />} label="Total claims" value={stats.total} />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Pending" value={stats.pending} />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Resolved" value={stats.resolved} />
          <StatCard icon={<IndianRupee className="h-4 w-4" />} label="Total value" value={`₹${stats.amount.toLocaleString("en-IN")}`} />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, claim ID…"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Claims table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {loading ? (
            <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No claims found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Claim ID</th>
                    <th className="px-4 py-3 text-left">Claimant</th>
                    <th className="px-4 py-3 text-left">Insurer</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{c.claim_id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{c.full_name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{c.insurance_company}</div>
                        <div className="text-xs text-muted-foreground">{c.insurance_type}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">₹{Number(c.claim_amount).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[c.status] ?? "bg-muted"}`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(c)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {selected && <ClaimDrawer claim={selected} onClose={() => setSelected(null)} onUpdate={updateStatus} />}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 font-serif text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function ClaimDrawer({ claim, onClose, onUpdate }: { claim: Claim; onClose: () => void; onUpdate: (id: string, status: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs text-muted-foreground">{claim.claim_id}</div>
            <h2 className="mt-1 font-serif text-2xl font-bold">{claim.full_name}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <Row icon={<Mail className="h-4 w-4" />}><a href={`mailto:${claim.email}`} className="text-primary hover:underline">{claim.email}</a></Row>
          <Row icon={<Phone className="h-4 w-4" />}><a href={`tel:${claim.phone}`} className="text-primary hover:underline">{claim.phone}</a></Row>
          <Row icon={<MapPin className="h-4 w-4" />}>{claim.city}, {claim.state}</Row>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-sm">
          <Field label="Insurance type" value={claim.insurance_type} />
          <Field label="Insurer" value={claim.insurance_company} />
          <Field label="Policy #" value={claim.policy_number} />
          <Field label="Claim amount" value={`₹${Number(claim.claim_amount).toLocaleString("en-IN")}`} />
          <Field label="Rejection date" value={new Date(claim.rejection_date).toLocaleDateString("en-IN")} />
          <Field label="Status" value={claim.status} />
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rejection reason</div>
          <p className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-sm">{claim.rejection_reason}</p>
        </div>

        <div className="mt-6">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Update status</label>
          <select
            value={claim.status}
            onChange={(e) => onUpdate(claim.id, e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {claim.documents && claim.documents.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Documents</div>
            <ul className="mt-2 space-y-1 text-sm">
              {claim.documents.map((d, i) => <li key={i} className="truncate text-muted-foreground">{d}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-muted-foreground">{icon}<div>{children}</div></div>;
}
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-foreground">{value}</div>
    </div>
  );
}
