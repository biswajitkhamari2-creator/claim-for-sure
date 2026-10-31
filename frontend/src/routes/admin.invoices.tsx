import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, CheckCircle2, AlertOctagon, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { BrandLockup } from "@/components/BrandLockup";

export const Route = createFileRoute("/admin/invoices")({
  ssr: false,
  head: () => ({ meta: [{ title: "Invoices — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminInvoices,
});

type Inv = {
  id: string;
  invoice_no: string;
  claim_id: string;
  user_id: string;
  base_amount_paise: number;
  gst_paise: number;
  total_paise: number;
  status: string;
  issued_at: string;
  due_date: string;
  paid_at: string | null;
};
type Defaulter = {
  user_id: string;
  total_outstanding_paise: number;
  first_flagged_at: string;
  reminder_count: number;
  status: string;
};

function AdminInvoices() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/admin/login" }); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); return; }
      setChecking(false);
      load();
    })();
  }, [navigate]);

  async function load() {
    setLoading(true);
    const [{ data: invs, error: e1 }, { data: defs, error: e2 }] = await Promise.all([
      supabase.from("invoices").select("*").order("issued_at", { ascending: false }),
      supabase.from("defaulters").select("*").order("first_flagged_at", { ascending: false }),
    ]);
    if (e1) toast.error(e1.message); else setInvoices((invs ?? []) as Inv[]);
    if (e2) toast.error(e2.message); else setDefaulters((defs ?? []) as Defaulter[]);
    setLoading(false);
  }

  async function markPaid(inv: Inv) {
    const ref = prompt("Payment reference (UTR / cheque #):") || "manual";
    const { error } = await supabase.rpc("mark_invoice_paid", { _invoice_id: inv.id, _razorpay_payment_id: ref });
    if (error) toast.error(error.message); else { toast.success("Marked paid"); load(); }
  }
  async function markOverdue(inv: Inv) {
    const { error } = await supabase.rpc("mark_invoice_overdue", { _invoice_id: inv.id });
    if (error) toast.error(error.message); else { toast.success("Marked overdue — customer flagged as defaulter"); load(); }
  }

  if (checking) return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const totalOutstanding = invoices.filter(i => i.status === "overdue" || i.status === "issued").reduce((s, i) => s + i.total_paise, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-indigo-600 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link to="/admin" className="flex items-center" aria-label="Claim For Sure — by Sidheshwar Enterprises admin">
            <BrandLockup size="xs" layout="inline" tone="light" />
          </Link>
          <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-6 sm:px-6">
        <section>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Invoices</h1>
            <Link to="/admin/payouts" className="ml-auto rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800">Pending payouts →</Link>
          </div>
          <p className="mt-1 text-sm text-slate-500">Outstanding (issued + overdue): <span className="font-bold text-rose-700">₹{(totalOutstanding / 100).toLocaleString("en-IN")}</span></p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {loading ? <div className="grid place-items-center py-12"><Loader2 className="h-5 w-5 animate-spin text-indigo-600" /></div>
            : invoices.length === 0 ? <p className="py-12 text-center text-sm text-slate-500">No invoices yet.</p>
            : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr><th className="px-4 py-3 text-left">Invoice #</th><th className="px-4 py-3 text-left">Issued</th><th className="px-4 py-3 text-left">Due</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Action</th></tr>
                </thead>
                <tbody>
                  {invoices.map((i) => (
                    <tr key={i.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-mono text-xs">{i.invoice_no}</td>
                      <td className="px-4 py-3">{new Date(i.issued_at).toLocaleDateString("en-IN")}</td>
                      <td className={`px-4 py-3 ${i.status === "overdue" ? "font-semibold text-rose-700" : ""}`}>{new Date(i.due_date).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{(i.total_paise / 100).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                          i.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                          i.status === "overdue" ? "bg-rose-100 text-rose-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{i.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {i.status !== "paid" && <button onClick={() => markPaid(i)} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700"><CheckCircle2 className="h-3 w-3" /> Paid</button>}
                          {i.status === "issued" && <button onClick={() => markOverdue(i)} className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700"><AlertOctagon className="h-3 w-3" /> Overdue</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-slate-900"><ShieldAlert className="h-5 w-5 text-rose-600" /> Defaulter registry</h2>
          <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {defaulters.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No defaulters. 🎉</p>
            : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr><th className="px-4 py-3 text-left">User</th><th className="px-4 py-3 text-left">Since</th><th className="px-4 py-3 text-right">Outstanding</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Reminders</th></tr>
                </thead>
                <tbody>
                  {defaulters.map((d) => (
                    <tr key={d.user_id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-mono text-xs">{d.user_id.slice(0, 8)}…</td>
                      <td className="px-4 py-3">{new Date(d.first_flagged_at).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 text-right font-bold text-rose-700">₹{(d.total_outstanding_paise / 100).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${d.status === "active" ? "bg-rose-100 text-rose-700" : d.status === "recovered" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>{d.status}</span></td>
                      <td className="px-4 py-3 text-right">{d.reminder_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}