import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Shield, Loader2, Megaphone, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/notices")({
  ssr: false,
  head: () => ({ meta: [{ title: "Notices — Admin" }] }),
  component: AdminNotices,
});

type Notice = {
  id: string;
  title: string;
  body: string;
  type: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

const TYPE_STYLES: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  offer: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
};

function AdminNotices() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "offer", expires_at: "" });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      if (!isAdmin) {
        toast.error("Admin access required");
        navigate({ to: "/admin/login" });
        return;
      }
      await load();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNotices((data || []) as Notice[]);
  }

  async function createNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      body: form.body.trim(),
      type: form.type,
      active: true,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    const { error } = await supabase.from("notices").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Notice published");
    setForm({ title: "", body: "", type: "offer", expires_at: "" });
    await load();
  }

  async function toggleActive(n: Notice) {
    const { error } = await supabase.from("notices").update({ active: !n.active }).eq("id", n.id);
    if (error) return toast.error(error.message);
    toast.success(n.active ? "Notice hidden" : "Notice shown");
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this notice permanently?")) return;
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await load();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-[oklch(0.2_0.05_265)] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[oklch(0.82_0.14_80)]" />
            <span className="font-serif text-lg font-semibold">Notices</span>
          </Link>
          <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        {/* Create */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-[oklch(0.82_0.14_80)]" />
            <h2 className="font-serif text-xl font-semibold">Create notice / offer</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Notices are shown to all signed-in users on their dashboard until you hide them or they expire.
          </p>
          <form onSubmit={createNotice} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Diwali offer — 10% off claim service fee"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium">Body</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Submit a claim before 30 Nov and get 10% off the assistance fee. T&C apply."
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="offer">Offer</option>
                <option value="info">Information</option>
                <option value="warning">Important</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Expires at (optional)</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.2_0.05_265)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                Publish notice
              </button>
            </div>
          </form>
        </section>

        {/* List */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-semibold">All notices ({notices.length})</h2>
          {notices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notices yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {notices.map((n) => {
                const expired = n.expires_at && new Date(n.expires_at) < new Date();
                return (
                  <li key={n.id} className="flex items-start justify-between gap-4 py-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${TYPE_STYLES[n.type] || TYPE_STYLES.info}`}>
                          {n.type}
                        </span>
                        {!n.active && <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">Hidden</span>}
                        {expired && <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">Expired</span>}
                        <h3 className="text-sm font-semibold">{n.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Created {new Date(n.created_at).toLocaleString()}
                        {n.expires_at && ` · Expires ${new Date(n.expires_at).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(n)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                        title={n.active ? "Hide" : "Show"}
                      >
                        {n.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => remove(n.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
