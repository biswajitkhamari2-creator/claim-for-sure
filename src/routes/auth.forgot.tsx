import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, inputCx, btnPrimary } from "@/components/AuthCard";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "Reset Password — ClaimForSure" }] }),
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = z.string().email().safeParse(email.trim());
    if (!parsed.success) return toast.error("Enter a valid email");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Password reset link sent.");
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll email you a reset link."
      footer={<><Link to="/auth/login" className="hover:underline">Back to login</Link></>}
    >
      {sent ? (
        <div className="space-y-4 text-sm text-white/80">
          <div className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.85_0.14_80)]" />
            <p>If an account exists for <strong>{email}</strong>, a reset link is on its way.</p>
          </div>
          <Link to="/auth/login" className={btnPrimary}>Return to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email">
            <input type="email" className={inputCx} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </Field>
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
