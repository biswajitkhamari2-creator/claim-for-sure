import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/claims/new")({
  component: NewClaim,
  head: () => ({ meta: [{ title: "New Claim — ClaimForSure" }] }),
});

const schema = z.object({
  full_name: z.string().trim().min(2),
  phone: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
  email: z.string().email(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  insurance_type: z.string().trim().min(1),
  insurance_company: z.string().trim().min(1),
  policy_number: z.string().trim().min(1),
  claim_amount: z.coerce.number().positive("Amount must be positive"),
  rejection_date: z.string().min(1),
  rejection_reason: z.string().trim().min(5),
});

const TYPES = ["Health", "Motor", "Life", "Travel", "Home/Property", "Marine/Cargo", "Other"];

function NewClaim() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", city: "", state: "",
    insurance_type: "Health", insurance_company: "", policy_number: "",
    claim_amount: "", rejection_date: "", rejection_reason: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);

    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) { setSubmitting(false); return toast.error("Not signed in"); }

    const claim_id = `CFS-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("claims").insert({
      ...parsed.data,
      claim_id,
      user_id: uid,
      status: "pending",
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(`Claim ${claim_id} submitted!`);
    navigate({ to: "/dashboard/claims" });
  }

  const ipt = "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  const lbl = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl font-bold text-foreground">Submit a new claim</h1>
      <p className="mt-1 text-sm text-muted-foreground">All claims are reviewed by a licensed advisor.</p>

      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
        <div><label className={lbl}>Full name</label><input className={ipt} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
        <div><label className={lbl}>Mobile</label><input inputMode="numeric" maxLength={10} className={ipt} value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} /></div>
        <div><label className={lbl}>Email</label><input type="email" className={ipt} value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><label className={lbl}>City</label><input className={ipt} value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
        <div><label className={lbl}>State</label><input className={ipt} value={form.state} onChange={(e) => set("state", e.target.value)} /></div>
        <div>
          <label className={lbl}>Insurance type</label>
          <select className={ipt} value={form.insurance_type} onChange={(e) => set("insurance_type", e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label className={lbl}>Insurance company</label><input className={ipt} value={form.insurance_company} onChange={(e) => set("insurance_company", e.target.value)} /></div>
        <div><label className={lbl}>Policy number</label><input className={ipt} value={form.policy_number} onChange={(e) => set("policy_number", e.target.value)} /></div>
        <div><label className={lbl}>Claim amount (₹)</label><input inputMode="numeric" className={ipt} value={form.claim_amount} onChange={(e) => set("claim_amount", e.target.value.replace(/[^\d.]/g, ""))} /></div>
        <div><label className={lbl}>Rejection date</label><input type="date" className={ipt} value={form.rejection_date} onChange={(e) => set("rejection_date", e.target.value)} /></div>
        <div className="md:col-span-2">
          <label className={lbl}>Rejection reason (as stated by insurer)</label>
          <textarea rows={4} className={ipt} value={form.rejection_reason} onChange={(e) => set("rejection_reason", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit claim
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
