import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, inputCx, btnGhost, btnPrimary } from "@/components/AuthCard";

export const Route = createFileRoute("/auth/reset")({
  component: ResetPage,
  head: () => ({ meta: [{ title: "New Password — ClaimForSure" }] }),
});

const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState<"checking" | "ready" | "missing">("checking");

  useEffect(() => {
    let active = true;

    async function prepareRecoverySession() {
      const params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const errorDescription = hash.get("error_description") || params.get("error_description");

      if (errorDescription) {
        toast.error(errorDescription.replace(/\+/g, " "));
        if (active) setSessionReady("missing");
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) toast.error(error.message);
      }

      const { data } = await supabase.auth.getSession();
      if (active) setSessionReady(data.session ? "ready" : "missing");
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setSessionReady("ready");
    });

    prepareRecoverySession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordRe.test(password)) return toast.error("Password must have 8+ chars, upper, lower, number, special.");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setLoading(false);
      setSessionReady("missing");
      toast.error("Please open the latest reset link from your email.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please log in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth/login" });
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password.">
      {sessionReady === "checking" ? (
        <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-white/80">
          <Loader2 className="h-5 w-5 animate-spin text-[oklch(0.85_0.14_80)]" />
          Checking your secure reset link…
        </div>
      ) : sessionReady === "missing" ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>This reset link is missing, expired, or already used. Request a fresh link and open it from the same browser.</p>
          </div>
          <button type="button" onClick={() => navigate({ to: "/auth/forgot" })} className={btnGhost}>
            Request new reset link
          </button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="New password">
          <div className="relative">
            <input type={show ? "text" : "password"} className={inputCx} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-white/60 hover:text-white">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password">
          <input type={show ? "text" : "password"} className={inputCx} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </button>
      </form>
      )}
    </AuthShell>
  );
}
