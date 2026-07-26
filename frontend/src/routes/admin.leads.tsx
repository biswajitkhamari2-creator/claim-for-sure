import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LogOut, Search, Loader2, FileText, CheckCircle2,
  RefreshCw, Eye, Mail, Phone, MapPin, X, ExternalLink, Download, Users,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLockup } from "@/components/BrandLockup";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// The backend endpoint might be relative to the window or a specific API base
const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname) {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.");
    if (!isLocal) return ""; 
    return `http://${host}:8000`;
  }
  return "http://localhost:8000";
};

type Lead = {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  insurance_company: string | null;
  claim_type: string | null;
  claim_status: string | null;
  description: string | null;
  rejection_letter_path: string | null;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  head: () => ({ meta: [{ title: "Leads Dashboard — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLeadsDashboard,
});

const STATUSES = ["New", "Contacted", "In Progress", "Closed"] as const;

const STATUS_PILL: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Contacted": "bg-amber-100 text-amber-700",
  "In Progress": "bg-fuchsia-100 text-fuchsia-700",
  "Closed": "bg-emerald-100 text-emerald-700",
};
const STATUS_BORDER: Record<string, string> = {
  "New": "border-blue-500",
  "Contacted": "border-amber-500",
  "In Progress": "border-fuchsia-500",
  "Closed": "border-emerald-500",
};

function getFileName(path: string) {
  return decodeURIComponent(path.split("/").pop() || path || "Document");
}

function AdminLeadsDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/admin/login" }); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) { navigate({ to: "/admin/login" }); return; }
      setChecking(false);
      fetchLeads();
    })();
  }, [navigate]);

  async function fetchLeads() {
    setLoading(true);
    try {
      // Use standard fetch to the backend PHP API
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(`${getApiBaseUrl()}/api/admin/leads?page=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("Failed to load leads");
      const json = await res.json();
      
      if (json.success === false) throw new Error(json.error || "Failed to load leads");
      
      setLeads((json.data ?? []) as Lead[]);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(`${getApiBaseUrl()}/api/admin/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success("Status updated");
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    }
  }

  async function downloadCSV() {
    if (leads.length === 0) return;
    
    const headers = ["ID", "Full Name", "Mobile Number", "Email", "Company", "Type", "Claim Status", "Lead Status", "Date"];
    const rows = leads.map(l => [
      l.id,
      `"${l.full_name}"`,
      `"${l.mobile_number}"`,
      `"${l.email || ''}"`,
      `"${l.insurance_company || ''}"`,
      `"${l.claim_type || ''}"`,
      `"${l.claim_status || ''}"`,
      `"${l.status}"`,
      `"${new Date(l.created_at).toLocaleString()}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.full_name.toLowerCase().includes(q) ||
        l.mobile_number.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.insurance_company && l.insurance_company.toLowerCase().includes(q))
      );
    });
  }, [leads, search, statusFilter]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="sticky top-0 z-30 bg-indigo-600 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link to="/" className="flex items-center" aria-label="Claim For Sure — by Sidheshwar Enterprises">
            <BrandLockup size="xs" layout="inline" tone="light" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="inline-flex items-center rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-bold hover:bg-white/20 sm:px-3 sm:text-xs">Claims Dashboard</Link>
            <Link to="/admin/leads" className="inline-flex items-center rounded-lg bg-blue-400 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-900 hover:bg-blue-300 sm:px-3 sm:text-xs">Leads</Link>
            <button onClick={fetchLeads} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20">
              <RefreshCw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-slate-900 hover:bg-amber-300">
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Lead Management
          </h1>
          
          <Button onClick={downloadCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <div className="mt-2 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name, email, phone..."
              className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm ring-1 ring-slate-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", ...STATUSES] as const).map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                    active
                      ? "bg-slate-900 text-white shadow"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {s === "all" ? "All leads" : s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recent Leads</h2>
          <span className="text-xs font-bold text-indigo-600">{filtered.length} showing</span>
        </div>

        <div className="mt-3 space-y-3">
          {loading ? (
            <div className="grid place-items-center rounded-3xl bg-white py-16 shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-3xl bg-white py-16 text-center text-sm text-slate-500 shadow-sm">No leads found.</p>
          ) : (
            filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelected(l)}
                className={`flex w-full items-center justify-between rounded-[2rem] border-l-[6px] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${STATUS_BORDER[l.status] ?? "border-slate-300"}`}
              >
                <div className="min-w-0 space-y-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold tracking-wider ${STATUS_PILL[l.status] ?? "bg-slate-100 text-slate-700"}`}>
                      {l.status}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-400">#{l.id.substring(0, 8)}</span>
                  </div>
                  <h3 className="truncate text-sm font-bold text-slate-800">{l.full_name} · {l.mobile_number}</h3>
                  <p className="text-[11px] font-medium text-slate-500">
                    {l.insurance_company || "N/A"} · {new Date(l.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="ml-4 shrink-0 text-right">
                  <div className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </main>

      {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} onUpdate={updateStatus} />}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (id: string, status: string) => void }) {
  
  async function openDocument(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(path, 300);
      if (error || !data?.signedUrl) throw new Error(error?.message || "Cannot sign URL");
      
      window.open(data.signedUrl, '_blank');
    } catch (e: any) {
      toast.error(e?.message || "Unable to open document");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs text-muted-foreground">{lead.id}</div>
            <h2 className="mt-1 font-serif text-2xl font-bold">{lead.full_name}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          {lead.email && <Row icon={<Mail className="h-4 w-4" />}><a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a></Row>}
          <Row icon={<Phone className="h-4 w-4" />}><a href={`tel:${lead.mobile_number}`} className="text-primary hover:underline">{lead.mobile_number}</a></Row>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 text-sm">
          <Field label="Insurer" value={lead.insurance_company || "-"} />
          <Field label="Claim type" value={lead.claim_type || "-"} />
          <Field label="Claim status" value={lead.claim_status || "-"} />
          <Field label="Date" value={new Date(lead.created_at).toLocaleString("en-IN")} />
          <Field label="Lead Status" value={lead.status} />
        </div>

        {lead.description && (
          <div className="mt-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</div>
            <p className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap">{lead.description}</p>
          </div>
        )}

        <div className="mt-6">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Update status</label>
          <select
            value={lead.status}
            onChange={(e) => onUpdate(lead.id, e.target.value)}
            className="mt-3 w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-6">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rejection Letter</div>
          {!lead.rejection_letter_path ? (
            <p className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">No document uploaded.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              <li className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">{getFileName(lead.rejection_letter_path)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openDocument(lead.rejection_letter_path!)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View document
                </button>
              </li>
            </ul>
          )}
        </div>

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
