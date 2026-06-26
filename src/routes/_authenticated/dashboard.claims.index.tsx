import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FilePlus2, Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/claims/")({
  component: ClaimsList,
  head: () => ({ meta: [{ title: "My Claims — ClaimForSure" }] }),
});

type Claim = {
  id: string;
  claim_id: string;
  insurance_company: string;
  insurance_type: string;
  claim_amount: number;
  status: string;
  created_at: string;
};

function ClaimsList() {
  const [claims, setClaims] = useState<Claim[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      const { data } = await supabase
        .from("claims")
        .select("id, claim_id, insurance_company, insurance_type, claim_amount, status, created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });
      setClaims((data as Claim[]) ?? []);
    })();
  }, []);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">My Claims</h1>
        <Link to="/dashboard/claims/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <FilePlus2 className="h-4 w-4" /> New Claim
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {claims === null ? (
          <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : claims.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">You haven't submitted any claims yet.</p>
            <Link to="/dashboard/claims/new" className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <FilePlus2 className="h-4 w-4" /> Submit your first claim
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">Claim ID</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Company</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-left">Status</th><th></th></tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs">{c.claim_id}</td>
                  <td className="px-4 py-3">{c.insurance_type}</td>
                  <td className="px-4 py-3">{c.insurance_company}</td>
                  <td className="px-4 py-3 text-right">₹{Number(c.claim_amount).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{c.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/dashboard/claims/$id" params={{ id: c.id }} className="text-xs font-medium text-primary hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
