import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, inputCx, btnPrimary } from "@/components/AuthCard";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordRe.test(password)) return toast.error("Password must have 8+ chars, upper, lower, number, special.");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please log in.");
    await supabase.auth.signOut();
    navigate({ to: "/auth/login" });
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password.">
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
    </AuthShell>
  );
}
