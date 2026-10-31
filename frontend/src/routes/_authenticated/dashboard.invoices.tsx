import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";
import { Loader2, FileText, IndianRupee, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/invoices")({
  component: InvoicesList,
  head: () => ({ meta: [{ title: "Invoices — ClaimForSure" }] }),
});

type Invoice = {
  id: string;
  invoice_no: string;
  claim_id: string;
  base_amount_paise: number;
  gst_paise: number;
  total_paise: number;
  status: string;
  issued_at: string;
  due_date: string;
  paid_at: string | null;
};

function InvoicesList() {
  const [list, setList] = useState<Invoice[] | null>(null);
  const navigate = useNavigate();

  async function load() {
    const { data, error } = await supabase
      .from("invoices")
      .select("id, invoice_no, claim_id, base_amount_paise, gst_paise, total_paise, status, issued_at, due_date, paid_at")
      .order("issued_at", { ascending: false });
    if (error) { toast.error(error.message); setList([]); return; }
    setList((data ?? []) as Invoice[]);
  }
  useEffect(() => { load(); }, []);

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl font-bold">Invoices</h1>
      <p className="mt-1 text-sm text-muted-foreground">GST invoices for our 20% + GST success fee on insurer payouts you have received.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {list === null ? (
          <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No invoices yet. After your insurer pays you, declare the payout from <button className="text-primary underline" onClick={() => navigate({ to: "/dashboard/claims" })}>My Claims</button> to receive your invoice.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">Invoice #</th><th className="px-4 py-3 text-left">Issued</th><th className="px-4 py-3 text-left">Due</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Action</th></tr>
            </thead>
            <tbody>
              {list.map((i) => {
                const total = (i.total_paise / 100).toLocaleString("en-IN");
                const overdue = i.status === "overdue";
                const paid = i.status === "paid";
                return (
                  <tr key={i.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono text-xs">{i.invoice_no}</td>
                    <td className="px-4 py-3">{new Date(i.issued_at).toLocaleDateString("en-IN")}</td>
                    <td className={`px-4 py-3 ${overdue ? "text-rose-700 font-semibold" : ""}`}>{new Date(i.due_date).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{total}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        paid ? "bg-emerald-100 text-emerald-700" :
                        overdue ? "bg-rose-100 text-rose-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>{i.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {paid ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Paid</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Awaiting payment</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <IndianRupee className="mt-0.5 h-4 w-4 shrink-0" />
        <div>Online payment is not available yet. Our team will share bank / UPI details for each invoice, and it is marked paid here once we receive your payment.</div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>Invoices unpaid past their due date are marked overdue and your account is flagged. Defaulters are blocked from filing new claims and may receive legal recovery notices.</div>
      </div>
    </DashboardShell>
  );
}