import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/claims/$id")({
  component: ClaimDetail,
  head: () => ({ meta: [{ title: "Claim — ClaimForSure" }] }),
});

type Claim = Record<string, any>;

function ClaimDetail() {
  const { id } = Route.useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("claims").select("*").eq("id", id).maybeSingle();
    if (error) toast.error(error.message);
    setClaim(data);
  }
  useEffect(() => { load(); }, [id]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !claim) return;
    setUploading(true);
    const { data: u } = await supabase.auth.getUser();
    const path = `${u.user!.id}/${claim.claim_id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("claim-documents").upload(path, file);
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const docs = [...(claim.documents ?? []), path];
    const { error } = await supabase.from("claims").update({ documents: docs }).eq("id", claim.id);
    setUploading(false);
    if (error) return toast.error(error.message);
    toast.success("Document uploaded");
    load();
  }

  async function viewDoc(path: string) {
    const { data, error } = await supabase.storage.from("claim-documents").createSignedUrl(path, 60);
    if (error || !data) return toast.error(error?.message ?? "Failed");
    window.open(data.signedUrl, "_blank");
  }

  if (!claim) return <DashboardShell><div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></DashboardShell>;

  const editable = claim.status === "pending";

  return (
    <DashboardShell>
      <Link to="/dashboard/claims" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to claims</Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{claim.claim_id}</h1>
          <p className="text-sm text-muted-foreground">Submitted {new Date(claim.created_at).toLocaleDateString()}</p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{claim.status}</span>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Info label="Insurance type" value={claim.insurance_type} />
        <Info label="Insurance company" value={claim.insurance_company} />
        <Info label="Policy number" value={claim.policy_number} />
        <Info label="Claim amount" value={`₹${Number(claim.claim_amount).toLocaleString("en-IN")}`} />
        <Info label="Rejection date" value={claim.rejection_date} />
        <Info label="City / State" value={`${claim.city}, ${claim.state}`} />
        <Info label="Phone" value={claim.phone} />
        <Info label="Email" value={claim.email} />
        <div className="md:col-span-2"><Info label="Rejection reason" value={claim.rejection_reason} /></div>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Documents</h2>
          {editable && (
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
              <input type="file" hidden onChange={handleUpload} disabled={uploading} accept="image/*,.pdf,.doc,.docx" />
            </label>
          )}
        </div>
        <ul className="mt-4 space-y-2">
          {(claim.documents ?? []).length === 0 && <li className="text-sm text-muted-foreground">No documents uploaded yet.</li>}
          {(claim.documents ?? []).map((p: string) => (
            <li key={p} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
              <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> {p.split("/").pop()}</span>
              <button onClick={() => viewDoc(p)} className="text-xs font-medium text-primary hover:underline">View</button>
            </li>
          ))}
        </ul>
        {!editable && <p className="mt-4 text-xs text-muted-foreground">Documents can only be uploaded while the claim status is "pending".</p>}
      </section>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
