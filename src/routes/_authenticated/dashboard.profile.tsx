import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — ClaimForSure" }] }),
});

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      const uid = u.user?.id;
      if (!uid) return;
      const { data } = await supabase.from("profiles").select("full_name, phone, avatar_url").eq("user_id", uid).maybeSingle();
      setFullName(data?.full_name ?? "");
      setPhone(data?.phone ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
      setLoading(false);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (phone && !/^\d{10}$/.test(phone)) return toast.error("Mobile must be exactly 10 digits");
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user!.id;
    const { error } = await supabase.from("profiles").upsert(
      { user_id: uid, email, full_name: fullName, phone, avatar_url: avatarUrl || null },
      { onConflict: "user_id" },
    );
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  if (loading) return <DashboardShell><div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></DashboardShell>;

  const ipt = "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  const lbl = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Update your contact details. Email changes require re-verification.</p>

      <form onSubmit={save} className="mt-8 max-w-xl space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <label className={lbl}>Email (read-only)</label>
          <input className={ipt} value={email} disabled />
        </div>
        <div>
          <label className={lbl}>Full name</label>
          <input className={ipt} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Mobile (10 digits)</label>
          <input inputMode="numeric" maxLength={10} className={ipt} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
        </div>
        <div>
          <label className={lbl}>Avatar URL (optional)</label>
          <input className={ipt} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
          {avatarUrl && <img src={avatarUrl} alt="" className="mt-3 h-20 w-20 rounded-full border border-border object-cover" />}
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </button>
      </form>
    </DashboardShell>
  );
}
