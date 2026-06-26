import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, inputCx, btnPrimary, btnGhost } from "@/components/AuthCard";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign Up — ClaimForSure" }] }),
});

const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const schema = z
  .object({
    full_name: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().regex(/^\d{10}$/, "Mobile must be exactly 10 digits"),
    password: z.string().regex(passwordRe, "8+ chars with upper, lower, number, special"),
    confirm: z.string(),
    accept: z.literal(true, { errorMap: () => ({ message: "You must accept the Privacy Policy" }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

function SignupPage() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", confirm: "", accept: false });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const validation = useMemo(() => schema.safeParse(form), [form]);
  const valid = validation.success;
  const errors: Record<string, string> = !valid
    ? Object.fromEntries(validation.error.errors.map((e) => [e.path[0] as string, e.message]))
    : {};

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function startCooldown() {
    setCooldown(60);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: getAuthRedirectUrl("/auth/verified"),
        data: { full_name: form.full_name.trim(), phone: form.phone },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    startCooldown();
    toast.success("Verification email sent.");
  }

  async function resend() {
    if (cooldown > 0) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email.trim(),
      options: { emailRedirectTo: getAuthRedirectUrl("/auth/verified") },
    });
    if (error) toast.error(error.message);
    else { toast.success("Verification email resent."); startCooldown(); }
  }

  if (sent) {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a verification link to ${form.email}`}>
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-white/80">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.85_0.14_80)]" />
            <p>Open the email and click the verification link. You must verify your email before logging in.</p>
          </div>
          <button onClick={resend} disabled={cooldown > 0} className={btnPrimary}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
          </button>
          <Link to="/auth/login" className={btnGhost}>Go to login</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track your claim end-to-end."
      footer={<>Already have an account? <Link to="/auth/login" className="font-semibold text-[oklch(0.85_0.14_80)] hover:underline">Login</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" error={form.full_name ? errors.full_name : undefined}>
          <input className={inputCx} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Your name" />
        </Field>
        <Field label="Email" error={form.email ? errors.email : undefined}>
          <input type="email" autoComplete="email" className={inputCx} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Mobile (10 digits)" error={form.phone ? errors.phone : undefined}>
          <input inputMode="numeric" maxLength={10} className={inputCx} value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} placeholder="9876543210" />
        </Field>
        <Field label="Password" error={form.password ? errors.password : undefined}>
          <div className="relative">
            <input type={show ? "text" : "password"} autoComplete="new-password" className={inputCx} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-white/60 hover:text-white">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password" error={form.confirm ? errors.confirm : undefined}>
          <input type={show ? "text" : "password"} autoComplete="new-password" className={inputCx} value={form.confirm} onChange={(e) => set("confirm", e.target.value)} placeholder="••••••••" />
        </Field>

        <label className="flex items-start gap-2.5 text-xs text-white/75">
          <input type="checkbox" checked={form.accept} onChange={(e) => set("accept", e.target.checked as never)} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 accent-[oklch(0.78_0.14_78)]" />
          <span>
            I accept the{" "}
            <Link to="/privacy" className="text-[oklch(0.85_0.14_80)] underline">Privacy Policy</Link> and{" "}
            <Link to="/terms" className="text-[oklch(0.85_0.14_80)] underline">Terms</Link>.
          </span>
        </label>

        <button type="submit" disabled={!valid || loading} className={btnPrimary}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <CheckCircle2 className="h-4 w-4" /></>}
        </button>
      </form>
    </AuthShell>
  );
}
