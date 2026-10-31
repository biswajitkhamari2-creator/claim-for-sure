import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, Field, inputCx, btnPrimary, btnGhost } from "@/components/AuthCard";
import { api } from "@/lib/api";

export const Route = createFileRoute("/auth/login")({
  component: PhoneLoginPage,
  head: () => ({
    meta: [
      { title: "Login or Sign Up — ClaimForSure" },
      { name: "description", content: "Sign in or create your ClaimForSure account with your mobile number and an OTP." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Login or Sign Up — ClaimForSure" },
      { property: "og:description", content: "Sign in or create your ClaimForSure account with your mobile number and an OTP." },
    ],
  }),
});

const AGREEMENT_VERSION = "1.0";
const mobileRe = /^[6-9]\d{9}$/;

type Step = "phone" | "otp" | "profile";

function PhoneLoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [signupToken, setSignupToken] = useState("");
  const [fullName, setFullName] = useState("");
  const [accept, setAccept] = useState(false);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function sendOtp() {
    if (!mobileRe.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const r = await api.auth.sendOtp(phone);
      setOtp(r.data.dev_otp ?? "");
      setResendIn(r.data.resend_in ?? 30);
      setStep("otp");
      toast.success(`OTP sent to +91 ${phone}`);
    } catch (err) {
      toast.error((err as Error).message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const r = await api.auth.verifyOtp(phone, otp);
      if ("new_user" in r.data) {
        setSignupToken(r.data.signup_token);
        setStep("profile");
        return;
      }
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function completeSignup() {
    if (fullName.trim().length < 2) {
      toast.error("Enter your full name");
      return;
    }
    if (!accept || !acceptAgreement) {
      toast.error("Please accept the Privacy Policy and the Service Agreement");
      return;
    }
    setLoading(true);
    try {
      await api.auth.completeOtpSignup({
        signup_token: signupToken,
        full_name: fullName.trim(),
        accept_terms: accept,
        accept_agreement: acceptAgreement,
      });
      toast.success("Account created!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = (err as Error).message || "Could not create your account";
      toast.error(message);
      // The signup token lasts 15 minutes; after that the number must be verified again.
      if ((err as { status?: number }).status === 401) {
        setStep("phone");
        setOtp("");
      }
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (step === "phone") void sendOtp();
    else if (step === "otp") void verifyOtp();
    else void completeSignup();
  }

  const titles: Record<Step, [string, string]> = {
    phone: ["Login or sign up", "Enter your mobile number. We'll text you a one-time code."],
    otp: ["Enter OTP", `We sent a 6-digit code to +91 ${phone}.`],
    profile: ["Create your account", "Your number is verified. Just a few details to finish."],
  };

  return (
    <AuthShell title={titles[step][0]} subtitle={titles[step][1]}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {step === "phone" && (
          <>
            <Field label="Mobile number">
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-white/15 bg-white/5 px-3 text-sm text-white/70">+91</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  autoFocus
                  className={`${inputCx} rounded-l-none`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                />
              </div>
            </Field>
            <button type="submit" disabled={loading || !mobileRe.test(phone)} className={btnPrimary}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <Field label="One-time code">
              <input
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                className={`${inputCx} text-center text-lg tracking-[0.5em]`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
              />
            </Field>
            <button type="submit" disabled={loading || otp.length !== 6} className={btnPrimary}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & continue"}
            </button>
            <div className="flex items-center justify-between text-xs text-white/70">
              <button type="button" onClick={() => { setStep("phone"); setOtp(""); }} className="inline-flex items-center gap-1 hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" /> Change number
              </button>
              {resendIn > 0 ? (
                <span>Resend OTP in {resendIn}s</span>
              ) : (
                <button type="button" disabled={loading} onClick={() => void sendOtp()} className="font-semibold text-[oklch(0.85_0.14_80)] hover:underline">
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        {step === "profile" && (
          <>
            <Field label="Full name">
              <input name="full_name" autoComplete="name" autoFocus className={inputCx} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
            </Field>

            <label className="flex items-start gap-2.5 text-xs text-white/75">
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 accent-[oklch(0.78_0.14_78)]" />
              <span>
                I accept the{" "}
                <Link to="/privacy" className="text-[oklch(0.85_0.14_80)] underline">Privacy Policy</Link> and{" "}
                <Link to="/terms" className="text-[oklch(0.85_0.14_80)] underline">Terms</Link>.
              </span>
            </label>

            <label className="flex items-start gap-2.5 rounded-lg border border-[oklch(0.78_0.14_78)]/30 bg-[oklch(0.78_0.14_78)]/5 p-3 text-xs text-white/85">
              <input type="checkbox" checked={acceptAgreement} onChange={(e) => setAcceptAgreement(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 accent-[oklch(0.78_0.14_78)]" />
              <span>
                I have read, understood and accept the{" "}
                <Link to="/service-agreement" target="_blank" className="font-semibold text-[oklch(0.85_0.14_80)] underline">ClaimForSure Service Agreement (v{AGREEMENT_VERSION})</Link>,
                including the <strong>processing fee of ₹1,770</strong> on claim approval and the <strong>success fee of 20% + GST</strong> on any amount sanctioned/paid by the insurer.
                I agree this electronic acceptance is legally binding under the IT Act, 2000 and that jurisdiction lies with the courts at Bhubaneswar, Odisha.
              </span>
            </label>

            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Create account</span> <CheckCircle2 className="h-4 w-4" /></>}
            </button>
            <button type="button" onClick={() => { setStep("phone"); setOtp(""); setSignupToken(""); }} className={btnGhost}>
              Use a different number
            </button>
          </>
        )}
      </form>
    </AuthShell>
  );
}
