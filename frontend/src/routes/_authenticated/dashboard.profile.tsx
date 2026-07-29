import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api, type AuthUser } from "@/lib/api";
import { getCachedUser } from "@/lib/phpAuth";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — ClaimForSure" }] }),
});

function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      // Show cached data instantly if valid
      const cached = getCachedUser();
      if (cached && (cached.email || cached.full_name || (cached as any).name)) {
        setUser(cached);
        setFullName(cached.full_name ?? (cached as any).name ?? "");
        setPhone(cached.phone ?? "");
        setLoading(false);
      }
      // Refresh from backend
      try {
        const res = await api.auth.me();
        const raw = res?.data ?? res;
        const u = (raw?.user ?? (raw?.email ? raw : null)) as AuthUser | null;
        if (u) {
          setUser(u);
          setFullName(u.full_name ?? (u as any).name ?? "");
          setPhone(u.phone ?? "");
          localStorage.setItem("cfs_user", JSON.stringify(u));
        }
      } catch { /* keep cached data */ }
      finally { setLoading(false); }
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (phone && !/^\d{10}$/.test(phone)) return toast.error("Mobile must be exactly 10 digits");
    setSaving(true);
    try {
      const res = await api.auth.updateProfile({ full_name: fullName, phone });
      const raw = res?.data ?? res;
      const updated = (raw?.user ?? (raw?.email ? raw : null)) as AuthUser | null;
      if (updated) {
        setUser(updated);
        localStorage.setItem("cfs_user", JSON.stringify(updated));
      }
      toast.success("Profile details saved successfully");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <DashboardShell>
      <div className="flex justify-center py-20"><Loader2 className="h-6 w-6animate-spin text-muted-foreground" /></div>
    </DashboardShell>
  );

  const ipt = "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  const lbl = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <DashboardShell>
      <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">View your account details.</p>

      <form onSubmit={save} className="mt-8 max-w-xl space-y-5 rounded-xl border border-border bg-card p-6">
        <div>
          <label className={lbl}>Email (read-only)</label>
          <input className={ipt} value={user?.email ?? ""} disabled />
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
          <label className={lbl}>Role</label>
          <input className={ipt} value={user?.role ?? "customer"} disabled />
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </button>
      </form>
    </DashboardShell>
  );
}
